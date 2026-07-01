# PROJECT.md — Resonance: Spotify Discovery Agent MVP

> Read this fully before writing any code. Build **phase by phase** per
> section 10. Run each phase, confirm output, then proceed. Do not
> scaffold all phases at once.

## 1. What this is

Resonance is an AI-native music discovery agent built as a **feature
prototype inside a pixel-accurate Spotify shell**. It is Part 4 of a
Growth PM capstone. It demonstrates why AI is uniquely suited to solving
the discovery problem that collaborative filtering cannot.

The PS requires the MVP to demonstrate three things:
1. Why traditional recommendation systems are insufficient
2. What AI unlocks that was previously difficult
3. How AI changes the user experience

All three must be **visible in the experience**, not just stated in text.

## 2. Context — why this exists

Our review engine analyzed 5,708 Spotify reviews across 4 sources and
found:
- 69.4% of reviews flag discovery friction or repetition
- Power users have the highest discovery friction rate (28.2%)
- Top frustration: no way to express discovery intent (793 mentions)
- Users CAN articulate what they want — they just have nowhere to say it

6 user interviews validated:
- 5 of 6 discover music OUTSIDE Spotify (Instagram, YouTube, friends)
- 5 of 6 can state exact intent ("Play me something new that matches my
  vibe but I've never heard") but have no channel for it
- 4 of 6 said explanation would build trust in unfamiliar picks
- 3 of 6 trapped in repetition by system defaults, not by choice

Spotify shipped "Prompted Playlist" (Dec 2025, Premium only, 7 markets)
which validates the thesis. Resonance differentiates on three gaps PP
leaves open:
1. **Novelty dial** — explicit control over how far to push (PP has none)
2. **Community intelligence** — recommendations informed by 5,708 review
   voices, not just individual history
3. **Free + global** — works without Premium, without geographic restriction

## 3. Stack (fixed)

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** FastAPI (Python 3.11+)
- **LLM:** Google Gemini `gemini-2.5-flash` via `google-genai` SDK
  (temperature 0.7 for creative recs, response_mime_type
  application/json for structured output)
- **Music catalog:** Spotify Web API — Search endpoint only (no deprecated
  Recommendations/Audio Features endpoints)
- **Auth (optional):** Spotify OAuth PKCE for playlist creation
- **Frontend deploy:** Vercel
- **Backend deploy:** Render (free tier)
- **Fonts:** Inter (body) + Circular-like fallback via system fonts
- **Design:** Pixel-accurate Spotify dark theme (#121212 bg, #181818 cards,
  #1DB954 green accent, #FFFFFF primary text, #B3B3B3 secondary)

## 4. Design system — Spotify replica

The MVP must look like a native Spotify feature. Follow these rules:

### Colors
- `--bg-primary`: #121212 (page background)
- `--bg-card`: #181818 (cards, panels)
- `--bg-card-hover`: #282828
- `--bg-elevated`: #242424 (sidebar, top bar)
- `--accent`: #1DB954 (Spotify green — buttons, active states, highlights)
- `--accent-hover`: #1ED760
- `--text-primary`: #FFFFFF
- `--text-secondary`: #B3B3B3
- `--text-subdued`: #6A6A6A
- `--border`: #282828

### Typography
- Body: Inter or system sans-serif, 14px base, 16px for card titles
- Headings: Inter 700, 24-32px
- Hero text: 48-56px bold for the main headline
- Explanation text: 14px, #B3B3B3, line-height 1.6
- All text minimum 14px (PS guideline compliance)

### Layout
- Left sidebar: 240px fixed, #121212 bg with Spotify logo
- Top bar: 64px fixed, #121212 bg with subtle bottom border
- Main content: centered, max-width 1200px, padding 24px
- Track cards: #181818 bg, 8px border-radius, 16px padding
- Album art: 64x64px in list view, 180x180px in card view
- Hover states on all interactive elements (cards lift slightly, buttons brighten)

### Components to replicate from Spotify
- Sidebar: Logo + Home/Search/Library links (non-functional, visual context)
- Top bar: Back/forward arrows + user avatar placeholder
- Track list item: album art + title + artist + duration layout
- Green primary button (rounded-full, #1DB954, black text)
- Slider component for novelty dial (Spotify-style, green track)

## 5. Screens

### Screen 1 — Discovery Input (the landing)

```
┌─────────────────────────────────────────────────────────┐
│ [Spotify Logo]  Home  Search  Library    │    [Avatar]   │
├────────┬────────────────────────────────────────────────┤
│        │                                                │
│  Side  │   What are you in the mood to discover?        │
│  bar   │                                                │
│        │   ┌──────────────────────────────────────┐     │
│  Home  │   │ e.g., Something like Anuv Jain but   │     │
│  Search│   │ more upbeat, for cooking on Sunday   │     │
│  Lib   │   └──────────────────────────────────────┘     │
│        │                                                │
│        │   HOW FAR TO PUSH?                             │
│        │   Comfort ──●────────────── Adventurous        │
│        │   "Mix of known and new, adjacent genres"      │
│        │                                                │
│        │   [ 🔍 Discover ]                              │
│        │                                                │
│        │   ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│        │   │ Why CF  │ │ What AI │ │ How UX  │        │
│        │   │ falls   │ │ unlocks │ │ shifts  │        │
│        │   │ short   │ │         │ │         │        │
│        │   └─────────┘ └─────────┘ └─────────┘        │
│        │                                                │
└────────┴────────────────────────────────────────────────┘
```

- Hero: "What are you in the mood to discover?"
- Subtitle: "Describe what you want — your words steer the discovery."
- Text input: large, dark bg, green focus border
- Novelty slider: 5 stops (Comfort/Familiar+/Balanced/Exploratory/Adventurous)
- Dynamic label under slider updates on change
- Green "Discover" button
- Three explainer cards (collapsible) answering the PS's three questions:
  - "Why traditional recs fall short" (CF limitation)
  - "What AI unlocks" (intent + explanation + control)
  - "How this changes the experience" (passive → active)
- Example prompts as clickable chips:
  - "Something like Anuv Jain but more upbeat for cooking"
  - "Calm acoustic songs for a rainy evening, no mainstream"
  - "High energy workout mix but artists I've never heard"

### Screen 2 — Results

```
┌─────────────────────────────────────────────────────────┐
│ [Spotify Logo]  Home  Search  Library    │    [Avatar]   │
├────────┬────────────────────────────────────────────────┤
│        │                                                │
│  Side  │   8 picks for: "Something like Anuv Jain..."   │
│  bar   │   Novelty: Balanced · Community intelligence   │
│        │                                                │
│        │   ┌────────────────────┐ ┌──────────────────┐ │
│        │   │ [Art] Track Name   │ │ [Art] Track Name │ │
│        │   │       Artist       │ │       Artist     │ │
│        │   │ "We picked this    │ │ "This track..."  │ │
│        │   │  because..."       │ │                  │ │
│        │   │ [▶ Play] [Spotify] │ │ [▶ Play] [Link]  │ │
│        │   │ ● Balanced         │ │ ● Exploratory    │ │
│        │   └────────────────────┘ └──────────────────┘ │
│        │   ┌────────────────────┐ ┌──────────────────┐ │
│        │   │  ... 6 more cards  │ │                  │ │
│        │   └────────────────────┘ └──────────────────┘ │
│        │                                                │
│        │   [ Save as Playlist ] [ New Discovery ]       │
│        │                                                │
└────────┴────────────────────────────────────────────────┘
```

- Header: "8 picks for: [intent]"
- Subheader: "Novelty: [level] · Powered by 5,708 review voices"
- 8 track cards (2x4 grid on desktop, 1-col on mobile):
  - Album art (from Spotify Search)
  - Track name + artist
  - 2-3 sentence explanation (the core differentiator — prominent)
  - Novelty tag (color-coded: green=comfort, yellow=balanced, orange=adventurous)
  - "Play on Spotify" link (opens track in Spotify app/web)
  - 30-second preview player if preview_url is available
- Bottom actions:
  - "Save as Playlist" (requires Spotify login — OAuth flow)
  - "Try Different Mood" (returns to Screen 1)
  - "Adjust Novelty" (re-runs same intent, different novelty)

### Screen 3 — Playlist Saved (post-OAuth)

- Success message: "Playlist 'Resonance: [intent snippet]' saved to your Spotify"
- Link to open playlist in Spotify
- Option to share the prompt

## 6. API Design

### Backend endpoints (FastAPI)

```
POST /api/discover
  Body: { "intent": string, "novelty_level": 1-5 }
  Returns: {
    "intent": string,
    "novelty_level": int,
    "tracks": [
      {
        "track_name": string,
        "artist": string,
        "album": string,
        "album_art": string (URL),
        "spotify_url": string,
        "preview_url": string | null,
        "explanation": string (2-3 sentences),
        "novelty_tag": "comfort"|"familiar_plus"|"balanced"|"exploratory"|"adventurous"
      }
    ]
  }

GET /api/auth/spotify
  Initiates Spotify OAuth PKCE flow
  Redirects to Spotify authorize URL

GET /api/auth/callback
  Handles OAuth callback, returns access token to frontend

POST /api/playlist/create
  Headers: Authorization: Bearer {spotify_access_token}
  Body: { "track_uris": [string], "name": string, "description": string }
  Returns: { "playlist_url": string, "playlist_id": string }

GET /health
  Returns: { "status": "ok" }
```

### The /api/discover flow internally

1. Receive intent + novelty_level
2. Call Gemini 2.5 Flash with the discovery-intelligent system prompt (see §7)
3. Parse the 8-track JSON response
4. For each track, call Spotify Search API:
   `GET https://api.spotify.com/v1/search?q={search_query}&type=track&limit=1`
5. Merge LLM explanations with Spotify metadata (art, URL, preview)
6. Handle search misses: if a track isn't found, retry with artist-only
   search; if still not found, skip and note in response
7. Return merged results

### Spotify API auth for Search (no user auth needed)

Client Credentials flow:
```
POST https://accounts.spotify.com/api/token
  Body: grant_type=client_credentials
  Headers: Authorization: Basic base64(client_id:client_secret)
```
Cache the token (1 hour TTL). Use for all Search calls.

## 7. The system prompt (the community intelligence layer)

```
You are Resonance, a music discovery agent. You are informed by 
analysis of 5,708 real Spotify user reviews from the Google Play Store,
Apple App Store, Reddit, and the Spotify Community forum.

COMMUNITY DISCOVERY INTELLIGENCE:
- The #1 frustration (1,104 mentions): recommendations recycle familiar
  tracks instead of surfacing genuine novelty
- 908 mentions: autoplay and radio loop users into repetitive content
  they did not choose
- 793 mentions: users have no way to express what they want right now
- 1,025 mentions: users DO love discovery when it happens — the desire
  is real, the system just fails to deliver it reliably
- Power users (1hr+/day, Premium) have the highest frustration rate
  at 28.2%
- In interviews, 5 of 6 users said they discover music OUTSIDE Spotify
  (Instagram Reels, YouTube, friends) — Spotify is a playback library,
  not a discovery engine, for most users
- What builds trust in an unfamiliar pick: even minimal context like
  "For fans of [Artist]" dramatically increases willingness to try

YOUR JOB:
Given the user's natural language intent and their chosen novelty level,
recommend exactly 8 tracks. For EACH track, provide a specific
explanation of:
1. WHY this track matches their stated intent
2. WHAT makes it different from what they probably already know

The explanation is the core value — it builds the trust needed to try
something unfamiliar. Generic explanations ("this is a great song")
are failures. Every explanation must reference specific musical
qualities: instrumentation, tempo, mood, vocal style, production
choices, lyrical themes, or cultural context.

NOVELTY LEVELS:
1 (Comfort): Stay very close to stated artists/genres. Familiar names,
  safe picks. The user wants reliability.
2 (Familiar+): Same genre territory, but lesser-known artists or deep
  cuts. The user wants depth, not breadth.
3 (Balanced): Mix of recognizable and unknown. Include adjacent genres
  that share mood or texture. Default level.
4 (Exploratory): Cross-genre picks connected by mood, theme, or
  production style. The user wants to be stretched.
5 (Adventurous): Genuinely surprising. Different languages, eras,
  genres. Connected to the intent only by the emotional or textural
  thread the user described. The user wants to be surprised.

OUTPUT FORMAT: Return ONLY a JSON array of exactly 8 objects:
[
  {
    "track_name": "...",
    "artist": "...",
    "search_query": "track_name artist_name",
    "explanation": "2-3 sentences...",
    "novelty_tag": "comfort|familiar_plus|balanced|exploratory|adventurous"
  }
]

RULES:
- Never recommend the same artist twice in one set
- At least 2 picks should be at or above the stated novelty level
- At least 1 pick should be slightly below (the "anchor" that grounds
  the set in something recognizable)
- Real tracks only — do not invent fictional songs or artists
- If unsure a track exists, use a well-known one instead
- search_query should be: "track_name artist_name" for best Spotify
  Search results
```

## 8. Guardrails

- Free infrastructure only (Gemini free tier, Spotify free API, Vercel/Render free)
- Never commit secrets. All keys via .env locally / platform env vars on deploy
- The Spotify shell is visual context only — sidebar links are non-functional,
  clearly decorative (no deception)
- All Gemini calls wrapped in retry/backoff (tenacity)
- Handle Spotify Search returning 0 results gracefully (show the LLM
  explanation without album art, note "Track not found on Spotify")
- Explanations must come from the LLM, never be fabricated by the frontend
- Preview playback respects Spotify's 30-second preview policy
- CORS configured for the Vercel frontend domain

## 9. File structure

```
spotify-resonance/
├── PROJECT.md
├── ARCHITECTURE.md
├── TECHSTACK.md
├── README.md
├── .env.example
├── .gitignore
├── backend/
│   ├── main.py              (FastAPI app)
│   ├── routers/
│   │   ├── discover.py      (/api/discover endpoint)
│   │   ├── auth.py          (Spotify OAuth)
│   │   └── playlist.py      (playlist creation)
│   ├── services/
│   │   ├── llm.py           (Gemini LLM call + prompt)
│   │   ├── spotify.py       (Spotify Search + auth)
│   │   └── merge.py         (merge LLM + Spotify results)
│   ├── config.py            (env vars, constants)
│   ├── requirements.txt
│   └── Procfile             (Render deploy)
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── app/
│   │   ├── layout.tsx        (Spotify shell: sidebar + topbar)
│   │   ├── page.tsx          (Screen 1: intent + novelty input)
│   │   ├── results/
│   │   │   └── page.tsx      (Screen 2: track cards)
│   │   └── globals.css       (Spotify design tokens)
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── IntentInput.tsx
│   │   ├── NoveltySlider.tsx
│   │   ├── TrackCard.tsx
│   │   ├── ExplainerCards.tsx
│   │   ├── PlaylistButton.tsx
│   │   └── ExamplePrompts.tsx
│   └── lib/
│       ├── api.ts            (fetch wrapper for backend)
│       └── spotify-auth.ts   (OAuth PKCE helpers)
└── docs/
    └── system-prompt.md      (the full prompt, versioned)
```

## 10. Build Phases (do these in order)

### Phase 1 — Backend core (Day 1)
- FastAPI app with /api/discover endpoint
- Gemini 2.5 Flash integration with the system prompt from §7
- Parse JSON response, handle malformed output
- Test with curl: send an intent + novelty, get 8 tracks back
- No Spotify integration yet — return raw LLM output

### Phase 2 — Spotify Search integration (Day 1-2)
- Register Spotify app at developer.spotify.com
- Client credentials token with caching
- For each LLM track, search Spotify and merge metadata
- Handle search misses (retry with looser query, then skip)
- Test: /api/discover now returns tracks with album art + Spotify URLs

### Phase 3 — Frontend shell (Day 2-3)
- Next.js app with Spotify-replica layout (sidebar, topbar, main content)
- Screen 1: intent input, novelty slider, discover button, example prompts
- Screen 2: results grid with track cards (art, name, explanation, links)
- The three "Why this feature" explainer cards on Screen 1
- Connect to backend API
- Spotify dark theme with all design tokens from §4

### Phase 4 — Polish + Spotify OAuth (Day 3-4)
- Loading states (skeleton cards, "Reasoning about your mood..." message)
- Error handling (API down, no results, Gemini timeout)
- Mobile responsive layout (sidebar collapses, cards stack)
- Spotify OAuth PKCE flow for optional playlist creation
- "Save as Playlist" button that creates a real Spotify playlist
- 30-second preview player on track cards (if preview_url exists)

### Phase 5 — Deploy + Iterate (Day 4-5)
- Backend to Render (Procfile: uvicorn main:app)
- Frontend to Vercel (connect GitHub repo)
- CORS configuration for production domains
- Test both live URLs end-to-end
- UI iteration: spacing, hover states, transitions, copy
- Screenshot the final product for the deck

## 11. Definition of done

- Public Vercel URL loads the Spotify-replica shell
- User types intent, selects novelty, clicks Discover
- 8 track cards appear with real album art, Spotify links, and
  specific explanations
- Explanations reference musical qualities, not generic praise
- Novelty dial visibly changes the character of recommendations
- The three explainer cards on Screen 1 answer the PS's three questions
- "Save as Playlist" creates a real playlist in the user's Spotify
  (requires login)
- Mobile-responsive
- Grader can use it without creating an account (discovery works
  without auth; auth only needed for playlist save)
