'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getWarmupForDay } from '@/lib/warmupStorage';

const ORANGE = '#FF8C42';

export default function WarmUpPage({ params }) {
  const { day } = use(params);
  const dayNum = parseInt(day, 10);
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [mounted, setMounted] = useState(false);

  const storageKey = `wkout-warmup-done-${dayNum}`;

  useEffect(() => {
    const warmup = getWarmupForDay(dayNum);
    setItems(warmup.items || []);
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setCompleted(saved);
    } catch {
      setCompleted([]);
    }
    setMounted(true);
  }, [dayNum, storageKey]);

  function toggle(index) {
    setCompleted(prev => {
      const next = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function handleSkip() {
    router.push(`/day/${dayNum}`);
  }

  const allDone = items.length > 0 && completed.length === items.length;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="mx-auto w-full max-w-[480px] px-6">

        {/* Nav — orange accent */}
        <div className="flex items-center justify-between py-5 px-6 -mx-6" style={{ background: ORANGE }}>
          <span
            className="font-[family-name:var(--font-display)] font-bold uppercase tracking-wider text-[#0F0F0F]"
            style={{ fontSize: 'clamp(1.125rem, 5vw, 1.25rem)' }}
          >
            WARM-UP
          </span>
          <div className="flex items-center gap-3">
            <Link
              href={`/edit/warmup/${dayNum}`}
              className="font-[family-name:var(--font-body)] text-[#0F0F0F] tracking-widest uppercase hover:opacity-60 transition-opacity"
              style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
            >
              EDIT
            </Link>
            <Link
              href={`/day/${dayNum}`}
              className="font-[family-name:var(--font-body)] text-[#0F0F0F] tracking-widest uppercase hover:opacity-60 transition-opacity border border-[#0F0F0F] px-3 py-1.5"
              style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
            >
              ← BACK
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="pt-6 pb-4 border-b border-[#2A2A2A]">
          <p
            className="font-[family-name:var(--font-body)] uppercase tracking-widest mb-1"
            style={{ color: ORANGE, fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
          >
            DAY {dayNum} — PRE-WORKOUT
          </p>
          <h1
            className="font-[family-name:var(--font-display)] font-bold uppercase text-[#F0EDE6] leading-none"
            style={{ fontSize: 'clamp(2.5rem, 12vw, 3.5rem)' }}
          >
            GET READY
          </h1>
          <p
            className="font-[family-name:var(--font-body)] text-[#888780] mt-2 uppercase tracking-widest"
            style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
          >
            {completed.length} / {items.length} DONE
          </p>
        </div>

        {/* Items */}
        <div className="mt-4">
          {items.map((item, i) => {
            const done = completed.includes(i);
            return (
              <div
                key={i}
                className="flex items-start gap-4 py-4 border-b border-[#2A2A2A]"
              >
                {/* Number circle — tappable */}
                <button
                  onClick={() => toggle(i)}
                  className="cursor-pointer flex-shrink-0 flex items-center justify-center border transition-all"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    borderColor: done ? ORANGE : '#2A2A2A',
                    background: done ? ORANGE : 'transparent',
                    color: done ? '#0F0F0F' : '#888780',
                    fontSize: 'clamp(0.75rem, 3vw, 0.8125rem)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: done ? 700 : 400,
                    marginTop: 2,
                  }}
                >
                  {done ? '✓' : i + 1}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className="font-[family-name:var(--font-body)] text-[#F0EDE6] leading-tight"
                      style={{
                        fontSize: 'clamp(0.9375rem, 3.8vw, 1rem)',
                        textDecoration: done ? 'line-through' : 'none',
                        color: done ? '#888780' : '#F0EDE6',
                        transition: 'color 0.2s',
                      }}
                    >
                      {item.name}
                    </p>
                    {/* Duration pill */}
                    <span
                      className="font-[family-name:var(--font-body)] uppercase tracking-widest border flex-shrink-0 px-2 py-0.5"
                      style={{
                        fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)',
                        color: done ? '#888780' : ORANGE,
                        borderColor: done ? '#2A2A2A' : ORANGE,
                        transition: 'color 0.2s, border-color 0.2s',
                      }}
                    >
                      {item.duration}
                    </span>
                  </div>

                  {/* Type tag */}
                  <span
                    className="font-[family-name:var(--font-body)] uppercase tracking-widest mt-1 inline-block"
                    style={{
                      fontSize: 'clamp(0.55rem, 2.2vw, 0.65rem)',
                      color: item.type === 'cardio' ? '#FF8C42' : '#888780',
                      opacity: done ? 0.4 : 1,
                    }}
                  >
                    {item.type}
                  </span>

                  {/* Description */}
                  {item.description && (
                    <p
                      className="font-[family-name:var(--font-body)] text-[#888780] mt-1 leading-snug"
                      style={{
                        fontSize: 'clamp(0.75rem, 3vw, 0.8125rem)',
                        opacity: done ? 0.4 : 1,
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* All done banner */}
        {allDone && (
          <div className="py-8 border-b border-[#2A2A2A]">
            <h2
              className="font-[family-name:var(--font-display)] font-bold uppercase leading-none"
              style={{ fontSize: 'clamp(2rem, 10vw, 3rem)', color: ORANGE }}
            >
              Warmed<br />Up!
            </h2>
            <p
              className="font-[family-name:var(--font-body)] text-[#888780] mt-2 uppercase tracking-widest"
              style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
            >
              Time to train.
            </p>
          </div>
        )}

        {/* Skip / Back to workout */}
        <div className="flex items-center justify-center py-8">
          <Link
            href={`/day/${dayNum}`}
            className="cursor-pointer font-[family-name:var(--font-body)] text-[#888780] uppercase tracking-widest border border-[#2A2A2A] px-4 py-2 transition-colors hover:border-[#888780] hover:text-[#F0EDE6]"
            style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
          >
            {allDone ? '← BACK TO WORKOUT' : 'SKIP WARM-UP'}
          </Link>
        </div>

      </div>
    </div>
  );
}
