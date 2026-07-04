'use client'

import { PlayerProvider } from './PlayerProvider'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import NowPlayingBar from './NowPlayingBar'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-black">

        {/* Full-width topbar */}
        <header className="flex-shrink-0 h-16 bg-black z-40">
          <TopBar />
        </header>

        {/* Content row: sidebar + main */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          <aside className="hidden md:flex flex-col w-[280px] bg-black border-r border-[#282828] overflow-y-auto flex-shrink-0">
            <Sidebar />
          </aside>
          <main className="flex-1 overflow-y-auto bg-[#121212]">
            {children}
          </main>
        </div>

        {/* Full-width player bar */}
        <div className="flex-shrink-0 h-[72px] bg-[#181818] border-t border-[#282828]">
          <NowPlayingBar />
        </div>
      </div>
    </PlayerProvider>
  )
}
