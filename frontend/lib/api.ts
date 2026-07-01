export type NoveltyTag = 'comfort' | 'familiar_plus' | 'balanced' | 'exploratory' | 'adventurous'

export interface Track {
  track_name: string
  artist: string
  album: string | null
  album_art: string | null
  spotify_url: string | null
  preview_url: string | null
  explanation: string
  novelty_tag: NoveltyTag
  spotify_found: boolean
  resolved_via: string
}

export interface DiscoverResponse {
  intent: string
  novelty_level: number
  tracks: Track[]
}

export async function fetchDiscovery(
  intent: string,
  noveltyLevel: number,
): Promise<DiscoverResponse> {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const resp = await fetch(`${base}/api/discover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intent, novelty_level: noveltyLevel }),
  })
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}))
    throw new Error((err as any).detail || `API error ${resp.status}`)
  }
  return resp.json()
}
