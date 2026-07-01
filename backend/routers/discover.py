from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.services import llm

router = APIRouter()


class DiscoverRequest(BaseModel):
    intent: str
    novelty_level: int = Field(ge=1, le=5)


class TrackOut(BaseModel):
    track_name: str
    artist: str
    search_query: str
    explanation: str
    novelty_tag: str


class DiscoverResponse(BaseModel):
    intent: str
    novelty_level: int
    tracks: list[TrackOut]


@router.post("/discover", response_model=DiscoverResponse)
def discover(req: DiscoverRequest) -> DiscoverResponse:
    try:
        raw_tracks = llm.get_recommendations(req.intent, req.novelty_level)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM error: {exc}") from exc

    tracks = [TrackOut(**t) for t in raw_tracks]
    return DiscoverResponse(
        intent=req.intent,
        novelty_level=req.novelty_level,
        tracks=tracks,
    )
