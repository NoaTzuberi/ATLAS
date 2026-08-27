import type { WorkoutCategory, WorkoutGoal } from '../types';

export const WORKOUT_CATEGORY_OPTIONS: { value: WorkoutCategory; label: string }[] = [
  { value: 'push', label: 'Push' },
  { value: 'pull', label: 'Pull' },
  { value: 'upper_body', label: 'Upper Body' },
  { value: 'legs', label: 'Lower Body' },
  { value: 'full_body', label: 'Full Body' },
  { value: 'core', label: 'Core' },
];

export const WORKOUT_GOAL_OPTIONS: { value: WorkoutGoal; label: string }[] = [
  { value: 'strength', label: 'Strength' },
  { value: 'hypertrophy', label: 'Hypertrophy' },
  { value: 'endurance', label: 'Endurance' },
];

const CATEGORY_LABELS = new Map(WORKOUT_CATEGORY_OPTIONS.map((option) => [option.value, option.label]));
const GOAL_LABELS = new Map(WORKOUT_GOAL_OPTIONS.map((option) => [option.value, option.label]));

export function workoutCategoryLabel(value: string): string {
  return CATEGORY_LABELS.get(value as WorkoutCategory) ?? value;
}

export function workoutGoalLabel(value: string): string {
  return GOAL_LABELS.get(value as WorkoutGoal) ?? value;
}
