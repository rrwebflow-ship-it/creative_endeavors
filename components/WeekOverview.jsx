'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { workouts } from '@/lib/workouts';
import { getCycleDay } from '@/lib/getWorkout';

export default function WeekOverview() {
  const [mounted, setMounted] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    setCurrentDay(getCycleDay());
    setMounted(true);
  }, []);

  const daysRemaining = 7 - currentDay;

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="mx-auto w-full max-w-[480px] px-6">
        <div className="flex items-center justify-between py-5 border-b border-[#2A2A2A]">
          <span className="font-[family-name:var(--font-display)] text-xl font-bold uppercase text-[#F0EDE6] tracking-wider">
            FULL WEEK
          </span>
          <Link
            href="/"
            className="font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-widest uppercase hover:text-[#F0EDE6] transition-colors"
          >
            ← TODAY
          </Link>
        </div>

        {mounted ? (
          <>
            <div className="mt-2">
              {workouts.map((workout) => {
                const isDone = workout.day < currentDay;
                const isActive = workout.day === currentDay;
                const isRest = workout.exercises.length === 0;

                return (
                  <Link
                    key={workout.day}
                    href={`/day/${workout.day}`}
                    className={`flex items-center justify-between py-4 border-b border-[#2A2A2A] transition-colors hover:bg-[#1A1A1A]${isActive ? ' bg-[#1A1A18]' : ''}${isRest ? ' opacity-50' : ''}`}
                    style={isActive ? { borderLeft: '3px solid #C8FF00', paddingLeft: '16px', marginLeft: '-16px' } : {}}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`flex items-center justify-center text-xs font-[family-name:var(--font-body)] flex-shrink-0${
                          isDone ? ' bg-[#2A5C3A] text-[#4CAF72]' :
                          isActive ? ' bg-[#C8FF00] text-[#0F0F0F] font-bold' :
                          ' border border-[#2A2A2A] text-[#888780]'
                        }`}
                        style={{ width: 28, height: 28, borderRadius: '50%' }}
                      >
                        {isDone ? '✓' : workout.day}
                      </div>
                      <div className="min-w-0">
                        <p className="font-[family-name:var(--font-display)] text-lg font-bold uppercase text-[#F0EDE6] leading-tight">
                          {workout.name}
                        </p>
                        <p className="font-[family-name:var(--font-body)] text-[#888780] text-xs mt-0.5">
                          {workout.focus}
                        </p>
                      </div>
                    </div>
                    {workout.exercises.length > 0 && (
                      <div className="flex-shrink-0 ml-4 bg-[#252520] border border-[#2A2A2A] px-3 py-1 font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-wider uppercase whitespace-nowrap">
                        {workout.exercises.length} EX
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="py-8">
              <p className="font-[family-name:var(--font-body)] text-[#888780] text-xs tracking-widest uppercase">
                {daysRemaining} DAYS REMAINING IN CYCLE
              </p>
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
