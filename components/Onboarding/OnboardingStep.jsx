'use client';

import { useRef, useLayoutEffect, useState } from 'react';

const LIME         = '#C8FF00';
const SURFACE      = '#1A1A1A';
const BORDER       = '#2A2A2A';
const TEXT         = '#F0EDE6';
const MUTED        = '#888780';
const OVERLAY      = 'rgba(15,15,15,0.98)';
const ARROW_STROKE = 3;   // visual weight matching bold display heading
const HEAD_SIZE    = 12;  // arrowhead arm length

const headingStyle = {
  fontFamily: 'var(--font-display)',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: TEXT,
  fontSize: 'clamp(1.25rem, 5.5vw, 1.75rem)',
  lineHeight: 1.1,
  marginBottom: 10,
  whiteSpace: 'pre-line',
  textAlign: 'center',
};

const bodyStyle = {
  fontFamily: 'var(--font-body)',
  color: MUTED,
  fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)',
  lineHeight: 1.6,
  textAlign: 'center',
};

const btnBase = {
  flex: 1,
  fontFamily: 'var(--font-body)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)',
  padding: '10px 0',
  cursor: 'pointer',
  border: 'none',
};

// ── Shared bottom bar: progress pills + nav buttons + skip ───────────────────
function BottomBar({ stepIndex, totalSteps, onNext, onBack, onSkip, showNav }) {
  const isFirst = stepIndex === 0;
  const isLast  = stepIndex === totalSteps - 1;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      zIndex: 99004,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      paddingBottom: 28,
      paddingTop: 16,
      background: 'linear-gradient(to top, rgba(15,15,15,1) 60%, transparent)',
    }}>
      {showNav && (
        <div style={{
          display: 'flex', gap: 8,
          width: '100%', maxWidth: 480,
          padding: '0 40px', boxSizing: 'border-box',
        }}>
          {!isFirst && (
            <button onClick={onBack} style={{ ...btnBase, background: 'transparent', border: `1px solid ${BORDER}`, color: MUTED }}>
              BACK
            </button>
          )}
          <button onClick={onNext} style={{ ...btnBase, background: LIME, color: '#0F0F0F', fontWeight: 'bold' }}>
            {isLast ? 'DONE' : 'NEXT'}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{
            height: 6,
            width: i === stepIndex ? 20 : 6,
            borderRadius: 3,
            background: i === stepIndex ? LIME : SURFACE,
            border: `1px solid ${i === stepIndex ? LIME : BORDER}`,
            transition: 'all 0.25s ease',
          }} />
        ))}
      </div>

      <button onClick={onSkip} style={{
        fontFamily: 'var(--font-body)',
        color: MUTED,
        background: 'transparent',
        border: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)',
        cursor: 'pointer',
        padding: '4px 0',
      }}>
        SKIP WALKTHROUGH
      </button>
    </div>
  );
}

// ── Step 1 only: centred card — DO NOT CHANGE ────────────────────────────────
function WelcomeCard({ stepConfig, stepIndex, totalSteps, onNext, onSkip }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: OVERLAY, zIndex: 99001, pointerEvents: 'none' }} />

      <div style={{
        position: 'fixed', left: 0, right: 0, top: 0, bottom: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: isMobile ? '0 40px 110px' : '0 56px 110px',
        zIndex: 99002,
        pointerEvents: 'none',
      }}>
        <div style={{
          width: '100%', maxWidth: 480,
          background: SURFACE, border: `1px solid ${BORDER}`,
          padding: 24, pointerEvents: 'auto',
        }}>
          <h2 style={headingStyle}>{stepConfig.title}</h2>
          <p style={bodyStyle}>{stepConfig.body}</p>
          <div style={{ display: 'flex', marginTop: 20 }}>
            <button onClick={onNext} style={{ ...btnBase, background: LIME, color: '#0F0F0F', fontWeight: 'bold' }}>
              NEXT
            </button>
          </div>
        </div>
      </div>

      <BottomBar stepIndex={stepIndex} totalSteps={totalSteps} onSkip={onSkip} showNav={false} />
    </>
  );
}

