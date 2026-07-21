export default function DayHeader({ dayNumber, name, focus, exerciseCount }) {
  return (
    <div className="pt-6 pb-4 border-b border-[#2A2A2A]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-widest uppercase mb-2">
            DAY {dayNumber} OF 7
          </p>
          <h1 className="font-[family-name:var(--font-display)] font-bold uppercase text-[#F0EDE6] leading-none text-5xl sm:text-6xl">
            {name}
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[#888780] text-sm mt-2">
            {focus}
          </p>
        </div>
        {exerciseCount > 0 && (
          <div className="flex-shrink-0 mt-8 text-right">
            <p className="font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-wider uppercase whitespace-nowrap">
              {exerciseCount} EXERCISES
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
