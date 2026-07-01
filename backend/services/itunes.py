from urllib.parse import quote_plus

import httpx

_SEARCH_URL = "https://itunes.apple.com/search"


def search_track(track_name: str, artist: str) -> dict | None:
    query = f"{track_name} {artist}"
    resp = httpx.get(
        _SEARCH_URL,
        params={"term": query, "entity": "song", "limit": 1},
        timeout=10,
    )
    resp.raise_for_status()
    results = resp.json().get("results", [])
    if not results:
        return None

    r = results[0]
    art_raw = r.get("artworkUrl100", "")
    art = art_raw.replace("100x100bb", "600x600bb") if art_raw else None

    spotify_search = f"https://open.spotify.com/search/{quote_plus(query)}"

    return {
        "track_name": r.get("trackName"),
        "artist": r.get("artistName"),
        "album": r.get("collectionName"),
        "album_art": art,
        "spotify_url": spotify_search,
        "preview_url": r.get("previewUrl"),
        "uri": None,
    }
