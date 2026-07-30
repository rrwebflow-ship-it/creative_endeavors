import { warmups as defaultWarmups } from './warmups';

const STORAGE_KEY = 'wkout-warmup-plan';

export function getWarmupPlan() {
  if (typeof window === 'undefined') return defaultWarmups;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  saveWarmupPlan(defaultWarmups);
  return defaultWarmups;
}

export function saveWarmupPlan(plan) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch {}
}

export function resetWarmupPlan() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function getWarmupForDay(dayNumber) {
  const plan = getWarmupPlan();
  return plan.find(w => w.day === dayNumber) || { day: dayNumber, items: [] };
}

export function updateWarmupItems(dayNumber, items) {
  const plan = getWarmupPlan();
  const next = plan.map(d => d.day === dayNumber ? { ...d, items } : d);
  saveWarmupPlan(next);
  return next;
}
