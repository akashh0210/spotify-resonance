'use client'

interface IntentInputProps {
  value: string
  onChange: (value: string) => void
}

export default function IntentInput({ value, onChange }: IntentInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g., Something like Anuv Jain but more upbeat, for cooking on a Sunday morning..."
      rows={3}
      className="
        w-full resize-none rounded-lg p-4
        bg-bg-card border border-border-spotify
        text-text-primary placeholder-text-subdued
        text-sm leading-relaxed
        focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
        transition-colors
      "
    />
  )
}
