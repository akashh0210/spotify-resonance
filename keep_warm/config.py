from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

# Load local overrides first; platform env vars already present take precedence.
_root = Path(__file__).parent
load_dotenv(_root / ".env")
load_dotenv(_root.parent / ".env.local")


@dataclass(frozen=True)
class Config:
    target_urls: tuple[str, ...]
    ping_interval_seconds: int        # base cadence
    jitter_seconds: int               # ±jitter added per execution
    request_timeout: float            # per-attempt HTTP timeout
    max_retries: int                  # retries per ping cycle
    cb_failure_threshold: int         # consecutive failures → OPEN
    cb_recovery_seconds: int          # seconds before OPEN → HALF_OPEN
    alert_webhook_url: str | None     # optional HTTP POST on sustained failure
    alert_after_failures: int         # fire alert after N consecutive failures
    log_level: str

    @classmethod
    def from_env(cls) -> Config:
        raw = os.getenv("TARGET_URLS", "https://spotify-resonance.onrender.com/health")
        urls = tuple(u.strip() for u in raw.split(",") if u.strip())
        return cls(
            target_urls=urls,
            ping_interval_seconds=int(os.getenv("PING_INTERVAL_SECONDS", "600")),
            jitter_seconds=int(os.getenv("JITTER_SECONDS", "120")),
            request_timeout=float(os.getenv("REQUEST_TIMEOUT", "15.0")),
            max_retries=int(os.getenv("MAX_RETRIES", "3")),
            cb_failure_threshold=int(os.getenv("CB_FAILURE_THRESHOLD", "3")),
            cb_recovery_seconds=int(os.getenv("CB_RECOVERY_SECONDS", "300")),
            alert_webhook_url=os.getenv("ALERT_WEBHOOK_URL") or None,
            alert_after_failures=int(os.getenv("ALERT_AFTER_FAILURES", "3")),
            log_level=os.getenv("LOG_LEVEL", "INFO"),
        )
