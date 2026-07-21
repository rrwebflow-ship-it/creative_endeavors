import { notFound } from 'next/navigation';
import Link from 'next/link';
import { workouts } from '@/lib/workouts';
import DayHeader from '@/components/DayHeader';
import WorkoutTracker from '@/components/WorkoutTracker';

export function generateStaticParams() {
  return workouts.map((w) => ({ day: String(w.day) }));
}

export async function generateMetadata({ params }) {
  const { day } = await params;
  const workout = workouts.find((w) => w.day === parseInt(day, 10));
  if (!workout) return {};
  return { title: `Day ${workout.day} — ${workout.name} — WKOUT` };
}

export default async function DayPage({ params }) {
  const { day } = await params;
  const dayNum = parseInt(day, 10);
  const workout = workouts.find((w) => w.day === dayNum);

  if (!workout) notFound();

  const isRestDay = workout.exercises.length === 0;

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="mx-auto w-full max-w-[480px] px-6">
        <div className="flex items-center justify-between py-5 border-b border-[#2A2A2A]">
          <span className="font-[family-name:var(--font-display)] text-xl font-bold uppercase text-[#F0EDE6] tracking-wider">
            WKOUT
          </span>
          <Link
            href="/week"
            className="font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-widest uppercase hover:text-[#F0EDE6] transition-colors"
          >
            FULL WEEK
          </Link>
        </div>

        <DayHeader
          dayNumber={workout.day}
          name={workout.name}
          focus={workout.focus}
          exerciseCount={workout.exercises.length}
        />

        <div className="mt-6">
          {isRestDay ? (
            <div className="py-8">
              <h2 className="font-[family-name:var(--font-display)] font-bold uppercase text-[#F0EDE6] leading-none text-8xl">
                REST
              </h2>
              <p className="font-[family-name:var(--font-body)] text-[#888780] text-sm mt-3">
                Recovery day
              </p>
            </div>
          ) : (
            <WorkoutTracker exercises={workout.exercises} dayNumber={dayNum} />
          )}
        </div>

        <div className="flex items-center justify-between py-8 mt-4 border-t border-[#2A2A2A]">
          {dayNum > 1 ? (
            <Link
              href={`/day/${dayNum - 1}`}
              className="font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-widest uppercase hover:text-[#F0EDE6] transition-colors"
            >
              ← DAY {dayNum - 1}
            </Link>
          ) : (
            <span />
          )}
          {dayNum < 7 ? (
            <Link
              href={`/day/${dayNum + 1}`}
              className="font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-widest uppercase hover:text-[#F0EDE6] transition-colors"
            >
              DAY {dayNum + 1} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
