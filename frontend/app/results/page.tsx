'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TrackCard from '@/components/TrackCard'
import SkeletonCards from '@/components/SkeletonCards'
import type { DiscoverResponse } from '@/lib/api'

const NOVELTY_LABELS: Record<number, string> = {
  1: 'Comfort',
  2: 'Familiar+',
  3: 'Balanced',
  4: 'Exploratory',
  5: 'Adventurous',
}

export default function ResultsPage() {
  const router = useRouter()
  const [data, setData] = useState<DiscoverResponse | null>(null)
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('lastDiscovery')
    if (raw) {
      try {
        setData(JSON.parse(raw))
      } catch {
        setNoData(true)
      }
    } else {
      setNoData(true)
    }
  }, [])

  if (noData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full gap-4 px-6">
        <p className="text-text-secondary text-center">
          No results found — go back and discover something.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-full font-semibold text-sm border border-border-spotify text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-colors"
        >
          Back to Discovery
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="px-6 py-10 max-w-5xl mx-auto">
        <SkeletonCards />
      </div>
    )
  }

  const noveltyLabel = NOVELTY_LABELS[data.novelty_level] || 'Balanced'
  const displayIntent =
    data.intent.length > 60 ? data.intent.slice(0, 60) + '…' : data.intent

  return (
    <div className="px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">
            8 picks for:{' '}
            <span className="text-accent">"{displayIntent}"</span>
          </h1>
          <p className="text-text-secondary text-sm">
            Novelty: {noveltyLabel} · Powered by 5,708 review voices
          </p>
        </div>

        {/* Track grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {data.tracks.map((track) => (
            <TrackCard
              key={`${track.track_name}-${track.artist}`}
              {...track}
            />
          ))}
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            disabled
            title="Spotify login required — coming in Phase 5"
            className="px-6 py-3 rounded-full font-semibold text-sm bg-accent text-black opacity-40 cursor-not-allowed"
          >
            Save as Playlist
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-full font-semibold text-sm border border-border-spotify text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-colors"
          >
            Try Different Mood
          </button>
          <button
            onClick={() => {
              if (data) {
                const params = new URLSearchParams({
                  intent: data.intent,
                  novelty_level: String(data.novelty_level),
                })
                router.push(`/?${params.toString()}`)
              }
            }}
            className="px-6 py-3 rounded-full font-semibold text-sm border border-border-spotify text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-colors"
          >
            Adjust Novelty
          </button>
        </div>
      </div>
    </div>
  )
}
