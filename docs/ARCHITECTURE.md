# ARCHITECTURE.md — Resonance MVP

> Living document. Updated at the end of each build phase.
> This is the as-built map. PROJECT.md is the spec.

## System Overview

```
┌─────────────────┐     ┌──────────────────────────────────────┐
│                 │     │           BACKEND (FastAPI)           │
│   FRONTEND      │     │                                      │
│   (Next.js)     │────▶│  /api/discover                       │
│                 │     │    │                                  │
│   Vercel        │     │    ├─▶ Gemini 2.5 Flash                │
│                 │     │    │   System prompt with community   │
│                 │◀────│    │   intelligence from 5,708 reviews│
│                 │     │    │   Returns 8 tracks + explanations│
│                 │     │    │                                  │
│                 │     │    └─▶ Spotify Search API             │
│                 │     │        Resolves each track            │
│                 │     │        Returns art, URL, preview      │
│                 │     │                                      │
│                 │     │  /api/auth/spotify (OAuth PKCE)       │
│                 │     │  /api/playlist/create                 │
│                 │     │                                      │
│                 │     │           Render (free tier)          │
└─────────────────┘     └──────────────────────────────────────┘
```

## Data Flow

```
User intent + novelty level
        │
        ▼
   FastAPI /api/discover
        │
        ├──▶ Build LLM prompt
        │    (intent + novelty + community intelligence)
        │
        ├──▶ Gemini API call (gemini-2.5-flash)
        │    Temperature: 0.7
        │    Output: JSON array of 8 tracks
        │
        ├──▶ Parse + validate JSON
        │    (retry once on parse failure)
        │
        ├──▶ For each track: Spotify Search API
        │    GET /v1/search?q={search_query}&type=track&limit=1
        │    Extract: track URI, album art, preview URL, spotify URL
        │    Fallback: retry with artist-only query
        │
        ├──▶ Merge LLM explanations + Spotify metadata
        │
        └──▶ Return 8 enriched track objects to frontend
```

## Phase Status

| Phase | Description | Status | Notes |
|-------|-------------|--------|-------|
| 1 | Backend core (FastAPI + Gemini LLM) | PENDING | |
| 2 | Spotify Search integration | PENDING | |
| 3 | Frontend shell (Next.js Spotify replica) | PENDING | |
| 4 | Polish + OAuth + playlist creation | PENDING | |
| 5 | Deploy (Vercel + Render) + iterate | PENDING | |

## Phase 1 — Backend Core

**Goal:** FastAPI app that takes intent + novelty and returns 8 tracks
with explanations from the LLM.

**Files:**
- `backend/main.py` — FastAPI app, CORS, health check
- `backend/routers/discover.py` — POST /api/discover endpoint
- `backend/services/llm.py` — Gemini LLM call with system prompt
- `backend/config.py` — env vars, model constants

**Flow:**
1. Receive `{ intent, novelty_level }` via POST
2. Build the system prompt (community intelligence baked in)
3. Call Gemini `gemini-2.5-flash` with temperature 0.7
4. Parse the JSON array of 8 tracks
5. Return raw LLM output (no Spotify metadata yet)

**Test:** `curl -X POST http://localhost:8000/api/discover -H "Content-Type: application/json" -d '{"intent": "something like Anuv Jain but more upbeat", "novelty_level": 3}'`

**Exit criteria:** Returns valid JSON with 8 tracks, each having
track_name, artist, explanation, novelty_tag.

---

## Phase 2 — Spotify Search Integration

**Goal:** Enrich each LLM track with real Spotify metadata.

**Files:**
- `backend/services/spotify.py` — client credentials auth, search, token cache
- `backend/services/merge.py` — merge LLM output + Spotify results

