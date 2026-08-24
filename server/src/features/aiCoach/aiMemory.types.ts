import type { Types } from 'mongoose';
import type { MemoryCategory } from './aiMemory.constants';

export interface AiMemoryEntry {
  category: MemoryCategory;
  key: string;
  value: string;
  confidence: number;
}

export interface AiMemoryDocument {
  userId: Types.ObjectId;
  memories: AiMemoryEntry[];
}
