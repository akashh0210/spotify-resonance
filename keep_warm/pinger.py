"""
Async HTTP pinger with:
  - per-attempt timeout
  - exponential backoff + full jitter on transient failures
  - circuit breaker integration
  - latency logging
  - optional webhook alert on sustained downtime
"""
from __future__ import annotations

import asyncio
import logging
import random
import time

import httpx

from keep_warm.circuit_breaker import CircuitBreaker, State
from keep_warm.config import Config

log = logging.getLogger(__name__)


async def _fire_alert(webhook_url: str, url: str, failures: int) -> None:
    payload = {
        "text": f":red_circle: *keep-warm alert*: `{url}` has been unreachable "
                f"for {failures} consecutive attempts.",
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.post(webhook_url, json=payload)
    except Exception as exc:
        log.warning("Alert webhook delivery failed", extra={"error": str(exc)})


async def ping(url: str, cfg: Config, cb: CircuitBreaker) -> None:
    """
    Run one ping cycle against *url*.

    Skips if the circuit is OPEN (backend is known-down, suppresses log spam).
    Retries up to cfg.max_retries times with exponential backoff + full jitter.
    Records success/failure into the circuit breaker.
    Fires alert webhook after cfg.alert_after_failures consecutive failures.
    """
    if not cb.allow_request():
        log.info(
            "Circuit OPEN — skipping ping",
            extra={"url": url, "state": cb.state, "failures": cb.consecutive_failures},
        )
        return

    last_error: str | None = None

    for attempt in range(1, cfg.max_retries + 1):
        t0 = time.monotonic()
        try:
            async with httpx.AsyncClient(timeout=cfg.request_timeout) as client:
                resp = await client.get(url)
            latency_ms = round((time.monotonic() - t0) * 1000, 1)

            if resp.status_code < 500:
                cb.record_success()
                log.info(
                    "ping ok",
                    extra={
                        "url": url,
                        "status": resp.status_code,
                        "latency_ms": latency_ms,
                        "attempt": attempt,
                        "cb_state": cb.state,
                    },
                )
                return

            # 5xx — treat as failure but still retry
            last_error = f"HTTP {resp.status_code}"

        except (httpx.TimeoutException, httpx.ConnectError, httpx.ReadError) as exc:
            latency_ms = round((time.monotonic() - t0) * 1000, 1)
            last_error = type(exc).__name__

        if attempt < cfg.max_retries:
            # Full jitter: sleep ∈ [0, min(cap, base * 2^attempt)]
            cap = 30.0
            base = 1.0
            backoff = random.uniform(0, min(cap, base * (2 ** attempt)))
            log.warning(
                "ping failed — retrying",
                extra={"url": url, "attempt": attempt, "error": last_error, "backoff_s": round(backoff, 1)},
            )
            await asyncio.sleep(backoff)

    # All attempts exhausted
    cb.record_failure()
    log.error(
        "ping failed after all retries",
        extra={
            "url": url,
            "error": last_error,
            "attempts": cfg.max_retries,
            "cb_state": cb.state,
            "consecutive_failures": cb.consecutive_failures,
        },
    )

    if (
        cfg.alert_webhook_url
        and cb.consecutive_failures >= cfg.alert_after_failures
        and cb.state == State.OPEN
    ):
        await _fire_alert(cfg.alert_webhook_url, url, cb.consecutive_failures)
