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
        bg-[#282828] border-2 border-transparent
        text-white placeholder-[#6A6A6A]
        text-base leading-relaxed
        focus:outline-none focus:border-accent
        focus:shadow-[0_0_0_3px_rgba(29,185,84,0.18)]
        transition-all duration-150
      "
    />
  )
}
