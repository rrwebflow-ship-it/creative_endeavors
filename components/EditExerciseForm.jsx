'use client';

import { useState } from 'react';

export default function EditExerciseForm({ exercise, onSave, onCancel }) {
  const [name, setName] = useState(exercise?.name || '');
  const [sets, setSets] = useState(exercise?.sets || 3);
  const [reps, setReps] = useState(exercise?.reps || 10);
  const [type, setType] = useState(exercise?.type || 'compound');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), sets: Number(sets), reps, type });
  }

  const inputClass = "w-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#F0EDE6] px-3 py-2 font-[family-name:var(--font-body)] focus:outline-none focus:border-[#D1E231] transition-colors";
  const labelClass = "font-[family-name:var(--font-body)] text-[#888780] uppercase tracking-widest mb-1 block" ;

  return (
    <form onSubmit={handleSubmit} className="py-4 border-b border-[#2A2A2A]">
      <div className="mb-3">
        <label className={labelClass} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>Exercise Name</label>
        <input
          className={inputClass}
          style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Barbell squat"
          autoFocus
        />
      </div>
      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <label className={labelClass} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>Sets</label>
          <input
            className={inputClass}
            style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
            type="number"
            min={1} max={20}
            value={sets}
            onChange={e => setSets(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className={labelClass} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>Reps / Duration</label>
          <input
            className={inputClass}
            style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
            value={reps}
            onChange={e => setReps(e.target.value)}
            placeholder="e.g. 10 or 45 sec"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className={labelClass} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>Type</label>
        <div className="flex gap-2">
          {['compound', 'isolation'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className="font-[family-name:var(--font-body)] uppercase tracking-widest px-4 py-2 border transition-colors"
              style={{
                fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)',
                borderColor: type === t ? '#D1E231' : '#2A2A2A',
                color: type === t ? '#D1E231' : '#888780',
                background: type === t ? '#1A1A0F' : '#1A1A1A',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="font-[family-name:var(--font-body)] uppercase tracking-widest px-4 py-2 bg-[#D1E231] text-[#0F0F0F] font-bold transition-opacity hover:opacity-80"
          style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-[family-name:var(--font-body)] uppercase tracking-widest px-4 py-2 border border-[#2A2A2A] text-[#888780] hover:border-[#D1E231] hover:text-[#D1E231] transition-colors"
          style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
