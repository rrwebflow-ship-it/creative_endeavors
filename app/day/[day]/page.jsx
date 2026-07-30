'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { workouts } from '@/lib/workouts';
import { getPlan } from '@/lib/storage';
import { getWarmupForDay } from '@/lib/warmupStorage';
import DayHeader from '@/components/DayHeader';
import WorkoutTracker from '@/components/WorkoutTracker';
import { use } from 'react';

export default function DayPage({ params }) {
  const { day } = use(params);
  const dayNum = parseInt(day, 10);

  const [workout, setWorkout] = useState(() => workouts.find(w => w.day === dayNum));
  const [warmupCount, setWarmupCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const plan = getPlan();
    const saved = plan.find(w => w.day === dayNum);
    if (saved) setWorkout(saved);
    const warmup = getWarmupForDay(dayNum);
    setWarmupCount(warmup.items?.length || 0);
    setMounted(true);
  }, [dayNum]);

  if (!workout) return notFound();

  const isRestDay = workout.exercises.length === 0;

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="mx-auto w-full max-w-[480px] px-6">
        <div className="flex items-center justify-between py-5 px-6 -mx-6 bg-[#D1E231]">
          <span className="font-[family-name:var(--font-display)] font-bold uppercase text-[#0F0F0F] tracking-wider" style={{ fontSize: 'clamp(1.125rem, 5vw, 1.25rem)' }}>
            WKOUT
          </span>
          <div className="flex items-center gap-3">
            <Link
              href={`/edit/${dayNum}`}
              className="font-[family-name:var(--font-body)] text-[#0F0F0F] tracking-widest uppercase hover:opacity-60 transition-opacity"
              style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
            >
              EDIT
            </Link>
            <Link
              href="/week"
              className="font-[family-name:var(--font-body)] text-[#0F0F0F] tracking-widest uppercase hover:opacity-60 transition-opacity border border-[#0F0F0F] px-3 py-1.5"
              style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
            >
              FULL WEEK
            </Link>
          </div>
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
              <h2 className="font-[family-name:var(--font-display)] font-bold uppercase text-[#F0EDE6] leading-none" style={{ fontSize: 'clamp(4rem, 20vw, 6rem)' }}>
                REST
              </h2>
              <p className="font-[family-name:var(--font-body)] text-[#888780] mt-3" style={{ fontSize: 'clamp(0.9375rem, 3.8vw, 1rem)' }}>
                Recovery day
              </p>
            </div>
          ) : (
            mounted && <WorkoutTracker exercises={workout.exercises} dayNumber={dayNum} warmupCount={warmupCount} />
          )}
        </div>

        <div className="flex items-center justify-between py-8 mt-4 border-t border-[#2A2A2A]">
          {dayNum > 1 ? (
            <Link
              href={`/day/${dayNum - 1}`}
              className="font-[family-name:var(--font-body)] text-[#888780] tracking-widest uppercase hover:text-[#F0EDE6] transition-colors"
              style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
            >
              ← DAY {dayNum - 1}
            </Link>
          ) : (
            <span />
          )}
          {dayNum < 7 ? (
            <Link
              href={`/day/${dayNum + 1}`}
              className="font-[family-name:var(--font-body)] text-[#888780] tracking-widest uppercase hover:text-[#F0EDE6] transition-colors"
              style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
            >
              DAY {dayNum + 1} →
            </Link>
          ) : (
            <Link
              href="/day/1"
              className="font-[family-name:var(--font-body)] text-[#888780] tracking-widest uppercase hover:text-[#F0EDE6] transition-colors"
              style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
            >
              RESTART CYCLE →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
