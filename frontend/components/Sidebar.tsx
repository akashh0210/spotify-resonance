'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Library, Plus, ArrowRight, Search, AlignLeft } from 'lucide-react'

const LIBRARY_ITEMS = [
  {
    id: 1,
    title: 'Liked Songs',
    subtitle: 'Playlist · 847 songs',
    bg: 'linear-gradient(135deg, #450af5 0%, #c4efd9 100%)',
    heart: true,
  },
  {
    id: 2,
    title: 'Discover Weekly',
    subtitle: 'Playlist · Made for you',
    bg: 'linear-gradient(135deg, #1e3264 0%, #2d46b9 100%)',
  },
  {
    id: 3,
    title: 'Daily Mix 1',
    subtitle: 'Playlist · Spotify',
    bg: 'linear-gradient(135deg, #8d1532 0%, #e8115b 100%)',
  },
  {
    id: 4,
    title: 'Release Radar',
    subtitle: 'Playlist · Made for you',
    bg: 'linear-gradient(135deg, #186037 0%, #1e3264 100%)',
  },
  {
    id: 5,
    title: 'Chill Hits',
    subtitle: 'Playlist · Spotify',
    bg: 'linear-gradient(135deg, #4286f4 0%, #86c7f3 100%)',
  },
  {
    id: 6,
    title: 'Old Hindi Classics',
    subtitle: 'Playlist · 124 songs',
    bg: 'linear-gradient(135deg, #7d4d12 0%, #e8a951 100%)',
  },
  {
    id: 7,
    title: 'Daily Mix 2',
    subtitle: 'Playlist · Spotify',
    bg: 'linear-gradient(135deg, #6d3a9e 0%, #c4a0e0 100%)',
  },
  {
    id: 8,
    title: 'Time Capsule',
    subtitle: 'Playlist · Made for you',
    bg: 'linear-gradient(135deg, #1e6b55 0%, #56c596 100%)',
  },
]

const FILTERS = ['Playlists', 'Artists', 'Albums']

export default function Sidebar() {
  const [activeFilter, setActiveFilter] = useState(0)

  return (
    <div className="flex flex-col h-full py-4">

      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          <Library size={20} className="text-[#B3B3B3]" />
          <span className="text-white font-bold text-[15px]">Your Library</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#B3B3B3] hover:text-white hover:bg-[#282828] transition-colors"
            aria-label="Create playlist"
          >
            <Plus size={16} />
          </button>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#B3B3B3] hover:text-white hover:bg-[#282828] transition-colors"
            aria-label="Expand library"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 px-4 mb-4">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            onClick={() => setActiveFilter(i)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeFilter === i
                ? 'bg-white text-black'
                : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Search + sort */}
      <div className="flex items-center justify-between px-4 mb-2">
        <button className="text-[#B3B3B3] hover:text-white transition-colors" aria-label="Search library">
          <Search size={15} />
        </button>
        <button className="flex items-center gap-1 text-[#B3B3B3] text-xs hover:text-white transition-colors">
          <span>Recents</span>
          <AlignLeft size={13} />
        </button>
      </div>

      {/* Library items */}
      <div className="flex-1 overflow-y-auto px-2">
        {LIBRARY_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#2a2a2a] cursor-pointer group"
          >
            <div
              className="w-12 h-12 rounded flex-shrink-0 flex items-center justify-center text-lg"
              style={{ background: item.bg }}
            >
              {item.heart && <span>♥</span>}
            </div>
            <div className="min-w-0">
              <p className="text-white text-[13px] font-medium truncate leading-tight">{item.title}</p>
              <p className="text-[#B3B3B3] text-[11px] truncate mt-0.5">{item.subtitle}</p>
            </div>
          </div>
        ))}

        {/* Resonance link in library */}
        <Link
          href="/discover"
          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#2a2a2a] cursor-pointer group mt-1"
        >
          <div
            className="w-12 h-12 rounded flex-shrink-0 flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, #1DB954 0%, #0d5c2a 100%)' }}
          >
            <span className="text-xs">✦</span>
          </div>
          <div className="min-w-0">
            <p className="text-[#1DB954] text-[13px] font-medium truncate leading-tight">Resonance</p>
            <p className="text-[#B3B3B3] text-[11px] truncate mt-0.5">New Feature · AI Discovery</p>
          </div>
        </Link>
      </div>

      {/* Bottom disclaimer */}
      <div className="px-4 pt-3 mt-auto">
        <div className="border-t border-[#282828] mb-2" />
        <p className="text-[10px] text-[#6A6A6A] leading-relaxed">
          Prototype · Not affiliated with Spotify
        </p>
      </div>
    </div>
  )
}
