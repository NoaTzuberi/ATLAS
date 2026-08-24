import type { Types } from 'mongoose';
import type { ActivityType } from './activity.constants';

export interface ActivityMetadata {
  board?: string;
  location?: string;
  notes?: string;
}

export interface ActivityDocument {
  userId: Types.ObjectId;
  type: ActivityType;
  date: Date;
  duration: number;
  difficulty?: number;
  distance?: number;
  metadata?: ActivityMetadata;
  createdAt: Date;
}