**Flow:**
1. On app startup, obtain Spotify client credentials token
2. Cache token with 55-minute TTL (tokens last 60 min)
3. For each of the 8 LLM tracks:
   - Search: `GET /v1/search?q={search_query}&type=track&limit=1`
   - Extract: track name, artist, album, album_art (image URL),
     external_url, preview_url, uri
   - On 0 results: retry with artist name only
   - On still 0: mark as `spotify_found: false`, keep LLM explanation
4. Merge into final response objects

**Exit criteria:** /api/discover returns 8 tracks with album art URLs,
Spotify links, and preview URLs alongside explanations.

---

## Phase 3 — Frontend Shell

**Goal:** Pixel-accurate Spotify replica with Resonance feature.

**Files:**
- `frontend/app/layout.tsx` — Spotify shell (sidebar + topbar)
- `frontend/app/page.tsx` — Screen 1 (intent + novelty + discover)
- `frontend/app/globals.css` — Spotify design tokens
- `frontend/components/Sidebar.tsx` — Spotify sidebar replica
- `frontend/components/TopBar.tsx` — Spotify top bar
- `frontend/components/IntentInput.tsx` — text input for intent
- `frontend/components/NoveltySlider.tsx` — 5-stop slider
- `frontend/components/ExplainerCards.tsx` — 3 "why" cards
- `frontend/components/ExamplePrompts.tsx` — clickable prompt chips
- `frontend/components/TrackCard.tsx` — result card with explanation
- `frontend/lib/api.ts` — backend API fetch wrapper

**Screens:**
1. Landing: intent input + novelty slider + example prompts + explainer cards
2. Results: 8 track cards in grid with explanations + action buttons

**Exit criteria:** User can type intent, select novelty, click Discover,
see 8 track cards with album art and explanations. Looks like Spotify.

---

## Phase 4 — Polish + OAuth

**Goal:** Production-ready UX + Spotify playlist creation.

**Files:**
- `backend/routers/auth.py` — Spotify OAuth PKCE flow
- `backend/routers/playlist.py` — playlist creation endpoint
- `frontend/lib/spotify-auth.ts` — OAuth PKCE client helpers
- `frontend/components/PlaylistButton.tsx` — save as playlist

**Features:**
- Loading skeleton during discovery (shimmer cards)
- Error states (API down, no results, rate limit)
- Mobile responsive (sidebar collapses to hamburger)
- 30-second preview player on track cards
- OAuth login → "Save as Playlist" creates real Spotify playlist
- Hover transitions on cards (scale, shadow)
- Keyboard accessible

**Exit criteria:** Polished, responsive, working OAuth + playlist creation.

---

## Phase 5 — Deploy + Iterate

**Backend deploy (Render):**
- Procfile: `web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- Environment variables: GEMINI_API_KEY, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET
- CORS allowed origins: Vercel frontend URL

**Frontend deploy (Vercel):**
- Connect GitHub repo, set root directory to `frontend/`
- Environment variable: NEXT_PUBLIC_API_URL = Render backend URL

**Post-deploy checklist:**
- [ ] Both URLs load without errors
- [ ] Discovery works end-to-end (intent → cards with art)
- [ ] Explanations are specific, not generic
- [ ] Novelty dial produces visibly different results at 1 vs 5
- [ ] Playlist creation works (OAuth → save)
- [ ] Mobile layout works
- [ ] Loading states and error handling work

**Exit criteria:** Public URLs work. Grader can discover, read explanations,
and create a playlist without hitting any errors.

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| LLM | Gemini 2.5 Flash | 1,500 req/day free tier, strong music knowledge, JSON mode |
| Search API only | No deprecated endpoints | Spotify deprecated Recs/AudioFeatures Nov 2024 |
| Separate backend | FastAPI on Render | Keeps Spotify secrets server-side, CORS controlled |
| Client credentials for Search | No user auth needed for discovery | Grader can use immediately without login |
| OAuth only for playlist | User-initiated, optional | Discovery works without auth — auth adds value, doesn't gate it |
| Community intelligence in prompt | Static, from review engine | The moat — PP doesn't have population-level insight |
