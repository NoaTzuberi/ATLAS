import { Schema, model } from 'mongoose';
import { MEMORY_CATEGORY_IDS } from './aiMemory.constants';
import type { AiMemoryDocument, AiMemoryEntry } from './aiMemory.types';

const memoryEntrySchema = new Schema<AiMemoryEntry>(
  {
    category: { type: String, enum: MEMORY_CATEGORY_IDS, required: true },
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    confidence: { type: Number, min: 0, max: 1, default: 0.8 },
  },
  { _id: false },
);

const aiMemorySchema = new Schema<AiMemoryDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  memories: { type: [memoryEntrySchema], default: [] },
});

export const AiMemory = model<AiMemoryDocument>('AiMemory', aiMemorySchema);
