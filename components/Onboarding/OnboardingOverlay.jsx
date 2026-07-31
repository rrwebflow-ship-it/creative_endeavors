'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { STEPS } from './steps';
import OnboardingStep from './OnboardingStep';

export default function OnboardingOverlay() {
  const [hidden, setHidden] = useState(true);
  const [step, setStep]     = useState(0);
  const [rect, setRect]     = useState(null);
  const hasInit             = useRef(false);
  const router              = useRouter();
  const pathname            = usePathname();

  // One-time flag check on mount
  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;
    try {
      if (localStorage.getItem('onboardingComplete') !== 'true') setHidden(false);
    } catch {}
  }, []);

  // Lock scroll — overflow:hidden only; no position:relative (that breaks fixed-element stacking)
  useEffect(() => {
    const el  = document.documentElement;
    const bod = document.body;
    if (hidden) {
      el.style.overflow  = '';
      bod.style.overflow = '';
    } else {
      el.style.overflow  = 'hidden';
      bod.style.overflow = 'hidden';
    }
    return () => {
      el.style.overflow  = '';
      bod.style.overflow = '';
    };
  }, [hidden]);

  // Re-measure target element whenever step or route settles.
  // 700ms gives Next.js App Router time to navigate + render before we query the DOM.
  useEffect(() => {
    if (hidden) return;
    const config = STEPS[step];
    if (!config.selector) { setRect(null); return; }

    const timer = setTimeout(() => {
      const el = document.querySelector(config.selector);
      if (!el) { setRect(null); return; }
      const r = el.getBoundingClientRect();
      // Only spotlight the element if it is actually visible in the viewport
      const visible = r.bottom > 0 && r.top < window.innerHeight &&
                      r.right  > 0 && r.left < window.innerWidth;
      setRect(visible ? r : null);
    }, 700);

    return () => clearTimeout(timer);
  }, [step, pathname, hidden]);

  function finish(nav) {
    try { localStorage.setItem('onboardingComplete', 'true'); } catch {}
    setHidden(true);
    if (nav) router.push(nav);
  }

  function transitionTo(targetStep) {
    const config = STEPS[targetStep];
    setStep(targetStep);
    setRect(null);

    if (config.route && pathname !== config.route) {
      router.push(config.route);
    } else if (!config.route && pathname === '/week') {
      // Going back to a day-view step from /week
      router.push('/');
    }
  }

  function goNext()    { if (step >= STEPS.length - 1) { finish('/week'); return; } transitionTo(step + 1); }
  function goBack()    { if (step === 0) return; transitionTo(step - 1); }
  function handleSkip() { finish('/'); }

  if (hidden) return null;

  return (
    <OnboardingStep
      stepConfig={STEPS[step]}
      stepIndex={step}
      totalSteps={STEPS.length}
      rect={rect}
      onNext={goNext}
      onBack={goBack}
      onSkip={handleSkip}
    />
  );
}
