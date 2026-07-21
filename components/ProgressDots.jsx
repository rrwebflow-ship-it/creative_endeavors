export default function ProgressDots({ currentDay }) {
  return (
    <div className="flex gap-2 mt-4 mb-2">
      {Array.from({ length: 7 }, (_, i) => {
        const day = i + 1;
        const isDone = day < currentDay;
        const isActive = day === currentDay;

        let cls = 'flex items-center justify-center text-xs font-[family-name:var(--font-body)]';
        if (isDone) cls += ' bg-[#2A5C3A] text-[#4CAF72]';
        else if (isActive) cls += ' bg-[#C8FF00] text-[#0F0F0F] font-bold';
        else cls += ' border border-[#2A2A2A] text-[#888780]';

        return (
          <div
            key={day}
            className={cls}
            style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }}
          >
            {isDone ? '✓' : day}
          </div>
        );
      })}
    </div>
  );
}
