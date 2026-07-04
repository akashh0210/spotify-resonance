'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

export type NowPlayingTrack = {
  track_name: string
  artist: string
  album_art: string | null
  preview_url: string
}

type PlayerContextValue = {
  nowPlaying: NowPlayingTrack | null
  isPlaying: boolean
  progress: number   // 0–1
  duration: number   // seconds
  play: (track: NowPlayingTrack) => void
  toggle: () => void
  seek: (pct: number) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const cleanup = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    a.pause()
    a.src = ''
    a.load()
    audioRef.current = null
  }, [])

  const play = useCallback((track: NowPlayingTrack) => {
    cleanup()
    const audio = new Audio(track.preview_url)
    audioRef.current = audio

    audio.addEventListener('timeupdate', () => {
      setProgress(audio.currentTime / (audio.duration || 1))
    })
    audio.addEventListener('durationchange', () => {
      setDuration(audio.duration)
    })
    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setProgress(0)
    })

    audio.play().then(() => {
      setIsPlaying(true)
      setNowPlaying(track)
      setProgress(0)
    }).catch(() => {
      // autoplay policy — ignore silently
    })
  }, [cleanup])

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (isPlaying) {
      a.pause()
      setIsPlaying(false)
    } else {
      a.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }, [isPlaying])

  const seek = useCallback((pct: number) => {
    const a = audioRef.current
    if (!a) return
    a.currentTime = pct * (a.duration || 0)
  }, [])

  useEffect(() => () => cleanup(), [cleanup])

  return (
    <PlayerContext.Provider value={{ nowPlaying, isPlaying, progress, duration, play, toggle, seek }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer requires PlayerProvider')
  return ctx
}
