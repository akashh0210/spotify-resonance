'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  LayoutGrid,
  Bell,
  Users,
  Download,
  Home,
  Menu,
  X,
} from 'lucide-react'
import Sidebar from './Sidebar'

function SpotifyLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" aria-label="Spotify">
      <circle cx="12" cy="12" r="12" fill="#1DB954" />
      <path d="M8 16.5c2.5-1.3 5.5-1.8 8-1" stroke="white" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <path d="M7 12.5c3-1.8 7.5-2.3 10.5-1" stroke="white" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <path d="M6.5 8.5c3.5-2 9-2.6 12.5-1" stroke="white" strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export default function TopBar() {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className="flex items-center h-full px-4 gap-3">

        {/* Left: Spotify logo + Home + nav arrows */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/" className="flex items-center">
            <SpotifyLogo />
          </Link>

          {/* Desktop: Home icon + back/forward */}
          <Link
            href="/"
            className="hidden md:flex w-8 h-8 rounded-full bg-[#282828] items-center justify-center text-white hover:scale-105 transition-transform"
            aria-label="Home"
          >
            <Home size={16} />
          </Link>
          <button
            onClick={() => router.back()}
            className="hidden md:flex w-8 h-8 rounded-full bg-[#282828] items-center justify-center text-[#B3B3B3] hover:text-white transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => router.forward()}
            className="hidden md:flex w-8 h-8 rounded-full bg-[#282828] items-center justify-center text-[#B3B3B3] hover:text-white transition-colors"
            aria-label="Go forward"
          >
            <ChevronRight size={18} />
          </button>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-8 h-8 rounded-full bg-[#282828] flex items-center justify-center text-[#B3B3B3] hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Center: search bar (links to /discover) */}
        <Link href="/discover" className="flex-1 max-w-[480px] hidden md:block">
          <div className="flex items-center bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full px-4 h-10 gap-2 transition-colors cursor-pointer">
            <Search size={15} className="text-[#B3B3B3] flex-shrink-0" />
            <span className="flex-1 text-[13px] text-[#6A6A6A] truncate select-none">
              What do you want to play?
            </span>
            <div className="w-px h-5 bg-[#535353] flex-shrink-0" />
            <LayoutGrid size={15} className="text-[#B3B3B3] flex-shrink-0" />
          </div>
        </Link>

        {/* Right: premium, install, icons, avatar */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
          <button className="hidden lg:flex items-center px-4 py-1.5 rounded-full bg-white text-black text-[13px] font-bold hover:scale-105 transition-transform whitespace-nowrap">
            Explore Premium
          </button>
          <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#B3B3B3] text-[13px] hover:text-white hover:bg-[#282828] transition-colors whitespace-nowrap">
            <Download size={15} />
            <span className="hidden lg:inline">Install App</span>
          </button>
          <button className="hidden md:flex w-8 h-8 rounded-full items-center justify-center text-[#B3B3B3] hover:text-white hover:bg-[#282828] transition-colors">
            <Bell size={16} />
          </button>
          <button className="hidden md:flex w-8 h-8 rounded-full items-center justify-center text-[#B3B3B3] hover:text-white hover:bg-[#282828] transition-colors">
            <Users size={16} />
          </button>
          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-black text-[13px] font-bold cursor-pointer hover:scale-105 transition-transform select-none">
            A
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-black shadow-2xl overflow-y-auto">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="text-[#B3B3B3] hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}
    </>
  )
}
