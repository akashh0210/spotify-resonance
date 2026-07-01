'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import IntentInput from '@/components/IntentInput'
import NoveltySlider from '@/components/NoveltySlider'
import ExamplePrompts from '@/components/ExamplePrompts'
import ExplainerCards from '@/components/ExplainerCards'

export default function DiscoverPage() {
  const router = useRouter()
  const [intent, setIntent] = useState('')
  const [noveltyLevel, setNoveltyLevel] = useState(3)

  const handleDiscover = () => {
    if (!intent.trim()) return
    const params = new URLSearchParams({
      intent: intent.trim(),
      novelty_level: String(noveltyLevel),
    })
    router.push(`/results?${params.toString()}`)
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
          disabled={!intent.trim()}
          className="
            w-full flex items-center justify-center gap-2
            py-4 rounded-full font-bold text-base
            bg-accent text-black
            hover:bg-accent-hover
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors
          "
        >
          <Search size={18} />
          Discover
        </button>

        {/* Explainer cards */}
        <div className="mt-12">
          <p className="text-text-subdued text-xs mb-4 uppercase tracking-wider font-medium">
            Why Resonance?
          </p>
          <ExplainerCards />
        </div>
      </div>
    </div>
  )
}
