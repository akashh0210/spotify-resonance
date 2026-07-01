export default function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-bg-card rounded-lg p-4 flex gap-4 animate-pulse"
        >
          {/* Art placeholder */}
          <div className="flex-shrink-0 w-[120px] h-[120px] rounded-md bg-bg-elevated" />

          {/* Text placeholders */}
          <div className="flex flex-col gap-2 flex-1 py-1">
            <div className="h-3 bg-bg-elevated rounded w-3/4" />
            <div className="h-2 bg-bg-elevated rounded w-1/2" />
            <div className="h-2 bg-bg-elevated rounded w-2/3 mt-2" />
            <div className="h-2 bg-bg-elevated rounded w-full" />
            <div className="h-2 bg-bg-elevated rounded w-5/6" />
            <div className="h-6 bg-bg-elevated rounded-full w-28 mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}
