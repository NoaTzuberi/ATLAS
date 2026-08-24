import { Schema, model } from 'mongoose';
import { ACTIVITY_TYPE_IDS } from './activity.constants';
import type { ActivityDocument, ActivityMetadata } from './activity.types';

const metadataSchema = new Schema<ActivityMetadata>(
  {
    board: { type: String, trim: true },
    location: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { _id: false },
);

const activitySchema = new Schema<ActivityDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ACTIVITY_TYPE_IDS, required: true },
  date: { type: Date, required: true, default: () => new Date() },
  duration: { type: Number, required: true, min: 1 },
  difficulty: { type: Number, min: 1, max: 5, default: undefined },
  distance: { type: Number, min: 0, default: undefined },
  metadata: { type: metadataSchema, default: undefined },
  createdAt: { type: Date, default: () => new Date() },
});

activitySchema.index({ userId: 1, date: -1 });

export const Activity = model<ActivityDocument>('Activity', activitySchema);
