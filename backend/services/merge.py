from config import USE_SPOTIFY
from services import itunes

if USE_SPOTIFY:
    from services import spotify


def enrich_tracks(llm_tracks: list[dict]) -> list[dict]:
    for track in llm_tracks:
        result = None
        via = "none"

        if USE_SPOTIFY:
            result = spotify.search_track(track["search_query"])
            if result is None:
                result = spotify.search_track(track["artist"])
            if result:
                via = "spotify"

        if result is None:
            result = itunes.search_track(track["track_name"], track["artist"])
            if result:
                via = "itunes"

        if result:
            track.update({**result, "spotify_found": True, "resolved_via": via})
        else:
            track.update({
                "album": None,
                "album_art": None,
                "spotify_url": None,
                "preview_url": None,
                "uri": None,
                "spotify_found": False,
                "resolved_via": "none",
            })

    return llm_tracks
