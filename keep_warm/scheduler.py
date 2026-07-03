"""
Entry point for the keep-warm scheduler.

Design decisions
----------------
- BackgroundScheduler (APScheduler 3.x) runs jobs in a thread pool.
  Each job calls asyncio.run() — safe because asyncio.run() creates
  and tears down its own event loop per call. No shared loop state.

- max_instances=1 per job prevents pileup if a ping hangs past the
  next trigger time (e.g. Render is very slow to respond during cold start).

- APScheduler's native jitter= parameter randomises the trigger time
  within [0, jitter_seconds] so multiple scheduler instances (if any)
  don't fire in lockstep — avoids accidental DDoS patterns.

- misfire_grace_time=60 means if the scheduler process was paused
  (GC, OOM, host maintenance) and misses a fire by <60s, it fires
  immediately instead of skipping. If missed by >60s it skips cleanly.

- A file-based singleton lock prevents two processes on the same host
  from running the scheduler simultaneously (e.g. accidental double-start
  in Docker Compose). For multi-host distributed deployments, replace
  with a Redis SETNX lock.

Render free-tier note
---------------------
Deploy this as a Background Worker (not a Web Service). Background
workers are not subject to the HTTP-inactivity sleep rule — they run
as long as the OS process is alive. The 750 free-hour/month limit
applies; this service uses all of them (24h × 31d ≈ 744h).
"""
from __future__ import annotations

import asyncio
import fcntl
import logging
import os
import random
import signal
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from apscheduler.events import EVENT_JOB_ERROR, EVENT_JOB_MISSED
from apscheduler.schedulers.background import BackgroundScheduler

from keep_warm.circuit_breaker import CircuitBreaker
from keep_warm.config import Config
from keep_warm.logging_config import configure_logging
from keep_warm.pinger import ping

log = logging.getLogger(__name__)

_LOCK_FILE = Path("/tmp/keep_warm.lock")


def _acquire_singleton_lock() -> int:
    """
    Open and exclusively lock a file.  Returns the fd so the caller can
    hold it for the process lifetime.  Raises SystemExit if another
    instance already holds the lock.
    """
    fd = os.open(str(_LOCK_FILE), os.O_WRONLY | os.O_CREAT, 0o600)
    try:
        fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        log.error("Another keep-warm instance is running — exiting.")
        sys.exit(1)
    os.write(fd, str(os.getpid()).encode())
    return fd


def _make_job(url: str, cfg: Config, cb: CircuitBreaker):
    """
    Returns a zero-argument callable that APScheduler can invoke.

    Per-call jitter: in addition to APScheduler's trigger-level jitter
    (which shifts the scheduled time), we add a small random sleep inside
    the job itself.  This provides a second layer of jitter so that even
    if multiple instances somehow fire at the same millisecond, they don't
    all hit the backend simultaneously.
    """
    def _job() -> None:
        extra_jitter = random.uniform(0, min(30, cfg.jitter_seconds // 4))
        if extra_jitter > 0:
            time.sleep(extra_jitter)
        asyncio.run(ping(url, cfg, cb))

    _job.__name__ = f"ping_{url}"
    return _job


def run() -> None:
    cfg = Config.from_env()
    configure_logging(cfg.log_level)

    lock_fd = _acquire_singleton_lock()

    log.info(
        "keep-warm scheduler starting",
        extra={
            "targets": list(cfg.target_urls),
            "interval_s": cfg.ping_interval_seconds,
            "jitter_s": cfg.jitter_seconds,
            "max_retries": cfg.max_retries,
            "cb_threshold": cfg.cb_failure_threshold,
        },
    )

    scheduler = BackgroundScheduler(timezone="UTC")
    circuit_breakers: dict[str, CircuitBreaker] = {}

    for url in cfg.target_urls:
        cb = CircuitBreaker(
            threshold=cfg.cb_failure_threshold,
            recovery_seconds=cfg.cb_recovery_seconds,
        )
        circuit_breakers[url] = cb

        scheduler.add_job(
            func=_make_job(url, cfg, cb),
            trigger="interval",
            seconds=cfg.ping_interval_seconds,
            jitter=cfg.jitter_seconds,
            id=f"ping_{url}",
            max_instances=1,
            misfire_grace_time=60,
            # Fire immediately on startup rather than waiting one full interval.
            next_run_time=datetime.now(timezone.utc),
        )
        log.info("Job registered", extra={"url": url})

    def _on_scheduler_event(event) -> None:
        if hasattr(event, "exception") and event.exception:
            log.error(
                "Scheduler job raised exception",
                extra={"job_id": event.job_id, "error": str(event.exception)},
                exc_info=event.traceback,
            )
        elif hasattr(event, "scheduled_run_time"):
            log.warning(
                "Job misfired (missed scheduled time)",
                extra={"job_id": event.job_id},
            )

    scheduler.add_listener(_on_scheduler_event, EVENT_JOB_ERROR | EVENT_JOB_MISSED)
    scheduler.start()

    def _shutdown(signum, frame) -> None:
        log.info("Received signal — shutting down", extra={"signal": signum})
        scheduler.shutdown(wait=False)
        os.close(lock_fd)
        sys.exit(0)

    signal.signal(signal.SIGTERM, _shutdown)
    signal.signal(signal.SIGINT, _shutdown)

    # Keep main thread alive with minimal CPU burn.
    try:
        while True:
            time.sleep(30)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown(wait=False)
        os.close(lock_fd)


if __name__ == "__main__":
    run()
