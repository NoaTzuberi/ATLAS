import type { Difficulty, MovementType } from '../types';

export interface FilterOption {
  value: string;
  label: string;
}

/** Mirrors server/src/features/exercises/exercise.constants.ts MUSCLE_IDS. */
export const MUSCLE_OPTIONS: FilterOption[] = [
  { value: 'abdominals', label: 'Abdominals' },
  { value: 'abductors', label: 'Abductors' },
  { value: 'adductors', label: 'Adductors' },
  { value: 'biceps', label: 'Biceps' },
  { value: 'calves', label: 'Calves' },
  { value: 'chest', label: 'Chest' },
  { value: 'forearms', label: 'Forearms' },
  { value: 'glutes', label: 'Glutes' },
  { value: 'hamstrings', label: 'Hamstrings' },
  { value: 'lats', label: 'Lats' },
  { value: 'lower_back', label: 'Lower Back' },
  { value: 'middle_back', label: 'Middle Back' },
  { value: 'neck', label: 'Neck' },
  { value: 'quadriceps', label: 'Quadriceps' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'traps', label: 'Traps' },
  { value: 'triceps', label: 'Triceps' },
];

/** Mirrors server/src/features/exercises/exercise.constants.ts EQUIPMENT_IDS. */
export const EQUIPMENT_OPTIONS: FilterOption[] = [
  { value: 'barbell', label: 'Barbell' },
  { value: 'dumbbell', label: 'Dumbbell' },
  { value: 'cable', label: 'Cable' },
  { value: 'machine', label: 'Machine' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'resistance_band', label: 'Resistance Band' },
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'ez_curl_bar', label: 'EZ Curl Bar' },
  { value: 'exercise_ball', label: 'Exercise Ball' },
  { value: 'foam_roller', label: 'Foam Roller' },
  { value: 'medicine_ball', label: 'Medicine Ball' },
  { value: 'no_equipment', label: 'No Equipment' },
  { value: 'other', label: 'Other' },
  { value: 'battle_rope', label: 'Battle Rope' },
  { value: 'pull_up_bar', label: 'Pull-Up Bar' },
];

export const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const MOVEMENT_TYPE_OPTIONS: { value: MovementType; label: string }[] = [
  { value: 'strength', label: 'Strength' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'cardio', label: 'Cardio' },
];

const MUSCLE_LABELS = new Map(MUSCLE_OPTIONS.map((option) => [option.value, option.label]));
const EQUIPMENT_LABELS = new Map(EQUIPMENT_OPTIONS.map((option) => [option.value, option.label]));

export function muscleLabel(value: string): string {
  return MUSCLE_LABELS.get(value) ?? value;
}

export function equipmentLabel(value: string): string {
  return EQUIPMENT_LABELS.get(value) ?? value;
}
