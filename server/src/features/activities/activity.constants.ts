export const ACTIVITY_TYPE_IDS = ['running', 'surf', 'skate', 'boxing', 'yoga'] as const;
export type ActivityType = (typeof ACTIVITY_TYPE_IDS)[number];
