import { workouts as defaultWorkouts } from './workouts';

const STORAGE_KEY = 'wkout-plan';

export function getPlan() {
  if (typeof window === 'undefined') return defaultWorkouts;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  // First launch — seed from defaults
  savePlan(defaultWorkouts);
  return defaultWorkouts;
}

export function savePlan(plan) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch {}
}

export function resetPlan() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function updateDay(dayNumber, updates) {
  const plan = getPlan();
  const next = plan.map(d => d.day === dayNumber ? { ...d, ...updates } : d);
  savePlan(next);
  return next;
}

export function updateExercises(dayNumber, exercises) {
  return updateDay(dayNumber, { exercises });
}
