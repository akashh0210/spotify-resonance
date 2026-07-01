'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const CARDS = [
  {
    title: 'Why traditional recs fall short',
    icon: '📊',
    content:
      'Collaborative filtering — the engine behind Spotify\'s current recommendations — works by finding users "like you" and surfacing what they listened to. But it recycles familiar tracks and has no channel for intent. Our review analysis found 793 mentions of users unable to express what they want right now, and 1,104 complaints that recommendations recycle the same familiar content instead of surfacing genuine novelty.',
  },
  {
    title: 'What AI unlocks',
    icon: '✨',
    content:
      'AI understands natural language intent. You can say "something upbeat for cooking but emotionally grounded like Anuv Jain" and get recommendations calibrated exactly to that. More importantly, AI can explain its picks in musical terms — instrumentation, tempo, mood, cultural context — building the trust needed to try something unfamiliar. 4 of 6 users in our interviews said explanation would make them more likely to give an unknown track a chance.',
  },
  {
    title: 'How this changes the experience',
    icon: '🎯',
    content:
      'Discovery shifts from passive (the algorithm decides) to active (you steer with words). The novelty dial gives you explicit control over how far to push — something no existing Spotify feature offers. And because recommendations come with specific musical explanations, you\'re not just hearing a track, you\'re learning why it fits. 5 of 6 users in our interviews currently discover music outside Spotify. This changes that.',
  },
]

export default function ExplainerCards() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-3">
      {CARDS.map((card, i) => (
        <div
          key={card.title}
          className="bg-bg-card rounded-lg border border-border-spotify overflow-hidden"
        >
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg-card-hover transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{card.icon}</span>
              <span className="text-sm font-semibold text-text-primary">{card.title}</span>
            </div>
            {open === i ? (
              <ChevronUp size={16} className="text-text-subdued flex-shrink-0" />
            ) : (
              <ChevronDown size={16} className="text-text-subdued flex-shrink-0" />
            )}
          </button>
          {open === i && (
            <div className="px-5 pb-5">
              <p className="text-sm text-text-secondary leading-relaxed">{card.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
