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

const TAG_STYLES: Record<NoveltyTag, string> = {
  comfort: 'bg-accent/20 text-accent',
  familiar_plus: 'bg-teal-500/20 text-teal-400',
  balanced: 'bg-yellow-500/20 text-yellow-400',
  exploratory: 'bg-orange-500/20 text-orange-400',
  adventurous: 'bg-red-500/20 text-red-400',
}

const TAG_LABELS: Record<NoveltyTag, string> = {
  comfort: 'Comfort',
  familiar_plus: 'Familiar+',
  balanced: 'Balanced',
  exploratory: 'Exploratory',
  adventurous: 'Adventurous',
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

  const tag = TAG_STYLES[novelty_tag] ?? TAG_STYLES.balanced
  const label = TAG_LABELS[novelty_tag] ?? novelty_tag

  return (
    <div className="bg-bg-card rounded-lg p-4 flex gap-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 group">
      {/* Album art */}
      <div className="flex-shrink-0 w-[120px] h-[120px] rounded shadow-md overflow-hidden bg-bg-elevated">
        {album_art ? (
          <Image
            src={album_art}
            alt={`${track_name} album art`}
            width={120}
            height={120}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl">🎵</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <h3 className="text-text-primary font-semibold text-sm leading-tight truncate">
              {track_name}
            </h3>
            <p className="text-text-secondary text-xs mt-0.5 truncate">{artist}</p>
            {album && (
              <p className="text-text-subdued text-xs mt-0.5 truncate">{album}</p>
            )}
          </div>
          <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${tag}`}>
            {label}
          </span>
        </div>

        {/* Explanation */}
        <p className="text-text-secondary text-xs leading-relaxed mt-2 flex-1">
          {explanation}
        </p>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {spotify_url ? (
            <a
              href={spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-accent text-accent text-xs font-medium hover:bg-accent hover:text-black transition-colors"
            >
              <ExternalLink size={11} />
              Play on Spotify
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-spotify text-text-subdued text-xs font-medium">
              {spotify_found ? 'Play on Spotify' : 'Not on Spotify'}
            </span>
          )}

          {preview_url && (
            <>
              <button
                onClick={togglePreview}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elevated text-text-secondary text-xs font-medium hover:bg-bg-card-hover hover:text-text-primary transition-colors"
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
