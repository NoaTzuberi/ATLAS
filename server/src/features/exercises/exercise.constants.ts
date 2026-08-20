export const CATEGORY_IDS = ['upper_body', 'back', 'core', 'lower_body'] as const;
export type Category = (typeof CATEGORY_IDS)[number];

export const MUSCLE_IDS = [
  'abdominals',
  'abductors',
  'adductors',
  'biceps',
  'calves',
  'chest',
  'forearms',
  'glutes',
  'hamstrings',
  'lats',
  'lower_back',
  'middle_back',
  'neck',
  'quadriceps',
  'shoulders',
  'traps',
  'triceps',
] as const;
export type Muscle = (typeof MUSCLE_IDS)[number];

export const EQUIPMENT_IDS = [
  'barbell',
  'dumbbell',
  'cable',
  'machine',
  'kettlebell',
  'resistance_band',
  'bodyweight',
  'ez_curl_bar',
  'exercise_ball',
  'foam_roller',
  'medicine_ball',
  'no_equipment',
  'other',
  // Added for the RepDB enhanced subset — no existing value represented these accurately.
  'battle_rope',
  'pull_up_bar',
] as const;
export type Equipment = (typeof EQUIPMENT_IDS)[number];

export const DIFFICULTY_IDS = ['beginner', 'intermediate', 'advanced'] as const;
export type Difficulty = (typeof DIFFICULTY_IDS)[number];

export const MOVEMENT_TYPE_IDS = ['strength', 'mobility', 'cardio'] as const;
export type MovementType = (typeof MOVEMENT_TYPE_IDS)[number];

export const REVIEW_STATUS_IDS = ['imported', 'reviewed', 'published', 'rejected'] as const;
export type ReviewStatus = (typeof REVIEW_STATUS_IDS)[number];

/** Content quality tier — lets any query prefer curated/enhanced records without a parallel system. */
export const CONTENT_TIER_IDS = ['standard', 'enhanced'] as const;
export type ContentTier = (typeof CONTENT_TIER_IDS)[number];

/** compound (multi-joint) vs isolation (single-joint) — from the RepDB enhanced subset. */
export const MECHANIC_IDS = ['compound', 'isolation'] as const;
export type Mechanic = (typeof MECHANIC_IDS)[number];

/** Movement force pattern — from the RepDB enhanced subset. */
export const FORCE_TYPE_IDS = ['push', 'pull', 'static', 'dynamic'] as const;
export type ForceType = (typeof FORCE_TYPE_IDS)[number];

/**
 * Training-adaptation tags an exercise targets (distinct from onboarding's
 * GOAL_IDS, which are user-level life goals like "lose_weight" — these are
 * physiological targets like "hypertrophy". Bridging the two vocabularies is
 * future work for whenever the AI Workout Agent (Phase 8) is built; these
 * are populated now so that bridge has real data to work with.
 * From the RepDB enhanced subset.
 */
export const EXERCISE_GOAL_IDS = [
  'core',
  'endurance',
  'hypertrophy',
  'mobility',
  'power',
  'rehabilitation',
  'strength',
] as const;
export type ExerciseGoal = (typeof EXERCISE_GOAL_IDS)[number];

/**
 * Source mapping tables for the Kaggle "Gym Exercise Data" dataset
 * (niharika41298/gym-exercise-data, megaGymDataset.csv).
 * Values not present here are collected in the unmapped-values report by
 * the normalize script rather than guessed at.
 */

export const SOURCE_LEVEL_TO_DIFFICULTY: Record<string, Difficulty> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Expert: 'advanced',
};

export const SOURCE_TYPE_TO_MOVEMENT_TYPE: Record<string, MovementType> = {
  Strength: 'strength',
  Powerlifting: 'strength',
  'Olympic Weightlifting': 'strength',
  Strongman: 'strength',
  Plyometrics: 'strength',
  Stretching: 'mobility',
  Cardio: 'cardio',
};

export const SOURCE_EQUIPMENT_TO_EQUIPMENT: Record<string, Equipment> = {
  Barbell: 'barbell',
  Dumbbell: 'dumbbell',
  Cable: 'cable',
  Machine: 'machine',
  Kettlebells: 'kettlebell',
  Bands: 'resistance_band',
  'Body Only': 'bodyweight',
  'E-Z Curl Bar': 'ez_curl_bar',
  'Exercise Ball': 'exercise_ball',
  'Foam Roll': 'foam_roller',
  'Medicine Ball': 'medicine_ball',
  None: 'no_equipment',
  Other: 'other',
};

