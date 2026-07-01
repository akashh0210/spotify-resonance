'use client'

import * as Slider from '@radix-ui/react-slider'

const STOPS = [
  {
    label: 'Comfort',
    description: 'Stay close to what you know — familiar names, safe picks.',
  },
  {
    label: 'Familiar+',
    description: 'Same territory, deeper cuts. Lesser-known artists you\'ll likely enjoy.',
  },
  {
    label: 'Balanced',
    description: 'Mix of known and new — adjacent genres that share your mood.',
  },
  {
    label: 'Exploratory',
    description: 'Cross-genre picks connected by mood. Expect to be pleasantly stretched.',
  },
  {
    label: 'Adventurous',
    description: 'Genuinely surprising. Different languages, eras, genres — connected by feel.',
  },
]

interface NoveltySliderProps {
  value: number
  onChange: (value: number) => void
}

export default function NoveltySlider({ value, onChange }: NoveltySliderProps) {
  const current = STOPS[value - 1]

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-subdued">
          How far to push?
        </p>
        <span className="text-xs font-medium text-accent">{current.label}</span>
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        min={1}
        max={5}
        step={1}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
      >
        <Slider.Track className="relative bg-border-spotify rounded-full h-1 flex-1">
          <Slider.Range className="absolute bg-accent rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 bg-accent rounded-full shadow-md hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary transition-colors cursor-pointer"
          aria-label="Novelty level"
        />
      </Slider.Root>

      {/* Stop labels */}
      <div className="flex justify-between mt-2">
        {STOPS.map((stop, i) => (
          <button
            key={stop.label}
            onClick={() => onChange(i + 1)}
            className={`text-xs transition-colors ${
              value === i + 1 ? 'text-accent font-medium' : 'text-text-subdued hover:text-text-secondary'
            }`}
          >
            {stop.label}
          </button>
        ))}
      </div>

      {/* Dynamic description */}
      <p className="mt-3 text-sm text-text-secondary leading-relaxed italic">
        "{current.description}"
      </p>
    </div>
  )
}
