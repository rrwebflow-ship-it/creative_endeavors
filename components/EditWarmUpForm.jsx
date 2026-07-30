'use client';

import { useState } from 'react';

const ORANGE = '#FF8C42';

export default function EditWarmUpForm({ item, onSave, onCancel }) {
  const [name, setName] = useState(item?.name || '');
  const [duration, setDuration] = useState(item?.duration || '');
  const [type, setType] = useState(item?.type || 'stretch');
  const [description, setDescription] = useState(item?.description || '');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), duration: duration.trim(), type, description: description.trim() });
  }

  const inputClass = "w-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#F0EDE6] px-3 py-2 font-[family-name:var(--font-body)] focus:outline-none transition-colors";
  const labelClass = "font-[family-name:var(--font-body)] text-[#888780] uppercase tracking-widest mb-1 block";

  return (
    <form onSubmit={handleSubmit} className="py-4 border-b border-[#2A2A2A]">
      <div className="mb-3">
        <label className={labelClass} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>Name</label>
        <input
          className={inputClass}
          style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Hip flexor stretch"
          autoFocus
        />
      </div>
      <div className="mb-3">
        <label className={labelClass} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>Duration</label>
        <input
          className={inputClass}
          style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
          value={duration}
          onChange={e => setDuration(e.target.value)}
          placeholder="e.g. 30s each side, 1 min, 2 min"
        />
      </div>
      <div className="mb-3">
        <label className={labelClass} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>Type</label>
        <div className="flex gap-2">
          {['stretch', 'cardio'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest px-4 py-2 border transition-colors"
              style={{
                fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)',
                background: type === t ? ORANGE : 'transparent',
                color: type === t ? '#0F0F0F' : '#888780',
                borderColor: type === t ? ORANGE : '#2A2A2A',
                fontWeight: type === t ? 700 : 400,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <label className={labelClass} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>Description (optional)</label>
        <input
          className={inputClass}
          style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="e.g. Keep torso upright, breathe steadily"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest px-4 py-2 font-bold transition-opacity hover:opacity-80"
          style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)', background: ORANGE, color: '#0F0F0F' }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest px-4 py-2 border border-[#2A2A2A] text-[#888780] hover:border-[#888780] transition-colors"
          style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
