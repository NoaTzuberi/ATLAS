export const MEMORY_CATEGORY_IDS = ['preference', 'behavior', 'goal'] as const;
export type MemoryCategory = (typeof MEMORY_CATEGORY_IDS)[number];