// ── Steps 2-5: spotlight + floating text + bold SVG arrow ────────────────────
function SpotlightAnnotation({ rect, stepConfig, stepIndex, totalSteps, onNext, onBack, onSkip }) {
  const textRef  = useRef(null);
  const [arrow, setArrow] = useState(null);

  const winW = typeof window !== 'undefined' ? window.innerWidth  : 390;
  const winH = typeof window !== 'undefined' ? window.innerHeight : 844;

  const HEADER_H = 60;   // lime bar at top of every page
  const BAR_H    = 118;  // bottom progress/nav bar

  // When the element fills most of the screen (e.g. the full week-grid),
  // a spotlight cutout makes no sense — skip it and use full-screen dim instead.
  // The arrow then points to the TOP of the element (first visible row/item).
  const isTooLarge = rect ? rect.height > winH * 0.38 : false;

  // For oversized elements: always put text at the BOTTOM so the arrow
  // points upward toward the element's first row — clearest reading.
  // For normal elements: put text where there is more empty space.
  const spaceAbove = rect ? rect.top - HEADER_H - 8    : 0;
  const spaceBelow = rect ? winH - rect.bottom - BAR_H - 8 : winH * 0.5;
  const textAbove  = isTooLarge ? false : spaceAbove > spaceBelow;

  // Steps that use the gradient overlay approach (no spotlight, no arrow).
  // Full Week screen fades from 190px; home screen fades from 120px (higher up).
  const isWeekGridStep    = stepConfig.selector === '[data-onboarding="week-grid"]';
  const isHomeGradientStep = (
    stepConfig.selector === '[data-onboarding="day-hero"]' ||
    stepConfig.selector === '[data-onboarding="warmup-card"]'
  );
  const isGradientStep = isWeekGridStep || isHomeGradientStep;

  // Compute arrow after text block renders so we know its exact position
  useLayoutEffect(() => {
    // Gradient steps have no arrow
    if (isGradientStep || !rect || !textRef.current) { setArrow(null); return; }

    const tb  = textRef.current.getBoundingClientRect();
    const sCX = rect.left + rect.width  / 2;
    const tCX = tb.left   + tb.width    / 2;

    let x1, y1, x2, y2;
    if (isTooLarge) {
      // Text is at bottom, arrow goes UP to the top region of the large element
      x1 = tCX;  y1 = tb.top - 14;
      x2 = sCX;  y2 = rect.top + 36;
    } else if (textAbove) {
      // Text is ABOVE the spotlight → arrow curves downward
      x1 = tCX;  y1 = tb.bottom + 14;
      x2 = sCX;  y2 = rect.top  - 14;
    } else {
      // Text is BELOW the spotlight → arrow curves upward
      x1 = tCX;  y1 = tb.top    - 14;
      x2 = sCX;  y2 = rect.bottom + 14;
    }

    const dy    = y2 - y1;
    const curve = `M ${x1} ${y1} C ${x1} ${y1 + dy * 0.45} ${x2} ${y2 - dy * 0.45} ${x2} ${y2}`;

    // Open-V arrowhead at the element end — same stroke weight as the body line
    const H    = HEAD_SIZE;
    const down = y2 > y1;
    const head = down
      ? `M ${x2 - H} ${y2 - H * 1.1} L ${x2} ${y2} L ${x2 + H} ${y2 - H * 1.1}`
      : `M ${x2 - H} ${y2 + H * 1.1} L ${x2} ${y2} L ${x2 + H} ${y2 + H * 1.1}`;

    setArrow({ curve, head });
  }, [rect, textAbove, isTooLarge]);

  // Position text a fixed TARGET_ARROW distance from the spotlight element so
  // the arrow is always roughly the same length regardless of where the element
  // sits on screen. Clamped so text never overlaps the lime header or bottom bar.
  const TARGET_ARROW = 150;  // desired rendered arrow length in px
  const ARROW_PAD    = 14;   // gap between text edge and arrow tip
  const EST_TEXT_H   = 130;  // rough text block height (heading + body)

  let textTopPx;
  if (isTooLarge || isGradientStep || !rect) {
    // Large element or not yet measured: anchor text to bottom of dim area
    textTopPx = winH - BAR_H - EST_TEXT_H - 16;
  } else if (textAbove) {
    // Text above spotlight — step back TARGET_ARROW from element top
    const ideal = rect.top - ARROW_PAD - TARGET_ARROW - ARROW_PAD - EST_TEXT_H;
    textTopPx = Math.max(HEADER_H + 16, ideal);
  } else {
    // Text below spotlight — step forward TARGET_ARROW from element bottom
    const ideal  = rect.bottom + ARROW_PAD + TARGET_ARROW + ARROW_PAD;
    const maxTop = winH - BAR_H - EST_TEXT_H - 16;
    textTopPx = Math.min(ideal, maxTop);
  }

  const textPos = { top: textTopPx };

  const pad = 8;

  // Pulsing orange glow for the warm-up card step — matches WarmUpCard's accent colour
  const isWarmupStep = stepConfig.selector === '[data-onboarding="warmup-card"]';
  const ORANGE = '#FF8C42';

  return (
    <>
      {/* Keyframe injected only for the warm-up step */}
      {isWarmupStep && (
        <style>{`
          @keyframes wkout-warmup-glow {
            0%, 100% {
              box-shadow:
                0 0 0 9999px rgba(15,15,15,0.98),
                0 0 0 2px rgba(255,140,66,0.55),
                0 0 18px 5px rgba(255,140,66,0.22);
            }
            50% {
              box-shadow:
                0 0 0 9999px rgba(15,15,15,0.98),
                0 0 0 3px rgba(255,140,66,0.95),
                0 0 32px 12px rgba(255,140,66,0.5);
            }
          }
        `}</style>
      )}

      {/* Dim overlay — three variants:
           gradient steps → top-to-bottom gradient, transparent zone differs per page
           small rect     → spotlight cutout via box-shadow
           else           → full-screen flat dim                                       */}
      {isGradientStep ? (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: isWeekGridStep
            // Full Week: lime navbar + first 2 day rows fully visible (190px), then fades
            ? `linear-gradient(to bottom, transparent 0px, transparent 190px, ${OVERLAY} ${textTopPx - 28}px, ${OVERLAY} 100%)`
            // Home screen: only lime navbar fully visible (120px), gradient starts higher
            : `linear-gradient(to bottom, transparent 0px, transparent 120px, ${OVERLAY} ${textTopPx - 28}px, ${OVERLAY} 100%)`,
          zIndex: 99001,
          pointerEvents: 'none',
        }} />
      ) : rect && !isTooLarge ? (
        <div style={{
          position: 'fixed',
          top:    rect.top    - pad,
          left:   rect.left   - pad,
          width:  rect.width  + pad * 2,
          height: rect.height + pad * 2,
          borderRadius: 6,
          boxShadow: `0 0 0 9999px ${OVERLAY}`,
          zIndex: 99001,
          pointerEvents: 'none',
          ...(isWarmupStep && {
            animation: 'wkout-warmup-glow 1.8s ease-in-out 3',
          }),
        }} />
      ) : (
        <div style={{ position: 'fixed', inset: 0, background: OVERLAY, zIndex: 99001, pointerEvents: 'none' }} />
      )}

      {/* Bold bezier arrow — same stroke weight as display heading */}
      {arrow && (
        <svg style={{
          position: 'fixed', inset: 0,
          width: '100vw', height: '100vh',
          zIndex: 99002, pointerEvents: 'none',
          overflow: 'visible',
        }}>
          <path d={arrow.curve} stroke={TEXT} strokeWidth={ARROW_STROKE} fill="none" strokeLinecap="round" />
          <path d={arrow.head}  stroke={TEXT} strokeWidth={ARROW_STROKE} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {/* Floating header + body — no card, no border */}
      <div ref={textRef} style={{
        position: 'fixed',
        left: 32, right: 32,
        zIndex: 99003,
        textAlign: 'center',
        pointerEvents: 'none',
        ...textPos,
      }}>
        <h2 style={headingStyle}>{stepConfig.title}</h2>
        <p style={bodyStyle}>{stepConfig.body}</p>
      </div>

      <BottomBar
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        onNext={onNext}
        onBack={onBack}
        onSkip={onSkip}
        showNav
      />
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function OnboardingStep({ stepConfig, stepIndex, totalSteps, rect, onNext, onBack, onSkip }) {
  if (stepIndex === 0) {
    return (
      <WelcomeCard
        stepConfig={stepConfig}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        onNext={onNext}
        onSkip={onSkip}
      />
    );
  }

  return (
    <SpotlightAnnotation
      rect={rect}
      stepConfig={stepConfig}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      onNext={onNext}
      onBack={onBack}
      onSkip={onSkip}
    />
  );
}
