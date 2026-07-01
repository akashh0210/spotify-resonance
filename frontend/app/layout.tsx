import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export const metadata: Metadata = {
  title: 'Resonance — Music Discovery',
  description: 'AI-powered music discovery with community intelligence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex overflow-hidden bg-bg-primary text-text-primary">
        <aside className="hidden md:flex flex-col w-60 min-w-[240px] bg-bg-elevated flex-shrink-0">
          <Sidebar />
        </aside>
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <header className="flex-shrink-0 h-16 bg-bg-elevated border-b border-border-spotify">
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
