'use client';

import { useState, useEffect } from 'react';
import ExerciseCard from './ExerciseCard';

export default function WorkoutTracker({ exercises, dayNumber }) {
  const storageKey = `wkout-day-${dayNumber}`;
  const [completed, setCompleted] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setCompleted(saved);
    } catch {
      setCompleted([]);
    }
    setMounted(true);
  }, [storageKey]);

  function toggle(index) {
    setCompleted(prev => {
      const next = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  const total = exercises.length;
  const doneCount = completed.length;
  const allDone = doneCount === total && total > 0;
  const progress = total > 0 ? (doneCount / total) * 100 : 0;

  const nextIndex = exercises.findIndex((_, i) => !completed.includes(i));

  if (!mounted) {
    return (
      <div>
        {exercises.map((exercise, i) => (
          <ExerciseCard
            key={i}
            name={exercise.name}
            sets={exercise.sets}
            reps={exercise.reps}
            type={exercise.type}
            isComplete={false}
            isNext={false}
            onComplete={() => {}}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-[family-name:var(--font-body)] text-[#888780] text-xs uppercase tracking-widest">
            Progress
          </span>
          <span className="font-[family-name:var(--font-body)] text-xs tracking-widest"
            style={{ color: allDone ? '#D1E231' : '#888780' }}>
            {doneCount} / {total}
          </span>
        </div>
        <div className="h-0.5 w-full bg-[#2A2A2A]">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, background: '#D1E231' }}
          />
        </div>
      </div>

      {/* Exercise list */}
      {exercises.map((exercise, i) => (
        <ExerciseCard
          key={i}
          name={exercise.name}
          sets={exercise.sets}
          reps={exercise.reps}
          type={exercise.type}
          isComplete={completed.includes(i)}
          isNext={i === nextIndex}
          onComplete={() => toggle(i)}
        />
      ))}

      {/* Session complete */}
      {allDone && (
        <div className="py-10 border-t border-[#2A2A2A] mt-2">
          <h2
            className="font-[family-name:var(--font-display)] font-bold uppercase leading-none"
            style={{ fontSize: 'clamp(2.5rem, 12vw, 4rem)', color: '#D1E231' }}
          >
            Session<br />Complete!
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[#888780] text-sm mt-3 uppercase tracking-widest">
            Well done. Rest up.
          </p>
          <button
            onClick={() => {
              setCompleted([]);
              try { localStorage.removeItem(storageKey); } catch {}
            }}
            className="mt-6 font-[family-name:var(--font-body)] text-xs uppercase tracking-widest text-[#888780] border border-[#2A2A2A] px-4 py-2 hover:border-[#D1E231] hover:text-[#D1E231] transition-colors"
          >
            Reset Session
          </button>
        </div>
      )}
    </div>
  );
}
