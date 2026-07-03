import Link from 'next/link'
import { MessageSquare, Sparkles, SlidersHorizontal } from 'lucide-react'

// ── Waveform equalizer (5 bars, CSS animation) ───────────────
function Waveform() {
  const delays = ['0s', '0.15s', '0.30s', '0.20s', '0.10s']
  return (
    <div className="flex items-end gap-1.5 h-12" aria-hidden>
      {delays.map((delay, i) => (
        <div
          key={i}
          className="w-1.5 bg-accent rounded-sm origin-bottom"
          style={{
            height: '48px',
            animation: `waveform 1.2s ease-in-out ${delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}

// ── Mini bar chart (Section 2) ────────────────────────────────
const THEMES = [
  { label: 'Discovery friction',   count: 1104 },
  { label: 'Love when it works',   count: 1025 },
  { label: 'Autoplay/loop fatigue',count: 908  },
  { label: 'No intent control',    count: 793  },
  { label: 'Power user frustration', count: 453 },
]
const MAX_COUNT = Math.max(...THEMES.map(t => t.count))

function ThemeChart() {
  return (
    <div className="space-y-3">
      {THEMES.map(({ label, count }) => (
        <div key={label}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-text-secondary text-sm">{label}</span>
            <span className="text-text-subdued text-xs tabular-nums">{count.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-[#282828] rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: `${(count / MAX_COUNT) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── How it works steps ────────────────────────────────────────
const HOW_STEPS = [
  {
    icon: MessageSquare,
    title: 'Express intent',
    desc: 'Describe what you want in your own words — "chill cooking vibes", "something like Anuv Jain but upbeat".',
  },
  {
    icon: Sparkles,
    title: 'AI reasons + explains',
    desc: 'An LLM informed by 5,708 real reviews picks 8 tracks and explains each one with specific musical reasons.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Control novelty',
    desc: 'Dial from Comfort to Adventurous. You decide exactly how far to push away from the familiar.',
  },
]

// ── Why AI cards ──────────────────────────────────────────────
const WHY_AI = [
  {
    title: 'Traditional recs fall short',
    body: 'Collaborative filtering optimizes for the familiar. It can\'t parse "upbeat cooking vibes" or explain why it picked a song.',
  },
  {
    title: 'What AI unlocks',
    body: 'Natural language understanding, per-track reasoning, controllable novelty, and community intelligence from 5,708 real user voices.',
  },
  {
    title: 'How the experience shifts',
    body: 'From passive scroll-and-skip to an active discovery dialogue where every pick has a reason you can evaluate.',
  },
]

// ── CTA button ────────────────────────────────────────────────
function CTAButton({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/discover"
      className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-black font-bold text-base hover:bg-accent-hover hover:scale-[1.02] transition-all duration-150 ${className}`}
    >
      Start Discovering →
    </Link>
  )
}

export default function LandingPage() {
  return (
    <div className="fade-in">

      {/* ── SECTION 1: Hero ────────────────────────────────── */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center px-6 py-16 max-w-4xl mx-auto">
        <p className="text-[13px] uppercase tracking-[2px] text-text-subdued font-medium mb-5">
          A Spotify feature concept · Growth PM Capstone
        </p>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-4">
          Resonance
        </h1>

        <p className="text-accent text-xl md:text-2xl font-semibold mb-5 leading-snug">
          Steerable music discovery, powered by community intelligence.
        </p>

        <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-xl mb-10">
          Tell Spotify what you want in plain words. Get 8 tracks with explanations.
          Control how far to push.
        </p>

        <CTAButton />

        {/* Equalizer */}
        <div className="mt-14">
          <Waveform />
        </div>
      </section>

      {/* ── SECTION 2: The Problem ─────────────────────────── */}
      <section className="px-6 py-20 border-t border-border-spotify">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-[13px] uppercase tracking-[1px] text-text-subdued font-medium mb-4">
              The Problem
            </p>
            <h2 className="text-3xl font-bold text-white mb-5 leading-tight">
              The discovery problem
            </h2>
            <p className="text-text-secondary text-base leading-relaxed">
              <span className="text-white font-semibold">69.4% of 5,708 user reviews</span> flag
              discovery friction. Users want new music — but the algorithm keeps serving
              the familiar. The frustration is widespread, consistent, and addressable.
            </p>
          </div>
          <div>
            <p className="text-[13px] uppercase tracking-[1px] text-text-subdued font-medium mb-4">
              Top themes by mention count
            </p>
            <ThemeChart />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: How it works ────────────────────────── */}
      <section className="px-6 py-20 border-t border-border-spotify bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[13px] uppercase tracking-[1px] text-text-subdued font-medium mb-4">
            How it works
          </p>
          <h2 className="text-3xl font-bold text-white mb-10 leading-tight">
            How Resonance works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="bg-bg-card rounded-lg p-5 hover:bg-[#282828] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-accent" />
                  </span>
                  <span className="text-[13px] font-medium text-text-subdued">Step {i + 1}</span>
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Why AI ──────────────────────────────── */}
      <section className="px-6 py-20 border-t border-border-spotify">
        <div className="max-w-4xl mx-auto">
          <p className="text-[13px] uppercase tracking-[1px] text-text-subdued font-medium mb-4">
            The solution
          </p>
          <h2 className="text-3xl font-bold text-white mb-10 leading-tight">
            Why AI changes everything
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHY_AI.map(({ title, body }) => (
              <div
                key={title}
                className="bg-bg-card rounded-lg p-5 hover:bg-[#282828] hover:-translate-y-0.5 transition-all duration-200"
              >
                <h3 className="text-white font-semibold text-base mb-3">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Community intelligence callout ──────── */}
      <section className="px-6 py-20 border-t border-border-spotify bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <div className="border border-accent/30 bg-accent/5 rounded-xl px-8 py-10 text-center">
            <p className="text-[13px] uppercase tracking-[1px] text-accent/70 font-medium mb-4">
              Community intelligence
            </p>
            <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Informed by{' '}
              <span className="text-white font-semibold">5,708 real Spotify reviews</span>
              {' '}across Google Play, App Store, Reddit, and the Spotify Community.
              The agent knows what frustrates users and what makes discovery meaningful —
              because it read their words.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: CTA repeat ──────────────────────────── */}
      <section className="px-6 py-24 border-t border-border-spotify text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to discover?
          </h2>
          <p className="text-text-secondary text-base mb-8 leading-relaxed">
            Type your mood. Get 8 tracks with real explanations. Dial up the novelty.
          </p>
          <CTAButton />
          <p className="mt-8 text-text-subdued text-sm">
            Built as a Growth PM capstone prototype. Not affiliated with Spotify.
          </p>
        </div>
      </section>

    </div>
  )
}
