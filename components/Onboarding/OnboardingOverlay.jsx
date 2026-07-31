'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { STEPS } from './steps';
import OnboardingStep from './OnboardingStep';

export default function OnboardingOverlay() {
  const [hidden, setHidden]   = useState(true);
  const [step, setStep]       = useState(0);
  const [rect, setRect]       = useState(null);
  const hasInit               = useRef(false);
  const router                = useRouter();
  const pathname              = usePathname();

  // One-time flag check on mount
  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;
    try {
      if (localStorage.getItem('onboardingComplete') !== 'true') {
        setHidden(false);
      }
    } catch {}
  }, []);

  // Lock scroll on both <html> and <body> for all 5 steps across all mobile browsers
  useEffect(() => {
    const el  = document.documentElement;
    const bod = document.body;
    if (hidden) {
      el.style.overflow  = '';
      bod.style.overflow = '';
      el.style.position  = '';
      bod.style.position = '';
    } else {
      el.style.overflow  = 'hidden';
      bod.style.overflow = 'hidden';
      el.style.position  = 'relative';
      bod.style.position = 'relative';
    }
    return () => {
      el.style.overflow  = '';
      bod.style.overflow = '';
      el.style.position  = '';
      bod.style.position = '';
    };
  }, [hidden]);

  // Re-measure target whenever step or route changes
  useEffect(() => {
    if (hidden) return;
    const config = STEPS[step];
    if (!config.selector) { setRect(null); return; }
    const timer = setTimeout(() => {
      const el = document.querySelector(config.selector);
      setRect(el ? el.getBoundingClientRect() : null);
    }, 300);
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
    // Re-measurement is handled by the useEffect above
  }

  function goNext() {
    if (step >= STEPS.length - 1) { finish('/week'); return; }
    transitionTo(step + 1);
  }

  function goBack() {
    if (step === 0) return;
    transitionTo(step - 1);
  }

  function handleSkip() {
    finish('/');
  }

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
