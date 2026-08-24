import type { FunctionDeclaration } from '@google/genai';
import { getUserProfileById } from '../users/users.service';
import { listWorkoutSummaries } from '../workouts/workout.service';
import { getPublicExerciseBySlug, listPublicExercises } from '../exercises/exercise.service';
import { Exercise } from '../exercises/exercise.model';
import {
  MUSCLE_IDS,
  EQUIPMENT_IDS,
  DIFFICULTY_IDS,
  MOVEMENT_TYPE_IDS,
} from '../exercises/exercise.constants';
import {
  createWorkoutTemplate,
  updateWorkoutTemplate,
  getWorkoutTemplateById,
} from '../workoutTemplates/workoutTemplate.service';
import { WORKOUT_CATEGORY_IDS, WORKOUT_GOAL_IDS } from '../workoutTemplates/workoutTemplate.constants';
import { listPersonalRecords } from '../personalRecords/personalRecord.service';
import { getDashboardSummary } from '../dashboard/dashboard.service';
import { retrieveRelevantKnowledge } from '../knowledge/knowledge.service';
import { saveMemory } from './aiMemory.service';
import { MEMORY_CATEGORY_IDS } from './aiMemory.constants';

const exerciseEntryInputSchema = {
  type: 'object' as const,
  properties: {
    exerciseSlug: { type: 'string', description: 'The slug of an exercise, from searchExerciseLibrary or getExerciseDetails.' },
    order: { type: 'number' },
    defaultSets: { type: 'number' },
    defaultReps: { type: 'string', description: 'e.g. "8-12" or "30s"' },
    defaultWeight: { type: 'number', description: 'Optional target weight in kg.' },
    restTime: { type: 'number', description: 'Optional rest time in seconds.' },
  },
  required: ['exerciseSlug', 'order', 'defaultSets', 'defaultReps'],
};

export const AGENT_TOOLS: FunctionDeclaration[] = [
  {
    name: 'getUserProfile',
    description:
      "Get the current user's onboarding profile: goals, training frequency, preferred activities, equipment, exercise preferences, and recovery notes.",
    parametersJsonSchema: { type: 'object', properties: {} },
  },
  {
    name: 'getWorkoutHistory',
    description: "Get the current user's recent completed workout sessions (name, date, duration, volume).",
    parametersJsonSchema: {
      type: 'object',
      properties: { limit: { type: 'number', description: 'Max results, default 10.' } },
    },
  },
  {
    name: 'getExerciseDetails',
    description: 'Get full details for one exercise by slug: instructions, common mistakes, tips, muscles, equipment.',
    parametersJsonSchema: {
      type: 'object',
      properties: { slug: { type: 'string' } },
      required: ['slug'],
    },
  },
  {
    name: 'searchExerciseLibrary',
    description: 'Search the exercise library by name/keyword and optional filters. Returns up to `limit` matches.',
    parametersJsonSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Keyword to search exercise names, e.g. "squat".' },
        muscle: { type: 'string', enum: [...MUSCLE_IDS] },
        equipment: { type: 'string', enum: [...EQUIPMENT_IDS] },
        difficulty: { type: 'string', enum: [...DIFFICULTY_IDS] },
        movementType: { type: 'string', enum: [...MOVEMENT_TYPE_IDS] },
        limit: { type: 'number', description: 'Max results, default 8.' },
      },
    },
  },
  {
    name: 'createWorkout',
    description:
      "Create and save a new workout plan owned by the current user (appears in their Workouts > My Workouts). Use searchExerciseLibrary first to find valid exercise slugs.",
    parametersJsonSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string', enum: [...WORKOUT_CATEGORY_IDS] },
        difficulty: { type: 'string', enum: [...DIFFICULTY_IDS] },
        duration: { type: 'number', description: 'Estimated minutes.' },
        goal: { type: 'array', items: { type: 'string', enum: [...WORKOUT_GOAL_IDS] } },
        exercises: { type: 'array', items: exerciseEntryInputSchema },
      },
      required: ['name', 'exercises'],
    },
  },
  {
    name: 'modifyWorkout',
    description:
      "Modify a workout plan the current user owns (e.g. change duration, swap an exercise, adjust sets/reps). Only fields provided in `patch` are changed; the rest stay as they were.",
    parametersJsonSchema: {
      type: 'object',
      properties: {
        workoutTemplateId: { type: 'string' },
        patch: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string', enum: [...WORKOUT_CATEGORY_IDS] },
            difficulty: { type: 'string', enum: [...DIFFICULTY_IDS] },
            duration: { type: 'number' },
            goal: { type: 'array', items: { type: 'string', enum: [...WORKOUT_GOAL_IDS] } },
            exercises: { type: 'array', items: exerciseEntryInputSchema },
          },
        },
      },
      required: ['workoutTemplateId', 'patch'],
    },
  },
  {
    name: 'analyzeProgress',
    description:
      "Analyze the current user's training: workout streak, workouts this week, total workouts, recent personal records, and weight trend.",
    parametersJsonSchema: { type: 'object', properties: {} },
  },
  {
    name: 'getPersonalRecords',
    description: "Get the current user's most recent personal records (heaviest weight or most reps per exercise).",
    parametersJsonSchema: {
      type: 'object',
      properties: { limit: { type: 'number', description: 'Max results, default 10.' } },
    },
  },
  {
    name: 'searchKnowledgeBase',
    description:
      'Search the fitness knowledge base for training principles, programming guidance, recovery information, or coaching guidance. Use this for "why" or "how" questions that are not about a specific exercise.',
    parametersJsonSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        topK: { type: 'number', description: 'Max results, default 4.' },
      },
      required: ['query'],
    },
  },
  {
    name: 'saveMemory',
    description:
      "Save a durable fact worth remembering about the user for future conversations (a stated preference, behavior pattern, or goal). Only use this for things that will still be true weeks from now — not one-off details from this message.",
    parametersJsonSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: [...MEMORY_CATEGORY_IDS] },
        key: { type: 'string', description: 'Short identifier, e.g. "dislikes_long_cardio".' },
        value: { type: 'string' },
        confidence: { type: 'number', description: '0 to 1, default 0.8.' },
      },
      required: ['category', 'key', 'value'],
    },
  },
];

