import base64
import time

import httpx

from config import SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET

_TOKEN_URL = "https://accounts.spotify.com/api/token"
_SEARCH_URL = "https://api.spotify.com/v1/search"

_token: str | None = None
_token_expires_at: float = 0.0


def get_token() -> str:
    global _token, _token_expires_at
    if _token and time.time() < _token_expires_at:
        return _token

    credentials = base64.b64encode(
        f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}".encode()
    ).decode()

    resp = httpx.post(
        _TOKEN_URL,
        headers={"Authorization": f"Basic {credentials}"},
        data={"grant_type": "client_credentials"},
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()

    _token = data["access_token"]
    _token_expires_at = time.time() + 55 * 60  # 55-min TTL (tokens last 60 min)
    return _token


def search_track(query: str) -> dict | None:
    token = get_token()
    resp = httpx.get(
        _SEARCH_URL,
        params={"q": query, "type": "track", "limit": 1},
        headers={"Authorization": f"Bearer {token}"},
        timeout=10,
    )
    resp.raise_for_status()
    items = resp.json().get("tracks", {}).get("items", [])
    if not items:
        return None

    item = items[0]
    images = item.get("album", {}).get("images", [])
    album_art = images[0]["url"] if images else None

    return {
        "track_name": item["name"],
        "artist": item["artists"][0]["name"] if item.get("artists") else None,
        "album": item.get("album", {}).get("name"),
        "album_art": album_art,
        "spotify_url": item.get("external_urls", {}).get("spotify"),
        "preview_url": item.get("preview_url"),
        "uri": item.get("uri"),
    }
