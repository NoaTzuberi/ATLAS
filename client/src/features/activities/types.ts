export type ActivityType = 'running' | 'surf' | 'skate' | 'boxing' | 'yoga';

export interface ActivityMetadata {
  board?: string;
  location?: string;
  notes?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  date: string;
  duration: number;
  difficulty?: number;
  distance?: number;
  metadata?: ActivityMetadata;
}

export interface ActivityInput {
  type: ActivityType;
  date?: string;
  duration: number;
  difficulty?: number;
  distance?: number;
  metadata?: ActivityMetadata;
}
