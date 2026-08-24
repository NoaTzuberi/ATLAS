import { apiClient } from '../api/apiClient';
import type { Activity, ActivityInput } from '../../features/activities/types';

export interface ListActivitiesParams {
  from?: string;
  to?: string;
  limit?: number;
}

export async function createActivity(input: ActivityInput): Promise<Activity> {
  const { data } = await apiClient.post<{ activity: Activity }>('/activities', input);
  return data.activity;
}

export async function listActivities(params: ListActivitiesParams = {}): Promise<Activity[]> {
  const { data } = await apiClient.get<{ items: Activity[] }>('/activities', { params });
  return data.items;
}

export async function deleteActivity(id: string): Promise<void> {
  await apiClient.delete(`/activities/${id}`);
}
