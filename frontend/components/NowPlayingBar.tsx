'use client'

import Image from 'next/image'
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  Maximize2,
  ListMusic,
  Monitor,
} from 'lucide-react'
import { usePlayer } from './PlayerProvider'

function fmt(secs: number): string {
  if (!secs || isNaN(secs)) return '-:--'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function NowPlayingBar() {
  const { nowPlaying, isPlaying, progress, duration, toggle, seek } = usePlayer()

  return (
    <div className="h-full flex items-center px-4 gap-2">

      {/* Left: track info */}
      <div className="flex items-center gap-3 w-[28%] min-w-0">
        <div className="relative w-14 h-14 rounded flex-shrink-0 bg-[#282828] overflow-hidden">
          {nowPlaying?.album_art && (
            <Image
              src={nowPlaying.album_art}
              alt="Now playing"
              fill
              className="object-cover"
              unoptimized
              sizes="56px"
            />
          )}
        </div>
        {nowPlaying ? (
          <div className="min-w-0">
            <p className="text-white text-[13px] font-medium truncate leading-tight">
              {nowPlaying.track_name}
            </p>
            <p className="text-[#B3B3B3] text-[11px] truncate mt-0.5">
              {nowPlaying.artist}
            </p>
          </div>
        ) : (
          <div className="min-w-0 hidden sm:block">
            <p className="text-[#6A6A6A] text-[12px] leading-tight">Click 30s preview on any card</p>
          </div>
        )}
      </div>

      {/* Center: controls + progress */}
      <div className="flex flex-col items-center gap-1 flex-1 min-w-0 max-w-[44%] mx-auto">
        <div className="flex items-center gap-4">
          <button
            className="text-[#B3B3B3] hover:text-white transition-colors hidden sm:block"
            aria-label="Shuffle"
          >
            <Shuffle size={15} />
          </button>
          <button
            className="text-[#B3B3B3] hover:text-white transition-colors"
            aria-label="Previous"
          >
            <SkipBack size={17} />
          </button>

          <button
            onClick={toggle}
            disabled={!nowPlaying}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying
              ? <Pause size={14} fill="black" />
              : <Play size={14} fill="black" className="ml-0.5" />
            }
          </button>

          <button
            className="text-[#B3B3B3] hover:text-white transition-colors"
            aria-label="Next"
          >
            <SkipForward size={17} />
          </button>
          <button
            className="text-[#B3B3B3] hover:text-white transition-colors hidden sm:block"
            aria-label="Repeat"
          >
            <Repeat size={15} />
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-[#B3B3B3] text-[10px] tabular-nums w-7 text-right shrink-0">
            {fmt(progress * duration)}
          </span>
          <div
            className="flex-1 h-1 bg-[#535353] rounded-full cursor-pointer group relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              seek((e.clientX - rect.left) / rect.width)
            }}
          >
            <div
              className="h-full bg-white group-hover:bg-[#1DB954] rounded-full transition-colors relative"
              style={{ width: `${progress * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-1.5 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-[#B3B3B3] text-[10px] tabular-nums w-7 shrink-0">
            {fmt(duration)}
          </span>
        </div>
      </div>

      {/* Right: volume controls */}
      <div className="flex items-center gap-3 w-[28%] justify-end">
        <button className="text-[#B3B3B3] hover:text-white transition-colors hidden lg:block" aria-label="Queue">
          <ListMusic size={15} />
        </button>
        <button className="text-[#B3B3B3] hover:text-white transition-colors hidden lg:block" aria-label="Devices">
          <Monitor size={15} />
        </button>
        <div className="hidden md:flex items-center gap-1.5">
          <Volume2 size={15} className="text-[#B3B3B3] shrink-0" />
          <div className="w-20 h-1 bg-[#535353] rounded-full">
            <div className="h-full w-3/4 bg-white rounded-full" />
          </div>
        </div>
        <button className="text-[#B3B3B3] hover:text-white transition-colors hidden xl:block" aria-label="Fullscreen">
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  )
}
