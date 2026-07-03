export default function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-bg-card rounded-lg overflow-hidden flex flex-row md:flex-col"
        >
          {/* Art placeholder */}
          <div className="shimmer flex-shrink-0 w-[110px] h-[110px] md:w-full md:h-[160px] rounded-l-lg md:rounded-l-none md:rounded-t-lg" />

          {/* Text placeholders */}
          <div className="flex flex-col gap-2.5 flex-1 p-3 md:p-4 justify-center">
            <div className="shimmer h-3 rounded w-3/4" />
            <div className="shimmer h-2.5 rounded w-1/2" />
            <div className="shimmer h-2 rounded w-full mt-1" />
            <div className="shimmer h-2 rounded w-5/6" />
            <div className="shimmer h-2 rounded w-4/6" />
            <div className="shimmer h-6 rounded-full w-28 mt-1" />
          </div>
        </div>
      ))}
    </div>
  )
}
