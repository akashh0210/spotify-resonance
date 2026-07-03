'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ExternalLink, Play, Pause } from 'lucide-react'
import type { NoveltyTag } from '@/lib/api'

interface TrackCardProps {
  track_name: string
  artist: string
  album: string | null
  album_art: string | null
  spotify_url: string | null
  preview_url: string | null
  explanation: string
  novelty_tag: NoveltyTag
  spotify_found?: boolean
  resolved_via?: string
}

const PILL: Record<NoveltyTag, { bg: string; color: string; label: string }> = {
  comfort:      { bg: 'rgba(29,185,84,0.15)',   color: '#1DB954', label: 'Comfort'     },
  familiar_plus:{ bg: 'rgba(78,204,163,0.15)',  color: '#4ECCA3', label: 'Familiar+'   },
  balanced:     { bg: 'rgba(242,201,76,0.15)',  color: '#F2C94C', label: 'Balanced'    },
  exploratory:  { bg: 'rgba(242,153,74,0.15)',  color: '#F2994A', label: 'Exploratory' },
  adventurous:  { bg: 'rgba(235,87,87,0.15)',   color: '#EB5757', label: 'Adventurous' },
}

export default function TrackCard({
  track_name,
  artist,
  album,
  album_art,
  spotify_url,
  preview_url,
  explanation,
  novelty_tag,
  spotify_found = true,
}: TrackCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePreview = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pill = PILL[novelty_tag] ?? PILL.balanced

  return (
    <div className="bg-bg-card rounded-lg overflow-hidden flex flex-row md:flex-col hover:-translate-y-[3px] hover:bg-[#282828] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-200 group">

      {/* Album art — 120px on mobile (row), 160px on desktop (col) */}
      <div className="relative flex-shrink-0 w-[110px] h-[110px] md:w-full md:h-[160px] overflow-hidden rounded-l-lg md:rounded-l-none md:rounded-t-lg">
        {album_art ? (
          <Image
            src={album_art}
            alt={`${track_name} album art`}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            unoptimized
            sizes="(max-width: 768px) 110px, 300px"
          />
        ) : (
          <div className="w-full h-full bg-[#282828] flex items-center justify-center">
            <span className="text-3xl">🎵</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 p-3 md:p-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-[15px] md:text-base leading-tight truncate">
              {track_name}
            </h3>
            <p className="text-text-secondary text-sm mt-0.5 truncate">{artist}</p>
            {album && (
              <p className="text-text-subdued text-xs mt-0.5 truncate">{album}</p>
            )}
          </div>
          <span
            className="flex-shrink-0 text-[10px] md:text-[11px] uppercase tracking-[1px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: pill.bg, color: pill.color }}
          >
            {pill.label}
          </span>
        </div>

        {/* Explanation — full text, no truncation */}
        <p className="text-text-secondary text-[13px] md:text-sm leading-relaxed flex-1 mt-1">
          {explanation}
        </p>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {spotify_url ? (
            <a
              href={spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-accent text-accent text-[12px] font-medium hover:bg-accent hover:text-black transition-colors"
            >
              <ExternalLink size={11} />
              Play on Spotify
            </a>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-border-spotify text-text-subdued text-[12px] font-medium">
              {spotify_found ? 'Play on Spotify' : 'Not on Spotify'}
            </span>
          )}

          {preview_url && (
            <>
              <button
                onClick={togglePreview}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#282828] text-text-secondary text-[12px] font-medium hover:bg-[#3E3E3E] hover:text-white transition-colors"
              >
                {isPlaying ? <Pause size={11} /> : <Play size={11} />}
                {isPlaying ? 'Pause' : '30s Preview'}
              </button>
              <audio
                ref={audioRef}
                src={preview_url}
                onEnded={() => setIsPlaying(false)}
                preload="none"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
