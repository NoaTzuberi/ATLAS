import { Activity } from './activity.model';
import type { ActivityType } from './activity.constants';
import type { ActivityMetadata } from './activity.types';

export class ActivityNotFoundError extends Error {}

export interface ActivityInput {
  type: ActivityType;
  date?: string;
  duration: number;
  difficulty?: number;
  distance?: number;
  metadata?: ActivityMetadata;
}

export interface PublicActivity {
  id: string;
  type: ActivityType;
  date: Date;
  duration: number;
  difficulty?: number;
  distance?: number;
  metadata?: ActivityMetadata;
}

function toPublicActivity(doc: {
  _id: unknown;
  type: ActivityType;
  date: Date;
  duration: number;
  difficulty?: number;
  distance?: number;
  metadata?: ActivityMetadata;
}): PublicActivity {
  return {
    id: String(doc._id),
    type: doc.type,
    date: doc.date,
    duration: doc.duration,
    difficulty: doc.difficulty,
    distance: doc.distance,
    metadata: doc.metadata,
  };
}

export async function createActivity(userId: string, input: ActivityInput): Promise<PublicActivity> {
  const created = await Activity.create({
    userId,
    type: input.type,
    date: input.date ? new Date(input.date) : new Date(),
    duration: input.duration,
    difficulty: input.difficulty,
    distance: input.distance,
    metadata: input.metadata,
  });

  return toPublicActivity(created);
}

export interface ListActivitiesParams {
  from?: string;
  to?: string;
  limit?: number;
}

export async function listActivities(userId: string, params: ListActivitiesParams = {}): Promise<PublicActivity[]> {
  const filter: Record<string, unknown> = { userId };

  if (params.from || params.to) {
    const dateFilter: Record<string, Date> = {};
    if (params.from) dateFilter.$gte = new Date(params.from);
    if (params.to) dateFilter.$lte = new Date(params.to);
    filter.date = dateFilter;
  }

  const docs = await Activity.find(filter)
    .sort({ date: -1 })
    .limit(params.limit ?? 100)
    .lean();

  return docs.map(toPublicActivity);
}

export async function deleteActivity(id: string, userId: string): Promise<void> {
  const activity = await Activity.findById(id);
  if (!activity || String(activity.userId) !== userId) {
    throw new ActivityNotFoundError('Activity not found.');
  }
  await activity.deleteOne();
}
