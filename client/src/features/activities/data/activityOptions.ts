import type { ActivityType } from '../types';

export const ACTIVITY_TYPE_OPTIONS: { value: ActivityType; label: string; icon: string }[] = [
  { value: 'running', label: 'Running', icon: '🏃' },
  { value: 'surf', label: 'Surf', icon: '🏄' },
  { value: 'skate', label: 'Skate', icon: '🛹' },
  { value: 'boxing', label: 'Boxing', icon: '🥊' },
  { value: 'yoga', label: 'Yoga', icon: '🧘' },
];

const LABELS = new Map(ACTIVITY_TYPE_OPTIONS.map((option) => [option.value, option.label]));
const ICONS = new Map(ACTIVITY_TYPE_OPTIONS.map((option) => [option.value, option.icon]));

export function activityTypeLabel(value: string): string {
  return LABELS.get(value as ActivityType) ?? value;
}

export function activityTypeIcon(value: string): string {
  return ICONS.get(value as ActivityType) ?? '🏋';
}
