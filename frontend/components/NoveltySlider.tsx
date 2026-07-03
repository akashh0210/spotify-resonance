'use client'

import * as Slider from '@radix-ui/react-slider'

const STOPS = [
  { label: 'Comfort',     description: 'Stay close to what you know — familiar names, safe picks.' },
  { label: 'Familiar+',   description: "Same territory, deeper cuts. Lesser-known artists you'll likely enjoy." },
  { label: 'Balanced',    description: 'Mix of known and new — adjacent genres that share your mood.' },
  { label: 'Exploratory', description: 'Cross-genre picks connected by mood. Expect to be pleasantly stretched.' },
  { label: 'Adventurous', description: 'Genuinely surprising. Different languages, eras, genres — connected by feel.' },
]

interface NoveltySliderProps {
  value: number
  onChange: (value: number) => void
}

export default function NoveltySlider({ value, onChange }: NoveltySliderProps) {
  const current = STOPS[value - 1]

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-[13px] font-medium uppercase tracking-[1px] text-text-subdued">
          How far to push?
        </p>
        <span className="text-sm font-semibold text-accent">{current.label}</span>
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        min={1}
        max={5}
        step={1}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
      >
        <Slider.Track className="relative bg-[#535353] rounded-full h-1 flex-1">
          <Slider.Range className="absolute bg-accent rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="
            block w-4 h-4 bg-white rounded-full
            shadow-[0_2px_8px_rgba(0,0,0,0.5)]
            hover:scale-110
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary
            transition-transform cursor-pointer
          "
          aria-label="Novelty level"
        />
      </Slider.Root>

      {/* Stop labels */}
      <div className="flex justify-between mt-2.5">
        {STOPS.map((stop, i) => (
          <button
            key={stop.label}
            onClick={() => onChange(i + 1)}
            className={`text-[13px] transition-colors ${
              value === i + 1
                ? 'text-white font-semibold'
                : 'text-text-subdued hover:text-text-secondary'
            }`}
          >
            {stop.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-text-secondary leading-relaxed italic">
        "{current.description}"
      </p>
    </div>
  )
}
