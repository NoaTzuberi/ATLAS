import path from 'path';
import express from 'express';
import cors from 'cors';
import { healthRouter } from './features/health/health.routes';
import { authRouter } from './features/auth/auth.routes';
import { usersRouter } from './features/users/users.routes';
import { exercisesRouter } from './features/exercises/exercise.routes';
import { workoutTemplatesRouter } from './features/workoutTemplates/workoutTemplate.routes';
import { workoutsRouter } from './features/workouts/workout.routes';
import { personalRecordsRouter } from './features/personalRecords/personalRecord.routes';
import { progressRouter } from './features/progress/progress.routes';
import { activitiesRouter } from './features/activities/activity.routes';
import { dashboardRouter } from './features/dashboard/dashboard.routes';
import { aiCoachRouter } from './features/aiCoach/aiCoach.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/workout-templates', workoutTemplatesRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/personal-records', personalRecordsRouter);
app.use('/api/progress', progressRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/coach', aiCoachRouter);

/**
 * Serves the RepDB preview pack's images/animations directly from its raw
 * (gitignored) source directory — see docs/THIRD_PARTY_CONTENT.md. CC BY-NC
 * 4.0, non-commercial use only. On a fresh clone without the pack present,
 * this route 404s gracefully rather than erroring, same as the Kaggle CSV
 * needing a manual re-download.
 */
app.use('/media/repdb', express.static(path.join(__dirname, '../data/repdb-preview/images')));

export default app;
