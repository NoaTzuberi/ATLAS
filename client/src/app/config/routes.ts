export const ROUTES = {
  HOME: '/',
  SHOWCASE: '/showcase',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  WORKOUTS: '/workouts',
  ONBOARDING: '/onboarding',
  EXERCISES: '/exercises',
} as const;

export const EXERCISE_DETAIL_PATH = '/exercises/:slug';

export function exercisePath(slug: string): string {
  return `/exercises/${slug}`;
}
