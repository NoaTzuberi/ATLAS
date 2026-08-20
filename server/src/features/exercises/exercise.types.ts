import type { Types } from 'mongoose';
import type {
  Category,
  Muscle,
  Equipment,
  Difficulty,
  MovementType,
  ReviewStatus,
  ContentTier,
  Mechanic,
  ForceType,
  ExerciseGoal,
} from './exercise.constants';

export interface ExerciseInstructions {
  setup: string;
  execution: string;
  breathing: string;
}

export interface ExerciseSource {
  provider: string;
  dataset: string;
  originalTitle: string | null;
  importedAt: Date;
  license: string | null;
  sourceUrl: string | null;
  /** Untouched original row, kept for traceability and re-review. */
  raw: Record<string, unknown> | null;
}

/** A single styled/posed still image, used by the enhanced-tier gallery. */
export interface ExerciseMediaAsset {
  style: 'flat' | 'classic' | 'classic_white';
  variant: 'start' | 'peak' | 'main';
  url: string;
}

export interface ExerciseMedia {
  image: string | null;
  gif: string | null;
  video: string | null;
  /** Enhanced-tier only: the full multi-style/pose still set. */
  gallery?: ExerciseMediaAsset[];
  /** Enhanced-tier only: looping WebP animation, distinct from `gif`. */
  animationUrl?: string | null;
}

export interface ExerciseDocument {
  slug: string;
  name: string;
  aliases: string[];

  category: Category[];
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];

  equipment: Equipment[];
  difficulty: Difficulty;
  movementType: MovementType;

  instructions: ExerciseInstructions;
  commonMistakes: string[];
  tips: string[];

  progressions: Types.ObjectId[];
  regressions: Types.ObjectId[];
  variations: Types.ObjectId[];
  alternatives: Types.ObjectId[];

  media: ExerciseMedia;
  source: ExerciseSource;

  reviewStatus: ReviewStatus;
  isActive: boolean;

  /** Quality tier — lets any query prefer curated/enhanced records. Default 'standard'. */
  contentTier: ContentTier;
  /** Populated only for the RepDB enhanced subset. */
  goals?: ExerciseGoal[];
  mechanic?: Mechanic;
  forceType?: ForceType;
  isUnilateral?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/** Raw CSV row shape for the Kaggle megaGymDataset.csv (leading column is an unnamed pandas index). */
export interface RawExerciseRow {
  '': string;
  Title: string;
  Desc: string;
  Type: string;
  BodyPart: string;
  Equipment: string;
  Level: string;
  Rating: string;
  RatingDesc: string;
}

export interface NormalizedExercise {
  slug: string;
  name: string;
  aliases: string[];
  category: Category[];
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  equipment: Equipment[];
  difficulty: Difficulty;
  movementType: MovementType;
  instructions: ExerciseInstructions;
  source: ExerciseSource;
  reviewStatus: ReviewStatus;
  isActive: boolean;
  /** normalized title + equipment + primary muscle — the dedup key, not stored on the document */
  dedupKey: string;
}

export interface RowIssue {
  rowIndex: number;
  title: string;
  field: string;
  value: string;
  reason: string;
}

export interface NormalizeResult {
  records: NormalizedExercise[];
  skippedRows: RowIssue[];
  unmappedValues: RowIssue[];
}

/** Shape of a single exercise entry in server/data/repdb-preview/preview.en.json. */
export interface RawRepDbExercise {
  id: string;
  name: string;
  description?: string;
  instructions?: string[];
  tips?: string[];
  category?: string;
  force_type?: string;
  mechanic?: string;
  difficulty?: string;
  equipment?: string | null;
  body_part?: string;
  primary_muscles?: string[];
  secondary_muscles?: string[];
  goals?: string[];
  tags?: string[];
  synonyms?: string[];
  is_unilateral?: boolean;
  is_bodyweight?: boolean;
  relations?: { to: string; type: string }[];
  images?: { classic?: string[]; flat?: string[] };
  animation?: boolean;
  met?: number;
}

export interface NormalizedRepDbExercise {
  slug: string;
  name: string;
  aliases: string[];
  category: Category[];
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  equipment: Equipment[];
  difficulty: Difficulty;
  movementType: MovementType;
  instructions: ExerciseInstructions;
  tips: string[];
  goals: ExerciseGoal[];
  mechanic?: Mechanic;
  forceType?: ForceType;
  isUnilateral: boolean;
  media: ExerciseMedia;
  source: ExerciseSource;
  /** Raw {to, type} pairs, resolved to ObjectIds in a second pass once all RepDB docs exist. */
  pendingRelations: { to: string; type: string }[];
}
