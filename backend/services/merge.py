from backend.services import spotify


def enrich_tracks(llm_tracks: list[dict]) -> list[dict]:
    for track in llm_tracks:
        result = spotify.search_track(track["search_query"])

        if result is None:
            result = spotify.search_track(track["artist"])

        if result:
            track.update({
                "album": result["album"],
                "album_art": result["album_art"],
                "spotify_url": result["spotify_url"],
                "preview_url": result["preview_url"],
                "spotify_uri": result["uri"],
                "spotify_found": True,
            })
        else:
            track.update({
                "album": None,
                "album_art": None,
                "spotify_url": None,
                "preview_url": None,
                "spotify_uri": None,
                "spotify_found": False,
            })

    return llm_tracks
