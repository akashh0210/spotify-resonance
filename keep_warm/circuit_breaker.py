"""
Three-state circuit breaker for per-URL health tracking.

States
------
CLOSED    — normal operation; all pings go through.
OPEN      — backend appears down; pings are suppressed to avoid log spam
            until recovery_seconds elapses.
HALF_OPEN — one test ping allowed; success → CLOSED, failure → OPEN.

Thread safety: protected by threading.Lock so APScheduler's thread pool
cannot produce race conditions on state transitions.
"""
from __future__ import annotations

import threading
import time
from enum import Enum


class State(str, Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"


class CircuitBreaker:
    def __init__(self, threshold: int = 3, recovery_seconds: float = 300.0) -> None:
        self._threshold = threshold
        self._recovery = recovery_seconds
        self._failures = 0
        self._last_failure_at: float | None = None
        self._state = State.CLOSED
        self._lock = threading.Lock()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    @property
    def state(self) -> State:
        with self._lock:
            return self._resolved_state()

    @property
    def consecutive_failures(self) -> int:
        with self._lock:
            return self._failures

    def allow_request(self) -> bool:
        with self._lock:
            s = self._resolved_state()
            return s in (State.CLOSED, State.HALF_OPEN)

    def record_success(self) -> None:
        with self._lock:
            self._failures = 0
            self._last_failure_at = None
            self._state = State.CLOSED

    def record_failure(self) -> None:
        with self._lock:
            self._failures += 1
            self._last_failure_at = time.monotonic()
            if self._failures >= self._threshold:
                self._state = State.OPEN

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _resolved_state(self) -> State:
        """Auto-transition OPEN → HALF_OPEN after recovery window."""
        if (
            self._state == State.OPEN
            and self._last_failure_at is not None
            and time.monotonic() - self._last_failure_at >= self._recovery
        ):
            return State.HALF_OPEN
        return self._state
