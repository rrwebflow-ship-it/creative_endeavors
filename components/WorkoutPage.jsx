'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTodaysWorkout, getTomorrowsWorkout, getCycleDay } from '@/lib/getWorkout';
import DayHeader from './DayHeader';
import ProgressDots from './ProgressDots';
import ExerciseCard from './ExerciseCard';
import RestDay from './RestDay';

function resetCycle() {
  if (window.confirm('Reset cycle to Day 1 from today?')) {
    localStorage.setItem('cycleStartOverride', new Date().toISOString());
    window.location.reload();
  }
}

export default function WorkoutPage() {
  const [mounted, setMounted] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [tomorrow, setTomorrow] = useState(null);
  const [cycleDay, setCycleDay] = useState(1);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setWorkout(getTodaysWorkout());
    setTomorrow(getTomorrowsWorkout());
    setCycleDay(getCycleDay());
    setDateStr(
      new Date()
        .toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
        .toUpperCase()
    );
    setMounted(true);
  }, []);

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
            FULL WEEK →
          </Link>
        </div>

        {mounted && workout ? (
          <>
            <DayHeader
              dayNumber={cycleDay}
              name={workout.name}
              focus={workout.focus}
              exerciseCount={workout.exercises.length}
            />
            <ProgressDots currentDay={cycleDay} />

            <div className="mt-6">
              {workout.exercises.length === 0 ? (
                <RestDay tomorrowWorkout={tomorrow} cycleDay={cycleDay} />
              ) : (
                <>
                  {workout.exercises.map((exercise, i) => (
                    <ExerciseCard
                      key={i}
                      name={exercise.name}
                      sets={exercise.sets}
                      reps={exercise.reps}
                      type={exercise.type}
                    />
                  ))}
                  <div className="flex items-center justify-between py-8 mt-4">
                    <span className="font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-widest uppercase">
                      {dateStr}
                    </span>
                    <button
                      onClick={resetCycle}
                      className="font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-widest uppercase border border-[#2A2A2A] px-4 py-2 hover:border-[#C8FF00] hover:text-[#C8FF00] transition-colors"
                    >
                      RESET CYCLE
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="pt-6 pb-4 border-b border-[#2A2A2A]">
            <p className="font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-widest uppercase mb-2">
              LOADING...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
