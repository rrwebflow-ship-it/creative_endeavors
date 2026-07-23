export default function DayHeader({ dayNumber, name, focus, exerciseCount }) {
  return (
    <div className="pt-6 pb-4 border-b border-[#2A2A2A]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-[family-name:var(--font-body)] text-[#888780] tracking-widest uppercase mb-2" style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>
            DAY {dayNumber} OF 7
          </p>
          <h1 className="font-[family-name:var(--font-display)] font-bold uppercase text-[#F0EDE6] leading-none" style={{ fontSize: 'clamp(1.25rem, 7.5vw, 2.5rem)' }}>
            {name}
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[#888780] mt-2" style={{ fontSize: 'clamp(0.75rem, 3.5vw, 0.875rem)' }}>
            {focus}
          </p>
        </div>
        {exerciseCount > 0 && (
          <div className="flex-shrink-0 mt-8 text-right">
            <p className="font-[family-name:var(--font-body)] text-[#888780] tracking-wider uppercase whitespace-nowrap" style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>
              {exerciseCount} EXERCISES
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
