'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Menu, X, User } from 'lucide-react'
import Sidebar from './Sidebar'

export default function TopBar() {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left: hamburger (mobile) + nav arrows (desktop) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-8 h-8 rounded-full bg-[#282828] flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-[#3E3E3E] transition-colors"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <button
            onClick={() => router.back()}
            className="hidden md:flex w-8 h-8 rounded-full bg-[#282828] items-center justify-center text-text-secondary hover:text-text-primary hover:bg-[#3E3E3E] transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => router.forward()}
            className="hidden md:flex w-8 h-8 rounded-full bg-[#282828] items-center justify-center text-text-secondary hover:text-text-primary hover:bg-[#3E3E3E] transition-colors"
            aria-label="Go forward"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Right: avatar */}
        <div className="w-9 h-9 rounded-full bg-[#282828] flex items-center justify-center text-text-secondary">
          <User size={18} />
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-bg-primary shadow-2xl">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Close menu"
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
