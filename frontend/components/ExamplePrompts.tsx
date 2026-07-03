'use client'

const PROMPTS = [
  'Something like Anuv Jain but more upbeat for cooking',
  'Calm acoustic songs for a rainy evening, no mainstream',
  'High energy workout mix, artists I\'ve never heard',
]

interface ExamplePromptsProps {
  onSelect: (prompt: string) => void
}

export default function ExamplePrompts({ onSelect }: ExamplePromptsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          title="Click to try this prompt"
          className="
            px-4 py-2 rounded-full text-sm
            border border-border-spotify text-text-secondary
            hover:bg-bg-card-hover hover:text-text-primary hover:border-text-subdued
            transition-all duration-150
          "
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
