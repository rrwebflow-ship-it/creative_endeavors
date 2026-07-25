'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getPlan, updateExercises } from '@/lib/storage';
import EditExerciseForm from '@/components/EditExerciseForm';

export default function EditDayPage({ params }) {
  const { day } = use(params);
  const dayNumber = parseInt(day, 10);
  const [exercises, setExercises] = useState([]);
  const [dayName, setDayName] = useState('');
  const [mounted, setMounted] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    const plan = getPlan();
    const day = plan.find(d => d.day === dayNumber);
    if (day) {
      setExercises(day.exercises);
      setDayName(day.name);
    }
    setMounted(true);
  }, [dayNumber]);

  function save(next) {
    setExercises(next);
    updateExercises(dayNumber, next);
  }

  function handleSaveExercise(index, data) {
    const next = exercises.map((e, i) => i === index ? data : e);
    save(next);
    setEditingIndex(null);
  }

  function handleAddExercise(data) {
    const next = [...exercises, data];
    save(next);
    setAddingNew(false);
  }

  function handleDelete(index) {
    const next = exercises.filter((_, i) => i !== index);
    save(next);
  }

  function moveUp(index) {
    if (index === 0) return;
    const next = [...exercises];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    save(next);
  }

  function moveDown(index) {
    if (index === exercises.length - 1) return;
    const next = [...exercises];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    save(next);
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="mx-auto w-full max-w-[480px] px-6">

        {/* Nav */}
        <div className="flex items-center justify-between py-5 px-6 -mx-6 bg-[#D1E231]">
          <span className="font-[family-name:var(--font-display)] font-bold uppercase text-[#0F0F0F] tracking-wider" style={{ fontSize: 'clamp(1.125rem, 5vw, 1.25rem)' }}>
            {dayName}
          </span>
          <Link
            href={`/day/${dayNumber}`}
            className="font-[family-name:var(--font-body)] text-[#0F0F0F] tracking-widest uppercase hover:opacity-60 transition-opacity"
            style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
          >
            ← BACK
          </Link>
        </div>

        <div className="mt-4">
          {exercises.map((exercise, i) => (
            <div key={i}>
              {editingIndex === i ? (
                <EditExerciseForm
                  exercise={exercise}
                  onSave={data => handleSaveExercise(i, data)}
                  onCancel={() => setEditingIndex(null)}
                />
              ) : (
                <div className="py-4 px-6 -mx-6 border-b border-[#2A2A2A] flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-[family-name:var(--font-body)] text-[#F0EDE6]" style={{ fontSize: '1rem' }}>
                      {exercise.name}
                    </p>
                    <p className="font-[family-name:var(--font-body)] text-[#888780] uppercase mt-0.5" style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>
                      {exercise.sets} × {exercise.reps} · {exercise.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveUp(i)} disabled={i === 0}
                        className="cursor-pointer text-[#444440] hover:text-[#D1E231] disabled:opacity-20 transition-colors leading-none"
                        style={{ fontSize: 10 }}>▲</button>
                      <button onClick={() => moveDown(i)} disabled={i === exercises.length - 1}
                        className="cursor-pointer text-[#444440] hover:text-[#D1E231] disabled:opacity-20 transition-colors leading-none"
                        style={{ fontSize: 10 }}>▼</button>
                    </div>
                    <button
                      onClick={() => setEditingIndex(i)}
                      className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest border border-[#2A2A2A] px-2 py-1 text-[#888780] hover:border-[#D1E231] hover:text-[#D1E231] transition-colors"
                      style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest border border-[#2A2A2A] px-2 py-1 text-[#888780] hover:border-red-500 hover:text-red-500 transition-colors"
                      style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add new exercise */}
          {addingNew ? (
            <EditExerciseForm
              onSave={handleAddExercise}
              onCancel={() => setAddingNew(false)}
            />
          ) : (
            <div className="flex justify-center py-6">
              <button
                onClick={() => setAddingNew(true)}
                className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest border border-[#2A2A2A] px-4 py-2 text-[#D1E231] hover:border-[#D1E231] transition-colors"
                style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
              >
                + Add Exercise
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
