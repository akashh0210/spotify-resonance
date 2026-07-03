import os
from pathlib import Path
from dotenv import load_dotenv

_root = Path(__file__).parent.parent
load_dotenv(_root / ".env.local")
load_dotenv(_root / ".env")

GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL: str = "gemini-2.5-flash"
GEMINI_TEMPERATURE: float = 0.7
FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3001")
CORS_ORIGINS: list[str] = list({FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"})

SPOTIFY_CLIENT_ID: str | None = os.getenv("SPOTIFY_CLIENT_ID") or None
SPOTIFY_CLIENT_SECRET: str | None = os.getenv("SPOTIFY_CLIENT_SECRET") or None
USE_SPOTIFY: bool = bool(SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET)
