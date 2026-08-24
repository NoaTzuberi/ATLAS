import { AiMemory } from './aiMemory.model';
import type { AiMemoryEntry } from './aiMemory.types';
import type { MemoryCategory } from './aiMemory.constants';

export interface SaveMemoryInput {
  category: MemoryCategory;
  key: string;
  value: string;
  confidence?: number;
}

/** Keyed by (category, key) — saving again with the same key updates the
 * existing entry (e.g. a changed preference) rather than duplicating it. */
export async function saveMemory(userId: string, input: SaveMemoryInput): Promise<AiMemoryEntry> {
  const entry: AiMemoryEntry = {
    category: input.category,
    key: input.key,
    value: input.value,
    confidence: input.confidence ?? 0.8,
  };

  const doc = await AiMemory.findOneAndUpdate(
    { userId, 'memories.category': entry.category, 'memories.key': entry.key },
    { $set: { 'memories.$.value': entry.value, 'memories.$.confidence': entry.confidence } },
    { new: true },
  );

  if (!doc) {
    await AiMemory.findOneAndUpdate(
      { userId },
      { $push: { memories: entry }, $setOnInsert: { userId } },
      { upsert: true },
    );
  }

  return entry;
}

export async function getMemories(userId: string): Promise<AiMemoryEntry[]> {
  const doc = await AiMemory.findOne({ userId }).lean();
  return doc?.memories ?? [];
}
