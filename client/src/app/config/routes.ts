export const ROUTES = {
  HOME: '/',
  SHOWCASE: '/showcase',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  WORKOUTS: '/workouts',
  WORKOUT_BUILDER: '/workouts/new',
  ONBOARDING: '/onboarding',
  EXERCISES: '/exercises',
} as const;

export const EXERCISE_DETAIL_PATH = '/exercises/:slug';

export function exercisePath(slug: string): string {
  return `/exercises/${slug}`;
}

export const WORKOUT_DETAIL_PATH = '/workouts/:id';
export const WORKOUT_EDIT_PATH = '/workouts/:id/edit';

export function workoutTemplatePath(id: string): string {
  return `/workouts/${id}`;
}

export function workoutEditPath(id: string): string {
  return `/workouts/${id}/edit`;
}
