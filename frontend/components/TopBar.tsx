'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="flex items-center justify-between h-full px-6">
      {/* Navigation arrows */}
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 rounded-full bg-bg-primary flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="w-8 h-8 rounded-full bg-bg-primary flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Go forward"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* User avatar placeholder */}
      <div className="w-8 h-8 rounded-full bg-text-subdued flex items-center justify-center text-xs font-bold text-bg-primary">
        U
      </div>
    </div>
  )
}
