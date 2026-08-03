import { getPlan } from './storage';

const CYCLE_START = new Date('2025-01-01');

function getCycleIndex() {
  const today = new Date();
  let startDate = CYCLE_START;

  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('cycleStartOverride');
    if (override) startDate = new Date(override);
  }

  const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  return daysElapsed % 7;
}

export function getCycleDay() {
  return getCycleIndex() + 1;
}

export function getTodaysWorkout() {
  const plan = getPlan();
  const dayNumber = getCycleDay();
  return plan.find(w => w.day === dayNumber) || plan[getCycleIndex()];
}

export function getTomorrowsWorkout() {
  const plan = getPlan();
  const tomorrowDayNumber = (getCycleDay() % 7) + 1;
  return plan.find(w => w.day === tomorrowDayNumber) || plan[(getCycleIndex() + 1) % 7];
}
