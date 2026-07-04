import type { Metadata } from 'next'
import './globals.css'
import ClientShell from '@/components/ClientShell'

export const metadata: Metadata = {
  title: 'Spotify',
  description: 'A Spotify feature concept: describe your mood, get explained music recommendations.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
