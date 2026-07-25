'use client';

export default function RestDay({ tomorrowWorkout, cycleDay }) {
  function resetCycle() {
    if (window.confirm('Reset cycle to Day 1 from today?')) {
      localStorage.setItem('cycleStartOverride', new Date().toISOString());
      window.location.reload();
    }
  }

  const tomorrowDay = (cycleDay % 7) + 1;

  return (
    <div className="py-8">
      <h2 className="font-[family-name:var(--font-display)] font-bold uppercase text-[#F0EDE6] leading-none text-8xl">
        REST
      </h2>
      <p className="font-[family-name:var(--font-body)] text-[#888780] text-sm mt-3">Recovery</p>

      <hr className="border-[#2A2A2A] my-8" />

      <div>
        <p className="font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-widest uppercase mb-3">
          TOMORROW — DAY {tomorrowDay}
        </p>
        <p className="font-[family-name:var(--font-display)] font-bold uppercase text-[#F0EDE6] text-3xl leading-tight">
          {tomorrowWorkout.name}
        </p>
        <p className="font-[family-name:var(--font-body)] text-[#888780] text-sm mt-1">
          {tomorrowWorkout.focus}
        </p>
        {tomorrowWorkout.exercises.length > 0 && (
          <p className="font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-wider uppercase mt-2">
            {tomorrowWorkout.exercises.length} EXERCISES
          </p>
        )}
      </div>

      <div className="mt-10">
        <button
          onClick={resetCycle}
          className="cursor-pointer font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-widest uppercase border border-[#2A2A2A] px-4 py-2 hover:border-[#C8FF00] hover:text-[#C8FF00] transition-colors"
        >
          RESET CYCLE
        </button>
      </div>
    </div>
  );
}
