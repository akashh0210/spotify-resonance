# Resonance — Spotify Discovery Agent

An AI-native music discovery agent that captures intent in natural language,
explains every pick, and gives users explicit control over how far to push
outside their comfort zone. Built as a feature prototype inside a
pixel-accurate Spotify shell.

Informed by community intelligence from 5,708 real Spotify user reviews
analyzed across the Google Play Store, Apple App Store, Reddit, and the
Spotify Community forum.

## What it does

1. User describes what they want to discover in plain words
2. An LLM reasons about tracks that match, informed by community
   discovery intelligence
3. Each track is resolved against Spotify's catalog via the Search API
4. 8 tracks are returned with per-track explanations and album art
5. User can adjust a novelty dial from Comfort to Adventurous
6. Optionally, user logs in with Spotify to save as a real playlist

## How it differs from Spotify's Prompted Playlist

| Capability | Prompted Playlist | Resonance |
|------------|------------------|-----------|
| NL intent | Yes | Yes |
| Per-track explanation | Brief notes | Deep reasoning (why + what's different) |
| Novelty control | None | Explicit 5-level dial |
| Community intelligence | Individual history only | 5,708 review voices inform recommendations |
| Access | Premium only, 7 markets | Free, global, no auth required |

## Stack

- **Frontend:** Next.js 14 + Tailwind CSS + shadcn/ui → Vercel
- **Backend:** FastAPI (Python) → Render
- **LLM:** Gemini 2.5 Flash
- **Music catalog:** Spotify Web API (Search endpoint)
- **Auth:** Spotify OAuth PKCE (optional, for playlist creation)

## Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- Gemini API key (aistudio.google.com)
- Spotify Developer App (developer.spotify.com/dashboard)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env      # fill in your keys
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp ../.env.example .env.local   # fill in API URL
npm run dev
```

Open http://localhost:3000

### Keys you need (all free)

- **GEMINI_API_KEY** — aistudio.google.com/app/apikey
- **SPOTIFY_CLIENT_ID** — developer.spotify.com/dashboard
- **SPOTIFY_CLIENT_SECRET** — same dashboard
- Set redirect URI in Spotify dashboard to:
  `http://localhost:8000/api/auth/callback` (local)
  or your Render URL for production

## Deploy

### Backend → Render
1. Push to GitHub
2. Render → New Web Service → connect repo
3. Root directory: `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add env vars: GEMINI_API_KEY, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET,
   SPOTIFY_REDIRECT_URI, FRONTEND_URL

### Frontend → Vercel
1. Vercel → New Project → connect repo
2. Root directory: `frontend`
3. Framework preset: Next.js
4. Add env vars: NEXT_PUBLIC_API_URL (your Render URL),
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID

## Part 4 alignment (PS requirements)

This MVP demonstrates:
- **Why traditional recsys is insufficient** — three explainer cards on
  the landing page, plus the experience itself (CF can't parse intent
  or explain picks)
- **What AI unlocks** — NL understanding, per-track reasoning, controllable
  novelty, community intelligence
- **How AI changes UX** — from passive scroll-and-skip to active discovery
  dialogue with explanations that build trust
