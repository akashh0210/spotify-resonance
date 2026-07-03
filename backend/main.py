import time
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import CORS_ORIGINS
from routers import discover

_START_TIME = time.monotonic()
VERSION = "1.0.0"

app = FastAPI(title="Resonance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(discover.router, prefix="/api")


@app.get("/health")
def health():
    # No DB queries, no external calls — pure in-process state only.
    return {
        "status": "ok",
        "uptime_seconds": round(time.monotonic() - _START_TIME, 2),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": VERSION,
    }