export const SOURCE_BODY_PART_TO_MUSCLE: Record<string, Muscle> = {
  Abdominals: 'abdominals',
  Abductors: 'abductors',
  Adductors: 'adductors',
  Biceps: 'biceps',
  Calves: 'calves',
  Chest: 'chest',
  Forearms: 'forearms',
  Glutes: 'glutes',
  Hamstrings: 'hamstrings',
  Lats: 'lats',
  'Lower Back': 'lower_back',
  'Middle Back': 'middle_back',
  Neck: 'neck',
  Quadriceps: 'quadriceps',
  Shoulders: 'shoulders',
  Traps: 'traps',
  Triceps: 'triceps',
};

/**
 * A muscle can contribute to more than one workout-split category at once
 * (category is an array). Muscles absent from this map (e.g. neck)
 * intentionally get no category rather than a forced fit.
 */
export const MUSCLE_TO_CATEGORIES: Partial<Record<Muscle, Category[]>> = {
  chest: ['upper_body'],
  shoulders: ['upper_body'],
  triceps: ['upper_body'],
  biceps: ['upper_body'],
  lats: ['upper_body', 'back'],
  middle_back: ['upper_body', 'back'],
  traps: ['upper_body'],
  forearms: ['upper_body'],
  lower_back: ['back', 'core'],
  abdominals: ['core'],
  quadriceps: ['lower_body'],
  hamstrings: ['lower_body'],
  calves: ['lower_body'],
  glutes: ['lower_body'],
  abductors: ['lower_body'],
  adductors: ['lower_body'],
};

/**
 * Source mapping tables for the RepDB preview pack
 * (server/data/repdb-preview/, CC BY-NC 4.0, non-commercial use only — see
 * docs/THIRD_PARTY_CONTENT.md). RepDB's own `category` field means something
 * different from ours (it's their movement-type axis, e.g. "cardio"), so it
 * maps to our `movementType`, not our `category` — our `category` is instead
 * *derived* from muscles via MUSCLE_TO_CATEGORIES, same as the Kaggle path.
 */

export const REPDB_CATEGORY_TO_MOVEMENT_TYPE: Record<string, MovementType> = {
  strength: 'strength',
  cardio: 'cardio',
  stretching: 'mobility',
  olympic: 'strength',
  plyometrics: 'strength',
  strongman: 'strength',
};

export const REPDB_EQUIPMENT_TO_EQUIPMENT: Record<string, Equipment> = {
  barbell: 'barbell',
  battle_rope: 'battle_rope',
  cable: 'cable',
  dumbbell: 'dumbbell',
  ez_bar: 'ez_curl_bar',
  flat_bench: 'other',
  hack_squat: 'machine',
  incline_bench: 'other',
  kettlebell: 'kettlebell',
  lateral_raise_machine: 'machine',
  plate_loaded_lateral_raise_machine: 'machine',
  pull_up_bar: 'pull_up_bar',
  resistance_band: 'resistance_band',
  rings: 'other',
  smith_machine: 'machine',
  stability_ball: 'exercise_ball',
};

/**
 * RepDB's muscle taxonomy is finer-grained than ours (e.g. anterior/lateral/
 * posterior deltoid vs. our single "shoulders"). Downmapped to our existing
 * vocabulary rather than expanding MUSCLE_IDS for 16 records — some mappings
 * are approximate (documented per-line) since no perfect bucket exists.
 */
export const REPDB_MUSCLE_TO_MUSCLE: Record<string, Muscle> = {
  adductors: 'adductors',
  anterior_deltoid: 'shoulders',
  biceps_brachii: 'biceps',
  brachialis: 'biceps', // elbow flexor, closest existing bucket
  brachioradialis: 'forearms',
  erector_spinae: 'lower_back',
  forearm_flexors: 'forearms',
  gluteus_maximus: 'glutes',
  gluteus_medius: 'glutes',
  hamstrings: 'hamstrings',
  hip_flexors: 'abdominals', // always co-occurs with core work in this dataset
  lateral_deltoid: 'shoulders',
  latissimus_dorsi: 'lats',
  obliques: 'abdominals',
  posterior_deltoid: 'shoulders',
  quadriceps: 'quadriceps',
  rectus_abdominis: 'abdominals',
  rhomboids: 'middle_back',
  serratus_anterior: 'chest', // ribcage/chest-wall muscle
  supraspinatus: 'shoulders', // rotator cuff
  trapezius: 'traps',
  triceps_brachii: 'triceps',
};

/**
 * RepDB's relations[] use directional {to, type} pairs where `type` describes
 * what the TARGET is relative to the exercise it's attached to (e.g. a
 * `progression_of` entry means the target is the harder variant reachable
 * FROM this exercise). Maps directly onto our existing progressions/
 * regressions/alternatives ObjectId arrays — no new field needed.
 */
export const REPDB_RELATION_TYPE_TO_FIELD: Record<string, 'progressions' | 'regressions' | 'alternatives'> = {
  progression_of: 'progressions',
  regression_of: 'regressions',
  alternative: 'alternatives',
};
