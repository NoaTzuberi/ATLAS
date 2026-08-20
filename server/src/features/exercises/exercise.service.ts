import { Exercise } from './exercise.model';
import type {
  Category,
  Muscle,
  Equipment,
  Difficulty,
  MovementType,
  ContentTier,
  Mechanic,
  ForceType,
  ExerciseGoal,
} from './exercise.constants';
import type { ExerciseMedia } from './exercise.types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

/**
 * Any consumer — the public list endpoint today, a future AI Workout Agent
 * tomorrow — filters through this same shape. Every field is optional and
 * single-value, matching the existing filter pattern; goal/mechanic/
 * forceType/isUnilateral are the dimensions the (not-yet-built) Workout
 * Agent is expected to reason over per docs/05_AI_AGENT_SPEC.md.
 */
export interface ListExercisesParams {
  page?: number;
  limit?: number;
  muscle?: Muscle;
  equipment?: Equipment;
  difficulty?: Difficulty;
  movementType?: MovementType;
  goal?: ExerciseGoal;
  mechanic?: Mechanic;
  forceType?: ForceType;
  isUnilateral?: boolean;
  search?: string;
}

export interface PublicExerciseAttribution {
  label: string;
  url: string;
}

export interface PublicExercise {
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  category: Category[];
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  equipment: Equipment[];
  difficulty: Difficulty;
  movementType: MovementType;
  instructions: { setup: string; execution: string; breathing: string };
  commonMistakes: string[];
  tips: string[];
  media: ExerciseMedia;
  contentTier: ContentTier;
  goals?: ExerciseGoal[];
  mechanic?: Mechanic;
  forceType?: ForceType;
  isUnilateral?: boolean;
  /** Present only for contentTier: 'enhanced' — required CC BY-NC 4.0 credit. */
  attribution?: PublicExerciseAttribution;
}

export interface PaginatedExercises {
  items: PublicExercise[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ExerciseNotFoundError extends Error {}

interface ExerciseLeanDoc {
  _id: unknown;
  slug: string;
  name: string;
  aliases: string[];
  category: Category[];
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  equipment: Equipment[];
  difficulty: Difficulty;
  movementType: MovementType;
  instructions: { setup: string; execution: string; breathing: string };
  commonMistakes: string[];
  tips: string[];
  media: ExerciseMedia;
  contentTier: ContentTier;
  goals?: ExerciseGoal[];
  mechanic?: Mechanic;
  forceType?: ForceType;
  isUnilateral?: boolean;
}

/**
 * Strips internal workflow/source fields (reviewStatus, isActive, source —
 * including source.raw — and the progressions/regressions/variations/
 * alternatives ObjectId refs) from the public API response. contentTier and
 * an attribution block ARE exposed: they're product-facing (the "Enhanced"
 * badge and required RepDB credit), not internal metadata.
 */
function toPublicExercise(doc: ExerciseLeanDoc): PublicExercise {
  const isEnhanced = doc.contentTier === 'enhanced';

  return {
    id: String(doc._id),
    slug: doc.slug,
    name: doc.name,
    aliases: doc.aliases,
    category: doc.category,
    primaryMuscles: doc.primaryMuscles,
    secondaryMuscles: doc.secondaryMuscles,
    equipment: doc.equipment,
    difficulty: doc.difficulty,
    movementType: doc.movementType,
    instructions: doc.instructions,
    commonMistakes: doc.commonMistakes,
    tips: doc.tips,
    media: doc.media,
    contentTier: doc.contentTier,
    goals: doc.goals,
    mechanic: doc.mechanic,
    forceType: doc.forceType,
    isUnilateral: doc.isUnilateral,
    attribution: isEnhanced ? { label: 'RepDB (CC BY-NC 4.0)', url: 'https://repdb.co' } : undefined,
  };
}

function buildPublicFilter(params: ListExercisesParams): Record<string, unknown> {
  const filter: Record<string, unknown> = {
    reviewStatus: 'published',
    isActive: true,
  };

  if (params.muscle) filter.primaryMuscles = params.muscle;
  if (params.equipment) filter.equipment = params.equipment;
  if (params.difficulty) filter.difficulty = params.difficulty;
  if (params.movementType) filter.movementType = params.movementType;
  if (params.goal) filter.goals = params.goal;
  if (params.mechanic) filter.mechanic = params.mechanic;
  if (params.forceType) filter.forceType = params.forceType;
  if (params.isUnilateral !== undefined) filter.isUnilateral = params.isUnilateral;

  if (params.search) {
    const escaped = params.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(escaped, 'i');
    filter.$or = [{ name: pattern }, { aliases: pattern }];
  }

  return filter;
}

/**
 * Sorted so that, within whatever the filter already deems relevant,
 * 'enhanced' (RepDB) exercises surface first ('enhanced' < 'standard'
 * lexicographically, so ascending sort naturally puts them first — no
 * aggregation needed). This is the entire "prioritization" mechanism: the
 * filter decides relevance, the sort just orders within it. An exercise
 * never appears here unless it already matched the caller's actual filters,
 * so an enhanced exercise is never forced into an irrelevant result.
 */
export async function listPublicExercises(
  params: ListExercisesParams,
): Promise<PaginatedExercises> {
  const page = params.page ?? DEFAULT_PAGE;
  const limit = params.limit ?? DEFAULT_LIMIT;
  const filter = buildPublicFilter(params);

  const [docs, total] = await Promise.all([
    Exercise.find(filter)
      .sort({ contentTier: 1, name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<ExerciseLeanDoc[]>(),
    Exercise.countDocuments(filter),
  ]);

  return {
    items: docs.map(toPublicExercise),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPublicExerciseBySlug(slug: string): Promise<PublicExercise> {
  const doc = await Exercise.findOne({ slug, reviewStatus: 'published', isActive: true }).lean<ExerciseLeanDoc>();
  if (!doc) {
    throw new ExerciseNotFoundError('Exercise not found.');
  }
  return toPublicExercise(doc);
}

/**
 * RAG-eligibility filter, per docs/06_RAG_KNOWLEDGE_PLAN.md: only published,
 * active, reviewed records are eligible. No vector ingestion happens here —
 * this just exposes the query for a future RAG pipeline to consume.
 */
export async function listRagEligibleExercises() {
  return Exercise.find({ reviewStatus: 'published', isActive: true }).lean();
}
