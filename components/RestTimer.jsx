'use client';

import { useState, useEffect, useRef } from 'react';

const INTERVALS = [
  { label: '45s', seconds: 45 },
  { label: '1 min', seconds: 60 },
  { label: '2 min', seconds: 120 },
];

export default function RestTimer() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function startTimer(seconds) {
    clearInterval(intervalRef.current);
    setSelected(seconds);
    setRemaining(seconds);
    setRunning(true);
    setOpen(false);
  }

  function reset() {
    clearInterval(intervalRef.current);
    setRunning(false);
    setSelected(null);
    setRemaining(0);
    setOpen(false);
  }

  const progress = selected ? (remaining / selected) * 100 : 0;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const display = mins > 0
    ? `${mins}:${String(secs).padStart(2, '0')}`
    : `${remaining}s`;

  const done = selected && remaining === 0 && !running;

  return (
    <div className="mt-2">
      {!running && !done && !open && (
        <button
          onClick={() => setOpen(true)}
          className="font-[family-name:var(--font-body)] text-[#D1E231] text-xs uppercase tracking-widest hover:text-[#F0EDE6] transition-colors"
        >
          + Rest
        </button>
      )}

      {open && (
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="font-[family-name:var(--font-body)] text-[#D1E231] text-xs uppercase tracking-widest">
            Rest:
          </span>
          {INTERVALS.map(({ label, seconds }) => (
            <button
              key={seconds}
              onClick={() => startTimer(seconds)}
              className="font-[family-name:var(--font-body)] text-xs uppercase tracking-widest border border-[#D1E231] px-3 py-1 text-[#D1E231] hover:bg-[#D1E231] hover:text-[#0F0F0F] transition-colors bg-[#1A1A1A]"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setOpen(false)}
            className="font-[family-name:var(--font-body)] text-[#888780] text-xs hover:text-[#F0EDE6] transition-colors px-1"
          >
            ✕
          </button>
        </div>
      )}

      {running && (
        <div className="mt-2">
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-display)] text-[#F0EDE6] text-lg font-bold tracking-widest">
              {display}
            </span>
            <button
              onClick={reset}
              className="font-[family-name:var(--font-body)] text-[#D1E231] text-xs uppercase tracking-widest hover:text-[#F0EDE6] transition-colors"
            >
              Cancel
            </button>
          </div>
          <div className="mt-1.5 h-0.5 w-full bg-[#2A2A2A]">
            <div
              className="h-full bg-[#D1E231] transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {done && (
        <div className="flex items-center gap-3 mt-1">
          <span className="font-[family-name:var(--font-body)] text-xs uppercase tracking-widest text-[#F0EDE6]">
            Rest done
          </span>
          <button
            onClick={reset}
            className="font-[family-name:var(--font-body)] text-[#D1E231] text-xs uppercase tracking-widest hover:text-[#F0EDE6] transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
