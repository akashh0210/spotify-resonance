'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Library } from 'lucide-react'

const NAV_ITEMS = [
  { icon: Home,    label: 'Home',         href: '/'         },
  { icon: Search,  label: 'Search',       href: '#'         },
  { icon: Library, label: 'Your Library', href: '#'         },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full px-3 py-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-3 mb-8">
        <span className="inline-block w-2 h-2 rounded-full bg-accent flex-shrink-0" />
        <span className="text-text-primary font-bold text-xl tracking-tight">resonance</span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href || (href === '/discover' && pathname === '/discover')
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-4 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                active
                  ? 'text-text-primary bg-transparent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card-hover'
              }`}
            >
              <Icon
                size={20}
                className={active ? 'text-text-primary' : 'text-text-secondary'}
                aria-hidden
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto">
        <div className="border-t border-border-spotify mb-3" />
        <p className="px-3 text-[11px] text-text-subdued leading-relaxed">
          Prototype · Not affiliated with Spotify
        </p>
      </div>
    </div>
  )
}
