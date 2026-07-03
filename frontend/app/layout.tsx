import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export const metadata: Metadata = {
  title: 'Resonance · Spotify Discovery',
  description: 'AI-powered music discovery that explains every pick.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex overflow-hidden bg-bg-primary text-text-primary">
        {/* Sidebar — 240px, hidden below md */}
        <aside className="hidden md:flex flex-col w-[240px] min-w-[240px] bg-bg-sidebar flex-shrink-0 border-r border-border-spotify">
          <Sidebar />
        </aside>

        {/* Main column */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Topbar — sticky 64px */}
          <header className="flex-shrink-0 h-16 bg-bg-primary border-b border-border-spotify sticky top-0 z-40">
            <TopBar />
          </header>

          <main className="flex-1 overflow-y-auto bg-bg-primary">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
