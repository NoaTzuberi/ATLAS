import type { WorkoutExerciseRowValue } from '../components/WorkoutExerciseRow/WorkoutExerciseRow';

export type BodyRegion =
  | 'chest'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'back'
  | 'quads'
  | 'hamstrings'
  | 'calves'
  | 'glutes';

export const BODY_REGIONS: BodyRegion[] = [
  'chest',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'abs',
  'back',
  'quads',
  'hamstrings',
  'calves',
  'glutes',
];

export const BODY_REGION_LABELS: Record<BodyRegion, string> = {
  chest: 'Chest',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  abs: 'Abs',
  back: 'Back',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  calves: 'Calves',
  glutes: 'Glutes',
};

/** Maps the app's exercise muscle IDs (see exercises/data/filterOptions.ts
 * MUSCLE_OPTIONS) onto the coarser regions the body diagram can actually
 * draw as distinct shapes. Neck/traps fold into shoulders; abductors/
 * adductors fold into quads — close enough for a legible small diagram. */
const MUSCLE_TO_REGION: Record<string, BodyRegion> = {
  chest: 'chest',
  shoulders: 'shoulders',
  traps: 'shoulders',
  neck: 'shoulders',
  biceps: 'biceps',
  triceps: 'triceps',
  forearms: 'forearms',
  abdominals: 'abs',
  lats: 'back',
  middle_back: 'back',
  lower_back: 'back',
  quadriceps: 'quads',
  abductors: 'quads',
  adductors: 'quads',
  hamstrings: 'hamstrings',
  calves: 'calves',
  glutes: 'glutes',
};

export function muscleToRegion(muscle: string): BodyRegion | undefined {
  return MUSCLE_TO_REGION[muscle];
}

/** Counts how many added exercises target each region, via each exercise's
 * primary muscles. Used to scale highlight intensity on the coverage map. */
export function computeRegionCoverage(rows: WorkoutExerciseRowValue[]): Record<BodyRegion, number> {
  const counts = Object.fromEntries(BODY_REGIONS.map((region) => [region, 0])) as Record<BodyRegion, number>;

  for (const row of rows) {
    const regionsHitByThisExercise = new Set<BodyRegion>();
    for (const muscle of row.exercise.primaryMuscles) {
      const region = muscleToRegion(muscle);
      if (region) regionsHitByThisExercise.add(region);
    }
    for (const region of regionsHitByThisExercise) {
      counts[region] += 1;
    }
  }

  return counts;
}

/** Distinct muscle IDs across all added exercises, in first-seen order —
 * feeds the summary card's muscle-chip list. */
export function collectCoveredMuscles(rows: WorkoutExerciseRowValue[]): string[] {
  const seen = new Set<string>();
  for (const row of rows) {
    for (const muscle of row.exercise.primaryMuscles) {
      seen.add(muscle);
    }
  }
  return Array.from(seen);
}
