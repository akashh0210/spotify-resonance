# TECHSTACK.md — Resonance MVP

## Overview

Resonance is a two-service architecture: a Next.js frontend deployed on
Vercel and a FastAPI backend deployed on Render. All external API calls
(Gemini LLM, Spotify Web API) are made server-side from the backend to
protect secrets and control CORS.

---

## Frontend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Next.js | 14.x (App Router) | React-based SSR/SSG framework |
| Language | TypeScript | 5.x | Type safety across components |
| Styling | Tailwind CSS | 3.x | Utility-first CSS, Spotify design tokens |
| UI components | shadcn/ui | latest | Accessible, unstyled primitives (slider, dialog, button) |
| Icons | Lucide React | latest | Consistent icon set |
| HTTP client | Native fetch | -- | API calls to backend |
| Deploy | Vercel | -- | Zero-config Next.js hosting, global CDN |

### Frontend environment variables
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

### Key frontend dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-slider": "latest",
  "lucide-react": "latest",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest"
}
```

---

## Backend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | FastAPI | 0.110+ | Async Python API framework |
| Language | Python | 3.11+ | Backend logic |
| ASGI server | Uvicorn | 0.27+ | Production server for FastAPI |
| LLM client | google-genai | latest | Calls to Gemini API |
| HTTP client | httpx | latest | Async Spotify API calls |
| Retry logic | tenacity | latest | Exponential backoff on API failures |
| Env management | python-dotenv | latest | Local .env loading |
| CORS | FastAPI CORSMiddleware | built-in | Cross-origin requests from Vercel |
| Deploy | Render | free tier | Python web service hosting |

### Backend environment variables
```
GEMINI_API_KEY=your_gemini_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://your-backend.onrender.com/api/auth/callback
FRONTEND_URL=https://your-frontend.vercel.app
```

### Key backend dependencies (requirements.txt)
```
fastapi>=0.110.0
uvicorn>=0.27.0
google-genai>=1.0.0
httpx>=0.27.0
python-dotenv>=1.0.0
tenacity>=8.2.0
pydantic>=2.0.0
```

### Render Procfile
```
web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

---

## External APIs

### Gemini API (LLM)

| Property | Value |
|----------|-------|
| Model | gemini-2.5-flash |
| Temperature | 0.7 (creative recommendations) |
| Max tokens | 2000 |
| Free tier limits | 1,500 requests/day, 15 requests/min, 1M tokens/min |
| Auth | API key via google-genai SDK |
| SDK | google-genai (`from google import genai`) |
| Response format | response_mime_type: "application/json" |

**Rate limit handling:** tenacity retry with exponential backoff on 429.
Free tier allows 1,500 discovery calls/day — more than sufficient for
development and grader testing. Resets at midnight Pacific time.

### Spotify Web API

| Endpoint | Auth | Purpose |
|----------|------|---------|
| POST /api/token | Client credentials | Get access token for Search |
| GET /v1/search | Bearer token | Resolve track names to metadata |
| GET /v1/me | OAuth bearer | Get user profile for playlist creation |
| POST /v1/users/{id}/playlists | OAuth bearer | Create playlist |
| POST /v1/playlists/{id}/tracks | OAuth bearer | Add tracks to playlist |

**Auth flows:**
1. **Client Credentials** (for Search — no user login needed):
   - POST to https://accounts.spotify.com/api/token
   - Body: grant_type=client_credentials
   - Header: Authorization: Basic base64(client_id:client_secret)
   - Returns: access_token (valid 60 min)
   - Cache with 55-min TTL

2. **OAuth PKCE** (for playlist creation — user-initiated):
   - Scopes: playlist-modify-public, playlist-modify-private
   - Redirect URI: backend /api/auth/callback
   - Flow: frontend redirects to Spotify auth → user grants → callback
     receives code → exchange for access_token → return to frontend

**Spotify Developer App setup:**
1. Go to https://developer.spotify.com/dashboard
2. Create an app
3. Set redirect URI to your backend callback URL
4. Copy Client ID and Client Secret to .env

**Important:** The deprecated endpoints (Recommendations, Audio Features,
Audio Analysis, Related Artists) are NOT used. Only Search is used for
track resolution. This is a deliberate architectural choice documented
in the deck (S8).

---

## Deploy Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│                     │  HTTPS  │                     │
│   Vercel (CDN)      │────────▶│   Render             │
│                     │         │                     │
│   Next.js frontend  │         │   FastAPI backend    │
│   Static + SSR      │         │   Python 3.11        │
│                     │         │                     │
│   Custom domain     │         │   Environment vars:  │
│   (optional)        │         │   - GEMINI_API_KEY   │
│                     │         │   - SPOTIFY_CLIENT_ID│
│   Env vars:         │         │   - SPOTIFY_SECRET   │
│   - NEXT_PUBLIC_    │         │   - FRONTEND_URL     │
│     API_URL         │         │                     │
│   - NEXT_PUBLIC_    │         │   Procfile: uvicorn  │
│     SPOTIFY_CLIENT  │         │                     │
│     _ID             │         │                     │
└─────────────────────┘         └─────────────────────┘
         │                               │
         │                               ├──▶ Gemini API
         │                               │    (LLM inference)
         │                               │
         │                               └──▶ Spotify Web API
         │                                    (Search, OAuth, Playlists)
         │
         └──▶ User's browser
              (Spotify OAuth redirect)
```

### Render free tier constraints
- Spins down after 15 min inactivity (cold start ~30-60s)
- 750 free hours/month (sufficient for prototype demos)
- Automatic HTTPS

### Vercel free tier constraints  
- Unlimited static deploys
- 100GB bandwidth/month
- Automatic HTTPS + CDN
- Serverless function limit: 10s execution (not relevant — we use
  external backend)

---

## Design System

### Spotify Brand Compliance

This is a **prototype for educational purposes**. It replicates Spotify's
visual language to demonstrate how the feature would look inside the
existing product, as a PM would present to internal stakeholders.

| Token | Value | Usage |
|-------|-------|-------|
| --bg-primary | #121212 | Page background |
| --bg-card | #181818 | Cards, panels |
| --bg-card-hover | #282828 | Card hover state |
| --bg-elevated | #242424 | Sidebar, top bar |
| --accent | #1DB954 | Spotify green — buttons, active states |
| --accent-hover | #1ED760 | Button hover |
| --text-primary | #FFFFFF | Headlines, primary text |
| --text-secondary | #B3B3B3 | Body text, descriptions |
| --text-subdued | #6A6A6A | Captions, metadata |
| --border | #282828 | Subtle borders |
| --radius-sm | 4px | Small elements |
| --radius-md | 8px | Cards, inputs |
| --radius-full | 9999px | Buttons, pills |

### Typography
- Display: Inter 700, 48-56px (hero headline)
- Heading: Inter 700, 24-32px
- Subheading: Inter 600, 18-20px
- Body: Inter 400, 14-16px
- Caption: Inter 400, 12-13px
- Explanation text: Inter 400, 14px, color: --text-secondary, line-height: 1.6

### Responsive breakpoints
- Desktop: >= 1024px (sidebar visible, 2x4 grid)
- Tablet: 768-1023px (sidebar collapsed, 2x4 grid)
- Mobile: < 768px (no sidebar, single column, stacked cards)

---

## Security

- Spotify Client Secret is NEVER exposed to the frontend
- All Spotify API calls (except OAuth redirect) go through the backend
- CORS is restricted to the Vercel frontend domain in production
- OAuth uses PKCE (no client secret needed on the frontend side)
- No user data is stored — the app is stateless
- .env is gitignored; secrets set as platform environment variables
