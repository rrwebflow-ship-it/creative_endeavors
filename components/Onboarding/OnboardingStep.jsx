'use client';

const LIME    = '#C8FF00';
const SURFACE = '#1A1A1A';
const BORDER  = '#2A2A2A';
const TEXT    = '#F0EDE6';
const MUTED   = '#888780';
const OVERLAY = 'rgba(15,15,15,0.82)';

// Matches the app's responsive container: max-width 480px, centred
// Mobile (≤480px) gets 40px (2.5rem) side padding; desktop gets 56px (3.5rem)
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

const appShell = {
  position: 'fixed',
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  padding: isMobile ? '0 40px' : '0 56px',
};

const cardStyle = {
  width: '100%',
  maxWidth: 480,
  background: SURFACE,
  border: `1px solid ${BORDER}`,
  padding: 24,
  position: 'relative',
};

const headingStyle = {
  fontFamily: 'var(--font-display)',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: TEXT,
  fontSize: 'clamp(1.25rem, 5.5vw, 1.75rem)',
  lineHeight: 1.1,
  marginBottom: 12,
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

export default function OnboardingStep({
  stepConfig,
  stepIndex,
  totalSteps,
  rect,
  onNext,
  onBack,
  onSkip,
}) {
  const isFirst     = stepIndex === 0;
  const isLast      = stepIndex === totalSteps - 1;
  const isSpotlight = !!stepConfig.selector;
  const above       = stepConfig.tooltipPosition === 'above';

  const pad        = 8;
  const spotTop    = rect ? rect.top    - pad : 0;
  const spotLeft   = rect ? rect.left   - pad : 0;
  const spotWidth  = rect ? rect.width  + pad * 2 : 0;
  const spotHeight = rect ? rect.height + pad * 2 : 0;
  const winH       = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Bottom bar (progress pills + skip) occupies ~96px
  const BOTTOM_BAR_H = 96;

  // For below-cards: raw anchor, then clamp so the card never starts in the bottom 260px
  const rawBelowTop  = spotTop + spotHeight + 16;
  const safeBelowTop = Math.min(rawBelowTop, winH - BOTTOM_BAR_H - 160);
  // maxHeight lets the card scroll internally if it genuinely can't fit
  const belowMaxH    = winH - rawBelowTop - BOTTOM_BAR_H;

  // Vertical anchor for the card wrapper
  const verticalPlacement = rect
    ? above
      ? { bottom: winH - spotTop + 16 }
      : { top: Math.max(0, safeBelowTop) }
    : { top: '35%' };

  // Shared nav buttons (inlined to avoid nested-component re-mount issues)
  const navButtons = (
    <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
      {!isFirst && (
        <button
          onClick={onBack}
          style={{ ...btnBase, background: 'transparent', border: `1px solid ${BORDER}`, color: MUTED }}
        >
          BACK
        </button>
      )}
      <button
        onClick={onNext}
        style={{ ...btnBase, background: LIME, color: '#0F0F0F', fontWeight: 'bold' }}
      >
        {isLast ? 'DONE' : 'NEXT'}
      </button>
    </div>
  );

  // Arrow pointing up (card sits below spotlight)
  const arrowUp = (
    <>
      <div style={{ position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: `7px solid ${BORDER}` }} />
      <div style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: `6px solid ${SURFACE}` }} />
    </>
  );

  // Arrow pointing down (card sits above spotlight)
  const arrowDown = (
    <>
      <div style={{ position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: `7px solid ${BORDER}` }} />
      <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `6px solid ${SURFACE}` }} />
    </>
  );

  return (
    <>
      {/* ── Dark overlay / spotlight hole ───────────────────── */}
      {isSpotlight && rect ? (
        <div
          style={{
            position: 'fixed',
            top: spotTop,
            left: spotLeft,
            width: spotWidth,
            height: spotHeight,
            borderRadius: 6,
            boxShadow: `0 0 0 max(100vw, 100vh) ${OVERLAY}`,
            zIndex: 9001,
            pointerEvents: 'none',
          }}
        />
      ) : (
        <div style={{ position: 'fixed', inset: 0, background: OVERLAY, zIndex: 9001, pointerEvents: 'none' }} />
      )}

      {/* ── Fullscreen modal (Step 1) — vertically centred ── */}
      {!isSpotlight && (
        <div style={{ ...appShell, top: 0, bottom: 0, alignItems: 'center', zIndex: 9002 }}>
          <div style={cardStyle}>
            <h2 style={headingStyle}>{stepConfig.title}</h2>
            <p style={bodyStyle}>{stepConfig.body}</p>
            {navButtons}
          </div>
        </div>
      )}

      {/* ── Tooltip card (spotlight steps) ──────────────────── */}
      {isSpotlight && (
        <div style={{ ...appShell, zIndex: 9003, ...verticalPlacement }}>
          <div style={{
            ...cardStyle,
            ...(!above && belowMaxH > 0 && belowMaxH < 300
              ? { maxHeight: Math.max(belowMaxH, 140), overflowY: 'auto' }
              : {}),
          }}>
            {above ? arrowDown : arrowUp}
            <h3 style={headingStyle}>{stepConfig.title}</h3>
            <p style={bodyStyle}>{stepConfig.body}</p>
            {navButtons}
          </div>
        </div>
      )}

      {/* ── Bottom bar: progress pills + skip ───────────────── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9004,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 28,
        paddingTop: 16,
        background: 'linear-gradient(to top, rgba(15,15,15,1) 60%, transparent)',
      }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 6,
                width: i === stepIndex ? 20 : 6,
                borderRadius: 3,
                background: i === stepIndex ? LIME : SURFACE,
                border: `1px solid ${i === stepIndex ? LIME : BORDER}`,
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>
        <button
          onClick={onSkip}
          style={{
            fontFamily: 'var(--font-body)',
            color: MUTED,
            background: 'transparent',
            border: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          SKIP WALKTHROUGH
        </button>
      </div>
    </>
  );
}
