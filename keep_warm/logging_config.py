"""
Structured JSON logger — no external deps beyond stdlib.

Each log record emits a single JSON line with:
  ts        ISO-8601 UTC timestamp
  level     DEBUG / INFO / WARNING / ERROR
  logger    dotted module name
  msg       human-readable message
  **extra   any fields passed via extra={}
"""
from __future__ import annotations

import json
import logging
import sys
from datetime import datetime, timezone


class _JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "msg": record.getMessage(),
        }
        # Merge any extra= fields the caller attached
        skip = logging.LogRecord.__dict__.keys() | {
            "message", "asctime", "msecs", "relativeCreated",
            "thread", "threadName", "processName", "process",
            "pathname", "filename", "module", "funcName", "lineno",
            "exc_info", "exc_text", "stack_info",
        }
        for k, v in record.__dict__.items():
            if k not in skip:
                payload[k] = v

        if record.exc_info:
            payload["exc"] = self.formatException(record.exc_info)

        return json.dumps(payload, default=str)


def configure_logging(level: str = "INFO") -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(_JsonFormatter())

    root = logging.getLogger()
    root.setLevel(getattr(logging, level.upper(), logging.INFO))
    root.handlers.clear()
    root.addHandler(handler)

    # Silence noisy third-party loggers
    for noisy in ("httpx", "httpcore", "apscheduler.executors"):
        logging.getLogger(noisy).setLevel(logging.WARNING)
