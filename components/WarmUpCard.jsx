'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const ORANGE = '#FF8C42';

export default function WarmUpCard({ dayNum, itemCount }) {
  if (itemCount === 0) return null;

  const storageKey = `wkout-warmup-checked-${dayNum}`;
  const [checked, setChecked] = useState(false);
  const [showAnim, setShowAnim] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    try {
      const isChecked = localStorage.getItem(storageKey) === 'true';
      setChecked(isChecked);
      if (!isChecked && !hasAnimated.current) {
        hasAnimated.current = true;
        setShowAnim(true);
      }
    } catch {}
  }, [storageKey]);

  function toggle() {
    const next = !checked;
    setChecked(next);
    try { localStorage.setItem(storageKey, String(next)); } catch {}
  }

  return (
    <div
      className="pt-1.5 pb-4 px-6 -mx-6 border-b border-[#2A2A2A] transition-all duration-300"
      style={{ opacity: checked ? 0.35 : 1 }}
    >
      <div className="flex items-start justify-between gap-3">

        {/* Circle — same size and alignment as exercise completion circle */}
        <div className="flex-shrink-0 flex items-center self-start" style={{ height: '1.5rem' }}>
          <button
            onClick={toggle}
            aria-label={checked ? 'Mark warm-up incomplete' : 'Mark warm-up complete'}
            className={`cursor-pointer flex items-center justify-center transition-all duration-200 w-[15px] h-[15px]${showAnim ? ' animate-warm-up-pulse-circle' : ''}`}
            style={{
              marginTop: 'clamp(3px, calc(1.43vw - 2.14px), 7px)',
              borderRadius: '50%',
              border: checked ? 'none' : `2px solid ${ORANGE}`,
              background: checked ? ORANGE : 'transparent',
              color: '#0F0F0F',
              fontSize: 7,
              fontWeight: 'bold',
            }}
          >
            {checked ? '✓' : ''}
          </button>
        </div>

        {/* Text — aligned with exercise label */}
        <div className="min-w-0 flex-1">
          <p
            className={`font-[family-name:var(--font-display)] font-bold uppercase tracking-wider transition-colors duration-300${showAnim ? ' animate-warm-up-pulse-text' : ''}`}
            style={{
              fontSize: 'clamp(1rem, 4.5vw, 1.2rem)',
              color: checked ? '#888780' : ORANGE,
              textDecoration: checked ? 'line-through' : 'none',
            }}
          >
            Warm-Up
          </p>
          <p
            className="font-[family-name:var(--font-body)] text-[#888780] uppercase mt-0.5"
            style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
          >
            {itemCount} items · skippable
          </p>
        </div>

        {/* SEE ROUTINE — unchanged */}
        <Link
          href={`/warmup/${dayNum}`}
          className={`cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest border px-3 py-1.5 transition-colors flex-shrink-0${showAnim ? ' animate-warm-up-pulse-button' : ''}`}
          style={{
            color: ORANGE,
            borderColor: ORANGE,
            fontSize: 'clamp(0.72rem, 3vw, 0.84rem)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = ORANGE;
            e.currentTarget.style.color = '#0F0F0F';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = ORANGE;
          }}
        >
          SEE ROUTINE →
        </Link>

      </div>
    </div>
  );
}
