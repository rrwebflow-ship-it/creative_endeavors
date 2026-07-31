'use client';

const LIME    = '#C8FF00';
const SURFACE = '#1A1A1A';
const BORDER  = '#2A2A2A';
const TEXT    = '#F0EDE6';
const MUTED   = '#888780';
const OVERLAY = 'rgba(15,15,15,0.88)';

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

// All cards use the same centred-modal shell as Step 1
const appShell = {
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  // Shift the flex centre upward so the card clears the bottom bar
  paddingBottom: '110px',
  padding: isMobile ? '0 40px 110px' : '0 56px 110px',
  zIndex: 99002,
  pointerEvents: 'none',
};

const cardStyle = {
  width: '100%',
  maxWidth: 480,
  background: SURFACE,
  border: `1px solid ${BORDER}`,
  padding: 24,
  position: 'relative',
  pointerEvents: 'auto',
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

  const pad        = 8;
  const spotTop    = rect ? rect.top    - pad : 0;
  const spotLeft   = rect ? rect.left   - pad : 0;
  const spotWidth  = rect ? rect.width  + pad * 2 : 0;
  const spotHeight = rect ? rect.height + pad * 2 : 0;

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

  return (
    <>
      {/* ── Overlay: spotlight hole if target visible, else full dim ── */}
      {isSpotlight && rect ? (
        <div
          style={{
            position: 'fixed',
            top: spotTop,
            left: spotLeft,
            width: spotWidth,
            height: spotHeight,
            borderRadius: 6,
            boxShadow: `0 0 0 9999px ${OVERLAY}`,
            zIndex: 99001,
            pointerEvents: 'none',
          }}
        />
      ) : (
        <div style={{ position: 'fixed', inset: 0, background: OVERLAY, zIndex: 99001, pointerEvents: 'none' }} />
      )}

      {/* ── Card — always centred, same layout for all 5 steps ── */}
      <div style={appShell}>
        <div style={cardStyle}>
          <h2 style={headingStyle}>{stepConfig.title}</h2>
          <p style={bodyStyle}>{stepConfig.body}</p>
          {navButtons}
        </div>
      </div>

      {/* ── Bottom bar: progress pills + skip ── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99003,
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
