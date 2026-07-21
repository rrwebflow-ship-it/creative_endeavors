import { workouts } from './workouts';

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

export function getTodaysWorkout() {
  return workouts[getCycleIndex()];
}

export function getTomorrowsWorkout() {
  return workouts[(getCycleIndex() + 1) % 7];
}

export function getCycleDay() {
  return getCycleIndex() + 1;
}
