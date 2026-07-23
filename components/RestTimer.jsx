'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const INTERVALS = [
  { label: '45s', seconds: 45 },
  { label: '1 min', seconds: 60 },
  { label: '2 min', seconds: 120 },
];

const ACCENT = '#D1E231';
const RING_R = 44;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

function TimerScreen({ remaining, selected, onCancel, done }) {
  const progress = selected > 0 ? remaining / selected : 0;
  const strokeOffset = CIRCUMFERENCE * (1 - progress);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const display = mins > 0
    ? `${mins}:${String(secs).padStart(2, '0')}`
    : `${remaining}`;
  const unit = mins > 0 ? '' : 's';

  return createPortal(
    <div
      style={{
        // Contained within the app's 480px viewport — not full browser width
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        zIndex: 9999,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
          // Container is fully transparent — app is the background
        background: 'transparent',
      }}
    >
      {/* MIDDLE LAYER: dark radial gradient — 100% opacity at center, fades to 0% at edges */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 70% 65% at 50% 50%,
          rgba(15,15,15,1.00) 0%,
          rgba(15,15,15,1.00) 15%,
          rgba(15,15,15,1.00) 35%,
          rgba(15,15,15,0.70) 55%,
          rgba(15,15,15,0.35) 75%,
          rgba(15,15,15,0.20) 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Yellow glow — sits between dark layer and clock */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 40% 35% at 50% 50%,
          rgba(209,226,49,0.08) 0%,
          rgba(209,226,49,0.02) 50%,
          transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* TOP LAYER: Clock — always above the gradient */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* SVG ring */}
        <svg
          viewBox="0 0 100 100"
          width={260}
          height={260}
          style={{ display: 'block' }}
        >
          {/* Track */}
          <circle
            cx="50" cy="50" r={RING_R}
            fill="none"
            stroke="#1E1E1E"
            strokeWidth="1.5"
          />
          {/* Progress arc */}
          <circle
            cx="50" cy="50" r={RING_R}
            fill="none"
            stroke={done ? '#888780' : ACCENT}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeOffset}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
          />
          {/* Tick marks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i / 60) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const isMajor = i % 5 === 0;
            const inner = isMajor ? 38 : 40.5;
            const outer = 43;
            const x1 = 50 + inner * Math.cos(rad);
            const y1 = 50 + inner * Math.sin(rad);
            const x2 = 50 + outer * Math.cos(rad);
            const y2 = 50 + outer * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={ACCENT}
                strokeWidth={isMajor ? 0.8 : 0.4}
                opacity={0.25}
              />
            );
          })}
        </svg>

        {/* Time display — centered over ring */}
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {done ? (
            <span style={{
              fontFamily: 'var(--font-display), system-ui, sans-serif',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: ACCENT,
            }}>
              Done
            </span>
          ) : (
            <>
              <span style={{
                fontFamily: 'var(--font-display), system-ui, sans-serif',
                fontWeight: 900,
                fontSize: '3.2rem',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: ACCENT,
                fontVariantNumeric: 'tabular-nums',
                textShadow: `0 0 40px rgba(209,226,49,0.35), 0 0 80px rgba(209,226,49,0.15)`,
              }}>
                {display}
                <span style={{ fontSize: '1.4rem', marginLeft: 2 }}>{unit}</span>
              </span>
              <span style={{
                fontFamily: 'var(--font-body), monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: ACCENT,
                opacity: 0.6,
                marginTop: 6,
              }}>
                REST
              </span>
            </>
          )}
        </div>
      </div>

      {/* Cancel button — top layer */}
      <button
        onClick={onCancel}
        style={{
          position: 'absolute',
          zIndex: 2,
          bottom: 56,
          fontFamily: 'var(--font-body), monospace',
          fontWeight: 700,
          fontSize: '0.8rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '12px 32px',
        }}
      >
        CANCEL
      </button>
    </div>,
    document.body
  );
}

export default function RestTimer() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
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

  const done = selected && remaining === 0 && !running;
  const showScreen = running || done;

  return (
    <div className="mt-2">
      {/* Trigger */}
      {!running && !done && !open && (
        <button
          onClick={() => setOpen(true)}
          className="font-[family-name:var(--font-body)] text-[#D1E231] uppercase tracking-widest hover:text-[#F0EDE6] transition-colors"
          style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
        >
          + Rest
        </button>
      )}

      {/* Interval picker */}
      {open && (
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="font-[family-name:var(--font-body)] text-[#D1E231] uppercase tracking-widest" style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>
            Rest:
          </span>
          {INTERVALS.map(({ label, seconds }) => (
            <button
              key={seconds}
              onClick={() => startTimer(seconds)}
              className="font-[family-name:var(--font-body)] uppercase tracking-widest border border-[#D1E231] px-3 py-1 text-[#D1E231] hover:bg-[#D1E231] hover:text-[#0F0F0F] transition-colors bg-[#1A1A1A]"
              style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
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

      {/* Full screen timer */}
      {mounted && showScreen && (
        <TimerScreen
          remaining={remaining}
          selected={selected}
          onCancel={reset}
          done={done}
        />
      )}
    </div>
  );
}
