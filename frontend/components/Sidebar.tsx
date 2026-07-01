'use client'

import { Home, Search, Library, Music2 } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home' },
  { icon: Search, label: 'Search' },
  { icon: Library, label: 'Your Library' },
]

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full px-6 py-8">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <Music2 className="text-accent" size={28} />
        <span className="text-text-primary font-bold text-xl tracking-tight">
          resonance
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="flex items-center gap-4 px-2 py-3 text-text-secondary hover:text-text-primary cursor-pointer rounded-md transition-colors hover:bg-bg-card-hover text-sm font-medium"
          >
            <Icon size={20} />
            {label}
          </span>
        ))}
      </nav>

      {/* Bottom spacer + tagline */}
      <div className="mt-auto">
        <p className="text-text-subdued text-xs leading-relaxed">
          Powered by community intelligence from 5,708 real Spotify reviews
        </p>
      </div>
    </div>
  )
}