class ToolInputError extends Error {}

async function resolveExerciseEntries(
  entries: Array<{
    exerciseSlug: string;
    order: number;
    defaultSets: number;
    defaultReps: string;
    defaultWeight?: number;
    restTime?: number;
  }>,
) {
  const slugs = entries.map((e) => e.exerciseSlug);
  const docs = await Exercise.find({ slug: { $in: slugs } })
    .select('slug')
    .lean();
  const slugToId = new Map(docs.map((d) => [d.slug, d._id]));

  const missing = slugs.filter((slug) => !slugToId.has(slug));
  if (missing.length > 0) {
    throw new ToolInputError(`Unknown exercise slug(s): ${missing.join(', ')}. Use searchExerciseLibrary first.`);
  }

  return entries.map((e) => ({
    exerciseId: String(slugToId.get(e.exerciseSlug)),
    order: e.order,
    defaultSets: e.defaultSets,
    defaultReps: e.defaultReps,
    defaultWeight: e.defaultWeight,
    restTime: e.restTime,
  }));
}

/** Every tool is scoped to the calling user's own data — the agent never
 * takes a userId as input, it's always the authenticated caller. */
export async function executeTool(toolName: string, input: Record<string, unknown>, userId: string): Promise<unknown> {
  switch (toolName) {
    case 'getUserProfile':
      return getUserProfileById(userId);

    case 'getWorkoutHistory':
      return listWorkoutSummaries(userId, {
        status: 'completed',
        limit: (input.limit as number) ?? 10,
      });

    case 'getExerciseDetails':
      return getPublicExerciseBySlug(input.slug as string);

    case 'searchExerciseLibrary':
      return listPublicExercises({
        search: input.search as string | undefined,
        muscle: input.muscle as never,
        equipment: input.equipment as never,
        difficulty: input.difficulty as never,
        movementType: input.movementType as never,
        limit: (input.limit as number) ?? 8,
      });

    case 'createWorkout': {
      const exercises = await resolveExerciseEntries(
        input.exercises as Array<{
          exerciseSlug: string;
          order: number;
          defaultSets: number;
          defaultReps: string;
          defaultWeight?: number;
          restTime?: number;
        }>,
      );
      return createWorkoutTemplate(userId, {
        name: input.name as string,
        description: input.description as string | undefined,
        category: input.category as never,
        difficulty: input.difficulty as never,
        duration: input.duration as number | undefined,
        goal: input.goal as never,
        exercises,
      });
    }

    case 'modifyWorkout': {
      const workoutTemplateId = input.workoutTemplateId as string;
      const patch = input.patch as Record<string, unknown>;
      const existing = await getWorkoutTemplateById(workoutTemplateId, userId);

      const exercises = patch.exercises
        ? await resolveExerciseEntries(
            patch.exercises as Array<{
              exerciseSlug: string;
              order: number;
              defaultSets: number;
              defaultReps: string;
              defaultWeight?: number;
              restTime?: number;
            }>,
          )
        : existing.exercises.map((e) => ({
            exerciseId: e.exercise.id,
            order: e.order,
            defaultSets: e.defaultSets,
            defaultReps: e.defaultReps,
            defaultWeight: e.defaultWeight,
            restTime: e.restTime,
          }));

      return updateWorkoutTemplate(workoutTemplateId, userId, {
        name: (patch.name as string) ?? existing.name,
        description: (patch.description as string) ?? existing.description,
        category: (patch.category as never) ?? existing.category,
        difficulty: (patch.difficulty as never) ?? existing.difficulty,
        duration: (patch.duration as number) ?? existing.duration,
        goal: (patch.goal as never) ?? existing.goal,
        exercises,
      });
    }

    case 'analyzeProgress':
      return getDashboardSummary(userId);

    case 'getPersonalRecords':
      return listPersonalRecords(userId, (input.limit as number) ?? 10);

    case 'searchKnowledgeBase':
      return retrieveRelevantKnowledge(input.query as string, (input.topK as number) ?? 4);

    case 'saveMemory':
      return saveMemory(userId, {
        category: input.category as never,
        key: input.key as string,
        value: input.value as string,
        confidence: input.confidence as number | undefined,
      });

    default:
      throw new ToolInputError(`Unknown tool: ${toolName}`);
  }
}

export { ToolInputError };
