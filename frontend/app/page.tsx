'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import IntentInput from '@/components/IntentInput'
import NoveltySlider from '@/components/NoveltySlider'
import ExamplePrompts from '@/components/ExamplePrompts'
import ExplainerCards from '@/components/ExplainerCards'
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
    <div className="min-h-full px-6 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Hero */}
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-4">
          What are you in the mood to discover?
        </h1>
        <p className="text-text-secondary text-base mb-8 leading-relaxed">
          Describe what you want — your words steer the discovery. The more specific, the better.
        </p>

        {/* Input */}
        <div className="mb-4">
          <IntentInput value={intent} onChange={setIntent} />
        </div>

        {/* Example prompts */}
        <div className="mb-8">
          <p className="text-text-subdued text-xs mb-3 uppercase tracking-wider font-medium">
            Try an example
          </p>
          <ExamplePrompts onSelect={setIntent} />
        </div>

        {/* Novelty slider */}
        <div className="bg-bg-card rounded-lg p-6 mb-8">
          <NoveltySlider value={noveltyLevel} onChange={setNoveltyLevel} />
        </div>

        {/* Discover button */}
        <button
          onClick={handleDiscover}
          disabled={!intent.trim() || loading}
          className="
            w-full flex items-center justify-center gap-2
            py-4 rounded-full font-bold text-base
            bg-accent text-black
            hover:bg-accent-hover
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors
          "
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

        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
        )}

        {/* Skeleton preview while loading */}
        {loading && (
          <div className="mt-10">
            <p className="text-text-subdued text-xs mb-4 text-center animate-pulse">
              Reasoning about your mood...
            </p>
            <SkeletonCards />
          </div>
        )}

        {/* Explainer cards (hide while loading to keep focus) */}
        {!loading && (
          <div className="mt-12">
            <p className="text-text-subdued text-xs mb-4 uppercase tracking-wider font-medium">
              Why Resonance?
            </p>
            <ExplainerCards />
          </div>
        )}
      </div>
    </div>
  )
}
