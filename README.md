# Resonance — AI Music Discovery Feature for Spotify

> **Live:** [spotify-resonance.vercel.app](https://spotify-resonance.vercel.app) &nbsp;·&nbsp; **API:** [spotify-resonance.onrender.com/health](https://spotify-resonance.onrender.com/health)

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?logo=google&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel&logoColor=white)
![Deployed on Render](https://img.shields.io/badge/Render-deployed-46E3B7?logo=render&logoColor=white)

---

Resonance is a **Spotify feature prototype** that replaces the scroll-and-hope discovery loop with a natural language interface. Describe your mood in plain words, get 8 tracks with per-track reasoning, and dial exactly how far to push outside your comfort zone.

Built inside a pixel-accurate Spotify shell. The shell is indistinguishable from the real Spotify Web Player — sidebar, topbar, player bar, library — because the point is that this *is* a Spotify feature, not a separate app.

---

## Table of Contents

- [The Problem](#the-problem)
- [How Resonance Works](#how-resonance-works)
- [vs. Spotify Prompted Playlist](#vs-spotify-prompted-playlist)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Deploy](#deploy)
- [API Reference](#api-reference)
- [Keep-Warm System](#keep-warm-system)
- [Key Design Decisions](#key-design-decisions)
- [Security](#security)

---

## The Problem

**5,708 real Spotify user reviews** were analyzed across the Google Play Store, App Store, Reddit, and the Spotify Community forum. The signal was consistent:

| Theme | Mentions | What users said |
|-------|----------|-----------------|
| Recommendations recycle familiar tracks | 1,104 | "It keeps playing the same 20 songs" |
| Love when discovery actually works | 1,025 | "When it hits, I'm obsessed for weeks" |
| Autoplay/loop fatigue | 908 | "Radio mode just loops forever" |
| No way to express intent | 793 | "I can't tell it what mood I'm in" |
| Power user frustration | 453 | "I've given up on Discover Weekly" |

**69.4% of reviews flag discovery friction.** In interviews, 5 of 6 users said they discover music *outside* Spotify — Instagram Reels, YouTube, friends. Spotify is used as a playback library, not a discovery engine.

The root cause: collaborative filtering optimizes for familiarity. It can't parse "something for a late-night drive in the rain" or explain why it picked a song.

---

## How Resonance Works

### User Flow

```
1. Land on Spotify home  →  see "NEW FEATURE: Resonance" card
2. Click → /discover page  →  type your mood in plain words
3. Pick your novelty level  →  1 (Comfort) to 5 (Adventurous)
4. Click Discover  →  8 tracks returned with explanations
5. Each card: album art + track + artist + why it was picked + novelty tag
6. Preview: click "30s Preview" → plays in the bottom player bar
7. "Play on Spotify" → opens the track in Spotify search
```

### Technical Flow

```
Browser (Next.js)
    │
    │  POST /api/discover { intent, novelty_level }
    ▼
FastAPI (Render)
    │
    ├─▶ Build system prompt
    │     • Community intelligence baked in (5,708 review insights)
    │     • Novelty level mapped to specific instruction set
    │
    ├─▶ Gemini 2.5 Flash (google-genai SDK)
    │     • response_mime_type: "application/json" — no regex parsing
    │     • Returns: 8 × { track_name, artist, search_query, explanation, novelty_tag }
    │     • Retry: tenacity with exponential backoff (3 attempts)
    │
    ├─▶ Enrich each track (parallel strategy)
    │     • If Spotify creds present → Spotify Search API (GET /v1/search)
    │     • Fallback → iTunes Search API (free, no auth, 30s preview URLs)
    │     • Fallback → mark spotify_found: false, keep LLM explanation
    │
    └─▶ Return DiscoverResponse
          { intent, novelty_level, tracks: TrackOut[8] }
```

### Novelty Levels

| Level | Label | Behavior |
|-------|-------|----------|
| 1 | Comfort | Stays very close to stated artists/genres. Safe, reliable picks. |
| 2 | Familiar+ | Same genre territory, but lesser-known artists or deep cuts. |
| 3 | Balanced | Mix of recognizable and unknown. Adjacent genres sharing mood. |
| 4 | Exploratory | Cross-genre picks connected by mood, theme, or production style. |
| 5 | Adventurous | Genuinely surprising. Different languages, eras, genres. |

At least 2 picks always meet or exceed the stated novelty level. At least 1 is an "anchor" slightly below — the familiar entry point that makes the set feel grounded.

---

## vs. Spotify Prompted Playlist

| Capability | Spotify Prompted Playlist | Resonance |
|------------|--------------------------|-----------|
| Natural language intent | ✅ Yes | ✅ Yes |
| Per-track explanation | ⚠️ Brief notes | ✅ 2–3 sentences, specific musical reasoning |
| Novelty control | ❌ None | ✅ Explicit 5-level dial |
| Community intelligence | ❌ Individual history only | ✅ 5,708 review voices inform recommendations |
| 30-second track preview | ❌ App only | ✅ In-browser, wired to player bar |
| Access | ❌ Premium only, limited markets | ✅ Free, global, no auth required |
| Explains *why* each pick | ❌ | ✅ Core value proposition |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 14)                     │
│                    Deployed on Vercel                        │
│                                                              │
│  / (Home)          Spotify home view + Resonance card        │
│  /discover         Intent input + novelty slider             │
│  /results          8 track cards with explanations           │
│                                                              │
│  Shell: TopBar | Sidebar (Your Library) | NowPlayingBar      │
│  State: PlayerProvider (React context) lifts audio state     │
│  Storage: sessionStorage passes DiscoverResponse to /results │
└────────────────────────┬────────────────────────────────────┘
                         │
              POST /api/discover
              { intent, novelty_level }
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    BACKEND (FastAPI)                          │
│                    Deployed on Render (free tier)            │
│                                                              │
│  /api/discover  ──▶  llm.get_recommendations()               │
│                         │                                    │
│                         ├──▶ Gemini 2.5 Flash                │
│                         │    Community intelligence prompt   │
│                         │    JSON mode (no regex parsing)    │
│                         │                                    │
│                         └──▶ merge.enrich_tracks()           │
│                               ├──▶ Spotify Search API        │
│                               │    (if CLIENT_ID configured) │
│                               └──▶ iTunes Search API         │
│                                    (free fallback, always)   │
│                                                              │
│  /health  ──▶  { status, uptime_seconds, timestamp }         │
└─────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│               KEEP-WARM SYSTEM                               │
│                                                              │
│  GitHub Actions cron (7,19,31,43,55 * * * *)  ──▶  /health  │
│  Python APScheduler (optional, secondary)     ──▶  /health  │
│  Circuit breaker: CLOSED → OPEN → HALF_OPEN                  │
│  Full-jitter exponential backoff on failures                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend framework** | Next.js 14 (App Router) | Server components, file-based routing, Vercel-native |
| **Styling** | Tailwind CSS | Spotify design tokens as utilities, no runtime CSS |
| **Backend framework** | FastAPI (Python) | Async, Pydantic validation, automatic OpenAPI docs |
| **LLM** | Gemini 2.5 Flash | 1,500 req/day free tier, strong music knowledge, native JSON mode |
| **LLM SDK** | google-genai | `response_mime_type: "application/json"` eliminates parsing fragility |
| **Music catalog (primary)** | Spotify Search API | Album art, preview URLs, canonical Spotify links |
| **Music catalog (fallback)** | iTunes Search API | Free, no auth, 600×600 art, 30s preview URLs — works without Spotify creds |
| **Retry logic** | tenacity | Exponential backoff on LLM failures, rate limit handling |
| **Frontend deploy** | Vercel | Zero-config Next.js deploy, auto-deploys on git push |
| **Backend deploy** | Render (free tier) | Simple Python web service, connects to GitHub |
| **Keep-warm** | GitHub Actions | Runs on GitHub infra, pings /health every ~12 min to prevent cold starts |
| **HTTP client** | httpx | Async HTTP for keep-warm pinger |
| **Scheduler** | APScheduler | BackgroundScheduler with file-based singleton lock |

---

## Project Structure

```
spotify-resonance/
│
├── backend/                        # FastAPI app (Render CWD = this dir)
│   ├── main.py                     # App factory, CORS middleware, /health endpoint
│   ├── config.py                   # Env var loading (GEMINI, SPOTIFY, CORS_ORIGINS)
│   ├── Procfile                    # Render: uvicorn main:app --host 0.0.0.0 --port $PORT
│   ├── requirements.txt            # fastapi, uvicorn, google-genai, httpx, tenacity, ...
│   ├── routers/
│   │   └── discover.py             # POST /api/discover — Pydantic models + route handler
│   └── services/
│       ├── llm.py                  # Gemini call + community intelligence system prompt
│       ├── merge.py                # Merge LLM tracks with Spotify/iTunes metadata
│       ├── spotify.py              # Spotify client credentials auth + Search API
│       └── itunes.py               # iTunes Search API (free, no auth fallback)
│
├── frontend/                       # Next.js 14 app (Vercel root dir)
│   ├── app/
│   │   ├── layout.tsx              # Root layout → exports metadata → renders ClientShell
│   │   ├── globals.css             # Spotify design tokens + waveform/shimmer/fadeIn animations
│   │   ├── page.tsx                # / — Spotify home view with Resonance featured card
│   │   ├── discover/
│   │   │   └── page.tsx            # /discover — intent input, novelty slider, Discover button
│   │   └── results/
│   │       └── page.tsx            # /results — 8 TrackCards, reads from sessionStorage
│   ├── components/
│   │   ├── ClientShell.tsx         # Client wrapper: PlayerProvider + layout structure
│   │   ├── PlayerProvider.tsx      # React context: audio state, play/pause/seek
│   │   ├── TopBar.tsx              # Full-width: Spotify logo, Home, search bar, Premium, avatar
│   │   ├── Sidebar.tsx             # Your Library: filter pills, mock playlist items
│   │   ├── NowPlayingBar.tsx       # Fixed 72px player bar: art, controls, progress, volume
│   │   ├── TrackCard.tsx           # Result card: art, explanation, novelty tag, preview button
│   │   ├── IntentInput.tsx         # Expandable textarea for mood/intent
│   │   ├── NoveltySlider.tsx       # 5-stop slider (Comfort → Adventurous)
│   │   ├── ExamplePrompts.tsx      # Clickable prompt chips ("late night drive", "study focus", ...)
│   │   ├── SkeletonCards.tsx       # Shimmer loading state (8 cards)
│   │   └── ExplainerCards.tsx      # Why AI explainer cards
│   ├── lib/
│   │   └── api.ts                  # fetchDiscovery() — typed wrapper with error handling
│   ├── public/
│   │   └── favicon.svg             # Spotify soundwave icon (green circle + 3 arcs)
│   ├── next.config.mjs             # Image domains: mzstatic.com, scdn.co
│   ├── tailwind.config.js          # Spotify tokens + keyframe animations
│   └── package.json
│
├── keep_warm/                      # Optional Python scheduler (secondary keep-warm)
│   ├── scheduler.py                # APScheduler BackgroundScheduler, max_instances=1
│   ├── pinger.py                   # async httpx + full-jitter backoff + webhook alert
│   ├── circuit_breaker.py          # Thread-safe 3-state CB (CLOSED/OPEN/HALF_OPEN)
│   ├── config.py                   # HEALTH_URL, WEBHOOK_URL env vars
│   └── logging_config.py
│
├── .github/
│   └── workflows/
│       └── keep-warm.yml           # GitHub Actions cron: 7,19,31,43,55 * * * *
│
├── docs/
│   ├── PROJECT.md                  # Build spec and phase definitions
│   ├── ARCHITECTURE.md             # As-built architecture, phase status
│   └── TECHSTACK.md                # Tech stack rationale and constraints
│
├── .env.example                    # Template — copy to .env.local and fill in
├── .gitignore                      # .env*, node_modules/, .next/, __pycache__/, .venv/
└── README.md
```

---

## Local Setup

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Gemini API key** — free at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **Spotify Developer App** (optional) — [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
  - Without Spotify creds, the app uses the **iTunes Search API** as a fallback (free, no auth, works immediately)

---

### 1. Clone and configure

```bash
git clone https://github.com/akashh0210/spotify-resonance.git
cd spotify-resonance
```

Create `.env.local` in the project root (this file is gitignored):

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional — leave blank to use iTunes fallback (recommended for quick start)
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# Frontend dev server URL (backend reads this for CORS)
FRONTEND_URL=http://localhost:3000

# Frontend env: which backend to call
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### 2. Start the backend

```bash
cd backend
python -m venv .venv

# macOS / Linux
source .venv/bin/activate

# Windows (PowerShell)
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Verify it's running:
```bash
curl http://localhost:8000/health
# → {"status":"ok","uptime_seconds":...,"timestamp":"...","version":"1.0.0"}
```

Test a discovery:
```bash
curl -X POST http://localhost:8000/api/discover \
  -H "Content-Type: application/json" \
  -d '{"intent": "something like Anuv Jain but more upbeat", "novelty_level": 3}'
```

---

### 3. Start the frontend

```bash
# In a new terminal, from the project root
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

### Getting Spotify Credentials (optional)

The app works without Spotify credentials — it uses the iTunes Search API as a fallback, which provides album art (600×600), 30-second preview URLs, and Spotify search links. To get real Spotify URLs instead:

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Click **Create App**
3. Name: anything · Redirect URI: `http://localhost:8000/api/auth/callback`
4. Copy **Client ID** and **Client Secret** into `.env.local`

The backend auto-detects whether credentials are present and switches between Spotify and iTunes accordingly (`USE_SPOTIFY` flag in `config.py`).

---

## Environment Variables

### Backend (set on Render in production)

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | **Yes** | Google AI Studio API key. Free at aistudio.google.com |
| `FRONTEND_URL` | **Yes** (prod) | Your Vercel URL — added to CORS allowed origins. e.g. `https://your-app.vercel.app` |
| `SPOTIFY_CLIENT_ID` | No | Spotify app client ID. Leave blank to use iTunes fallback |
| `SPOTIFY_CLIENT_SECRET` | No | Spotify app client secret. Leave blank to use iTunes fallback |

> **Security:** `SPOTIFY_CLIENT_SECRET` is never sent to the frontend. All Spotify API calls happen server-side on the backend.

### Frontend (set on Vercel in production)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | **Yes** (prod) | Backend URL. e.g. `https://your-app.onrender.com` |

---

## Deploy

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   *(or leave Start Command blank — Render reads it from `Procfile`)*
5. Add **Environment Variables:**
   - `GEMINI_API_KEY` = your key
   - `FRONTEND_URL` = `https://your-app.vercel.app` (fill in after Vercel deploy)
   - `SPOTIFY_CLIENT_ID` = (optional)
   - `SPOTIFY_CLIENT_SECRET` = (optional)
6. Click **Deploy**

After deploy, verify:
```
https://your-render-url.onrender.com/health
```

---

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Next.js (auto-detected)
4. Add **Environment Variable:**
   - `NEXT_PUBLIC_API_URL` = `https://your-render-url.onrender.com`
5. Click **Deploy**

After Vercel gives you a URL (e.g. `https://spotify-resonance.vercel.app`), go back to **Render → Environment** and set `FRONTEND_URL` to that URL, then redeploy the backend to apply the CORS update.

---

## API Reference

### `POST /api/discover`

The core endpoint. Takes a natural language intent and novelty level, returns 8 enriched tracks.

**Request**

```json
{
  "intent": "late night drive through the city, something cinematic and melancholic",
  "novelty_level": 3
}
```

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `intent` | string | required | Natural language mood or music description |
| `novelty_level` | integer | 1–5 | 1 = Comfort zone, 5 = Adventurous |

**Response**

```json
{
  "intent": "late night drive through the city, something cinematic and melancholic",
  "novelty_level": 3,
  "tracks": [
    {
      "track_name": "After Dark",
      "artist": "Mr. Kitty",
      "album": "After Dark",
      "album_art": "https://is1-ssl.mzstatic.com/image/thumb/.../600x600bb.jpg",
      "spotify_url": "https://open.spotify.com/search/After%20Dark%20Mr.%20Kitty",
      "preview_url": "https://audio-ssl.itunes.apple.com/itunes-assets/...",
      "explanation": "The gated synth arpeggios and driving 4/4 kick create...",
      "novelty_tag": "balanced",
      "spotify_found": true,
      "resolved_via": "itunes"
    }
    // ... 7 more tracks
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `track_name` | string | Track title |
| `artist` | string | Primary artist |
| `album` | string \| null | Album name |
| `album_art` | string \| null | Album art URL (600×600 from iTunes, or from Spotify CDN) |
| `spotify_url` | string \| null | Direct Spotify link or search URL |
| `preview_url` | string \| null | 30-second MP3 preview URL |
| `explanation` | string | 2–3 sentences of specific musical reasoning |
| `novelty_tag` | string | `comfort` \| `familiar_plus` \| `balanced` \| `exploratory` \| `adventurous` |
| `spotify_found` | boolean | Whether the track was found in Spotify/iTunes catalog |
| `resolved_via` | string | `"spotify"` \| `"itunes"` \| `"none"` |

**Error responses**

| Status | Meaning |
|--------|---------|
| `422` | Invalid request (intent missing, novelty_level out of 1–5 range) |
| `429` | Gemini rate limit hit |
| `502` | LLM or enrichment error |

---

### `GET /health`

Lightweight liveness check used by the keep-warm system.

```json
{
  "status": "ok",
  "uptime_seconds": 1234.56,
  "timestamp": "2025-01-15T10:30:00+00:00",
  "version": "1.0.0"
}
```

---

## Keep-Warm System

Render's free tier spins down services after **15 minutes of inactivity**, causing 30–60 second cold starts on the next request. The keep-warm system prevents this.

### Primary: GitHub Actions Cron

```yaml
# .github/workflows/keep-warm.yml
schedule:
  - cron: '7,19,31,43,55 * * * *'   # every ~12 minutes, 24/7
```

Runs on GitHub's infra — no Render resources consumed. Uses `curl --retry 2 --retry-delay 5`. Exits non-zero on 5xx responses (visible in Actions dashboard).

### Secondary: Python Scheduler (optional)

`keep_warm/` contains a standalone Python service you can deploy separately:

- **APScheduler** `BackgroundScheduler` with `max_instances=1` and `misfire_grace_time=60`
- **File-based singleton lock** (`fcntl.flock`) prevents duplicate processes
- **Full-jitter exponential backoff** — base 1s × 2^attempt, cap at 30s, with full jitter
- **Circuit breaker** with three states:
  - `CLOSED` — normal, all pings go through
  - `OPEN` — threshold failures reached, stops pinging to avoid log spam
  - `HALF_OPEN` — after cooldown, sends a probe to test recovery
- **Webhook alert** fires when circuit breaker opens (configure `WEBHOOK_URL` env var)

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| LLM | Gemini 2.5 Flash | 1,500 req/day free tier, native JSON mode via `response_mime_type`, strong music knowledge |
| JSON mode | `response_mime_type: "application/json"` | Eliminates regex parsing. Gemini enforces the schema on its side |
| Music catalog fallback | iTunes Search API | Free, no auth, never goes down. Works immediately for demos without Spotify credentials |
| `resolved_via` field | Tracks whether result came from Spotify, iTunes, or neither | Transparency for debugging; shown as `resolved_via` on each track object |
| Search API only | No audio features or recommendations endpoints | Spotify deprecated the Recommendations and Audio Features endpoints in November 2024 |
| Separate backend | FastAPI on Render | Client Secret never touches the browser. All external API calls are server-side |
| sessionStorage handoff | `/discover` stores `DiscoverResponse`, `/results` reads it | Avoids double-fetch on navigation. Data is ephemeral (lost on tab close) — intentional |
| Layout: `ClientShell` wrapper | Client component wraps server layout | Lets `layout.tsx` stay a server component (exports `metadata`) while `PlayerProvider` context lives client-side |
| Player context | `PlayerProvider` + `usePlayer()` | Lifts audio state out of individual `TrackCard` components into the `NowPlayingBar`. One source of truth for what's playing |
| Community intelligence | Baked into system prompt | Not retrieved dynamically — stateless, fast, no extra service. The 5,708 review insights are stable signal |
| Keep-warm on GitHub Actions | Primary scheduler on GitHub infra | Zero impact on Render free hours. Always-on as long as the repo exists |

---

## Security

- **Spotify Client Secret** is never sent to the frontend. All Spotify API calls are server-side.
- **GEMINI_API_KEY** is a backend-only env var. Not prefixed with `NEXT_PUBLIC_`.
- **`.env`, `.env.local`, `.env.production`** are in `.gitignore` and never committed.
- **CORS** is scoped to specific origins via `FRONTEND_URL` env var + hardcoded production URL. Not `"*"`.
- **All external API calls** (Gemini, Spotify, iTunes) go through the FastAPI backend, not the frontend.

---

## License

Prototype · Not affiliated with Spotify AB.
