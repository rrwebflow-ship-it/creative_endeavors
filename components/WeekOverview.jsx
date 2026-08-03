'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCycleDay } from '@/lib/getWorkout';
import { getPlan, resetPlan, resetCycle } from '@/lib/storage';

export default function WeekOverview() {
  const [mounted, setMounted] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setWorkouts(getPlan());
    setCurrentDay(getCycleDay());
    setMounted(true);
  }, []);

  function handleReset() {
    resetPlan();
    resetCycle();
    setWorkouts(getPlan());
    setCurrentDay(getCycleDay());
    setShowResetConfirm(false);
  }

  const daysRemaining = 7 - currentDay;

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="mx-auto w-full max-w-[480px] px-6">
        <div className="flex items-center justify-between py-5 px-6 -mx-6 bg-[#D1E231]">
          <span className="font-[family-name:var(--font-display)] font-bold uppercase text-[#0F0F0F] tracking-wider" style={{ fontSize: 'clamp(1.125rem, 5vw, 1.25rem)' }}>
            FULL WEEK
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/edit"
              className="inline-flex items-center justify-center leading-none font-[family-name:var(--font-body)] text-[#0F0F0F] tracking-widest uppercase hover:opacity-60 transition-opacity"
              style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)', transform: 'translateY(2px)' }}
            >
              EDIT
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1 leading-none font-[family-name:var(--font-body)] text-[#0F0F0F] tracking-widest uppercase hover:opacity-60 transition-opacity border border-[#0F0F0F] px-3 py-2"
            >
              <span style={{ fontSize: 'clamp(1rem, 4vw, 1.125rem)', lineHeight: 1, transform: 'translateY(-0.5px)', display: 'inline-block' }}>←</span>
              <span style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)', lineHeight: 1, transform: 'translateY(1px)', display: 'inline-block' }}>TODAY</span>
            </Link>
          </div>
        </div>

        {mounted ? (
          <>
            <div className="mt-2" data-onboarding="week-grid">
              {workouts.map((workout) => {
                const isDone = workout.day < currentDay;
                const isActive = workout.day === currentDay;
                const isRest = workout.exercises.length === 0;

                return (
                  <Link
                    key={workout.day}
                    href={`/day/${workout.day}`}
                    className={`flex items-center justify-between py-4 px-6 -mx-6 border-b border-[#2A2A2A] transition-colors hover:bg-[#1A1A1A]${isActive ? ' bg-[#1A1A18]' : ''}${isRest ? ' opacity-50' : ''}`}
                    style={isActive ? { borderLeft: '3px solid #D1E231' } : {}}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`flex items-center justify-center font-[family-name:var(--font-body)] flex-shrink-0${
                          isDone ? ' bg-[#2A5C3A] text-[#4CAF72]' :
                          isActive ? ' bg-[#C8FF00] text-[#0F0F0F] font-bold' :
                          ' border border-[#2A2A2A] text-[#888780]'
                        }`}
                        style={{ width: 28, height: 28, borderRadius: '50%', fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
                      >
                        {isDone ? '✓' : workout.day}
                      </div>
                      <div className="min-w-0">
                        <p className="font-[family-name:var(--font-display)] font-bold uppercase text-[#F0EDE6] leading-tight" style={{ fontSize: 'clamp(1.0625rem, 4.5vw, 1.125rem)' }}>
                          {workout.name}
                        </p>
                        <p className="font-[family-name:var(--font-body)] text-[#888780] mt-0.5" style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}>
                          {workout.focus}
                        </p>
                      </div>
                    </div>
                    {workout.exercises.length > 0 && (
                      <div className="flex-shrink-0 ml-4 bg-[#252520] border border-[#2A2A2A] px-3 py-1 font-[family-name:var(--font-body)] text-[#888780] tracking-wider uppercase whitespace-nowrap" style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}>
                        {workout.exercises.length} EXERCISES
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="py-8 flex items-center justify-between">
              <p className="font-[family-name:var(--font-body)] text-[#888780] tracking-widest uppercase" style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}>
                {daysRemaining} DAYS REMAINING IN CYCLE
              </p>
              {showResetConfirm ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest px-4 py-2 bg-[#D1E231] text-[#0F0F0F] font-bold"
                    style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest px-4 py-2 border border-[#2A2A2A] text-[#888780]"
                    style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  data-onboarding="reset-button"
                  className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest border border-[#2A2A2A] px-4 py-2 text-[#888780] hover:border-[#D1E231] hover:text-[#D1E231] transition-colors"
                  style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
                >
                  Reset
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="pt-6">
            <p className="font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-widest uppercase">
              LOADING...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
