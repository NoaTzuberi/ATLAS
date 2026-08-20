/**
 * Seeds ATLAS's ready-made workout templates (createdBy: null). Manual/dev
 * script only — not run automatically at startup, same pattern as
 * importExercises.ts. Re-running replaces the system template set; it never
 * touches user-created templates (createdBy !== null).
 *
 * References real exercise slugs already published in this environment's
 * Exercise collection, resolved to ObjectIds at seed time rather than
 * hardcoded ids (ids differ per database).
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { Exercise } from '../../exercises/exercise.model';
import { WorkoutTemplate } from '../workoutTemplate.model';
import type { WorkoutCategory, WorkoutGoal } from '../workoutTemplate.constants';
import type { Difficulty } from '../../exercises/exercise.constants';

interface SeedExercise {
  slug: string;
  order: number;
  defaultSets: number;
  defaultReps: string;
  restTime: number;
}

interface SeedTemplate {
  name: string;
  description: string;
  category: WorkoutCategory;
  goal: WorkoutGoal[];
  difficulty: Difficulty;
  duration: number;
  exercises: SeedExercise[];
}

const SEED_TEMPLATES: SeedTemplate[] = [
  {
    name: 'Push Day — Shoulders Focus',
    description: 'An overhead-pressing and shoulder session built from the current exercise library.',
    category: 'push',
    goal: ['strength', 'hypertrophy'],
    difficulty: 'intermediate',
    duration: 45,
    exercises: [
      { slug: 'behind-the-neck-press', order: 1, defaultSets: 4, defaultReps: '6-8', restTime: 90 },
      { slug: 'side-lying-lateral-raise', order: 2, defaultSets: 3, defaultReps: '12-15', restTime: 60 },
      { slug: 'plate-loaded-lateral-raise', order: 3, defaultSets: 3, defaultReps: '12-15', restTime: 60 },
    ],
  },
  {
    name: 'Pull Day — Back & Biceps',
    description: 'Rows, pull-ups, and curls for a complete pulling session.',
    category: 'pull',
    goal: ['strength', 'hypertrophy'],
    difficulty: 'intermediate',
    duration: 50,
    exercises: [
      { slug: 'pull-up', order: 1, defaultSets: 4, defaultReps: '6-10', restTime: 90 },
      { slug: 'one-arm-kettlebell-row', order: 2, defaultSets: 3, defaultReps: '10-12', restTime: 75 },
      { slug: 'reverse-grip-lat-pulldown', order: 3, defaultSets: 3, defaultReps: '10-12', restTime: 75 },
      { slug: 'incline-db-curl', order: 4, defaultSets: 3, defaultReps: '10-12', restTime: 60 },
    ],
  },
  {
    name: 'Leg Day — Squat Focus',
    description: 'Squat-pattern strength work for quads and glutes.',
    category: 'legs',
    goal: ['strength', 'hypertrophy'],
    difficulty: 'intermediate',
    duration: 50,
    exercises: [
      { slug: 'front-squat', order: 1, defaultSets: 4, defaultReps: '5-8', restTime: 120 },
      { slug: 'smith-machine-front-squat', order: 2, defaultSets: 3, defaultReps: '8-10', restTime: 90 },
      { slug: 'cossack-squat', order: 3, defaultSets: 3, defaultReps: '10-12', restTime: 75 },
    ],
  },
  {
    name: 'Full Body Conditioning',
    description: 'A compound, full-body session covering push, pull, legs, and conditioning.',
    category: 'full_body',
    goal: ['strength', 'endurance'],
    difficulty: 'intermediate',
    duration: 45,
    exercises: [
      { slug: 'front-squat', order: 1, defaultSets: 3, defaultReps: '6-8', restTime: 90 },
      { slug: 'pull-up', order: 2, defaultSets: 3, defaultReps: '6-10', restTime: 90 },
      { slug: 'behind-the-neck-press', order: 3, defaultSets: 3, defaultReps: '8-10', restTime: 75 },
      { slug: 'kettlebell-swing', order: 4, defaultSets: 3, defaultReps: '15-20', restTime: 60 },
      { slug: 'mountain-climbers', order: 5, defaultSets: 3, defaultReps: '30s', restTime: 45 },
    ],
  },
  {
    name: 'Core Circuit',
    description: 'A core-focused circuit for stability and conditioning.',
    category: 'core',
    goal: ['endurance', 'hypertrophy'],
    difficulty: 'beginner',
    duration: 25,
    exercises: [
      { slug: 'crunch', order: 1, defaultSets: 3, defaultReps: '15-20', restTime: 45 },
      { slug: 'mountain-climbers', order: 2, defaultSets: 3, defaultReps: '30s', restTime: 45 },
      { slug: 'bench-leg-pull-in', order: 3, defaultSets: 3, defaultReps: '12-15', restTime: 45 },
      { slug: 'stability-ball-knee-tuck', order: 4, defaultSets: 3, defaultReps: '12-15', restTime: 45 },
    ],
  },
];

async function run() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not set.');
  }

  await mongoose.connect(dbUrl);

  const allSlugs = SEED_TEMPLATES.flatMap((t) => t.exercises.map((e) => e.slug));
  const exercises = await Exercise.find({ slug: { $in: allSlugs } }).select('slug').lean();
  const slugToId = new Map(exercises.map((e) => [e.slug, e._id]));

  const missing = allSlugs.filter((slug) => !slugToId.has(slug));
  if (missing.length > 0) {
    throw new Error(`Missing exercises for slugs: ${missing.join(', ')}`);
  }

  await WorkoutTemplate.deleteMany({ createdBy: null });

  const docs = SEED_TEMPLATES.map((template) => ({
    name: template.name,
    description: template.description,
    goal: template.goal,
    difficulty: template.difficulty,
    duration: template.duration,
    category: template.category,
    createdBy: null,
    exercises: template.exercises.map((e) => ({
      exerciseId: slugToId.get(e.slug),
      order: e.order,
      defaultSets: e.defaultSets,
      defaultReps: e.defaultReps,
      restTime: e.restTime,
    })),
  }));

  await WorkoutTemplate.insertMany(docs);

  console.log(`Seeded ${docs.length} ready-made workout templates.`);

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
