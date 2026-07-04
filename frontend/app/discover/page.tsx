'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import IntentInput from '@/components/IntentInput'
import NoveltySlider from '@/components/NoveltySlider'
import ExamplePrompts from '@/components/ExamplePrompts'
import SkeletonCards from '@/components/SkeletonCards'
import { fetchDiscovery } from '@/lib/api'

export default function DiscoverPage() {
  const router = useRouter()
  const [intent, setIntent] = useState('')
  const [noveltyLevel, setNoveltyLevel] = useState(3)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDiscover = async () => {
    if (!intent.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchDiscovery(intent.trim(), noveltyLevel)
      sessionStorage.setItem('lastDiscovery', JSON.stringify(data))
      router.push('/results')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      if (msg.includes('fetch') || msg.includes('NetworkError') || msg.includes('Failed to fetch'))
        setError('Discovery service is warming up — try again in 30 seconds.')
      else if (msg.includes('429'))
        setError('Too many discoveries — wait a moment and try again.')
      else
        setError('Something went wrong. Try rephrasing your mood.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full px-6 py-10 fade-in">
      <div className="max-w-2xl mx-auto">

        {/* NEW FEATURE badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/25">
          <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse flex-shrink-0" />
          <span className="text-[#1DB954] text-sm font-semibold">NEW FEATURE: Resonance</span>
          <span className="text-[#B3B3B3] text-sm hidden sm:inline">
            — describe your mood, get explained recommendations
          </span>
        </div>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-3">
          What are you in the mood to discover?
        </h1>
        <p className="text-[#B3B3B3] text-base mb-8 leading-relaxed">
          Describe what you want — your words steer the discovery. The more specific, the better.
        </p>

        {/* Intent input */}
        <div className="mb-4">
          <IntentInput value={intent} onChange={setIntent} />
        </div>

        {/* Example prompts */}
        <div className="mb-8">
          <p className="text-[13px] uppercase tracking-[1px] text-[#6A6A6A] font-medium mb-3">
            Try an example
          </p>
          <ExamplePrompts onSelect={setIntent} />
        </div>

        {/* Novelty slider */}
        <div className="bg-[#181818] rounded-lg p-6 mb-8">
          <NoveltySlider value={noveltyLevel} onChange={setNoveltyLevel} />
        </div>

        {/* Discover button */}
        <button
          onClick={handleDiscover}
          disabled={!intent.trim() || loading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-base bg-[#1DB954] text-black hover:bg-[#1ED760] hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-150"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Discovering...
            </>
          ) : (
            <>
              <Search size={18} />
              Discover
            </>
          )}
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
        )}

        {loading && (
          <div className="mt-10">
            <p className="text-[#6A6A6A] text-sm mb-4 text-center animate-pulse">
              Reasoning about your mood...
            </p>
            <SkeletonCards />
          </div>
        )}
      </div>
    </div>
  )
}
