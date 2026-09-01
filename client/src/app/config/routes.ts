export const ROUTES = {
  HOME: '/',
  SHOWCASE: '/showcase',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
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
export const WORKOUT_SESSION_PATH = '/workouts/session/:id';
export const WORKOUT_SESSION_SUMMARY_PATH = '/workouts/session/:id/summary';

// `step` is a plain string here (not the feature's OnboardingStepId union) so this
// app-level config file stays free of any feature-level import — callers pass a
// valid step id and OnboardingPage itself validates it at render time.
export const ONBOARDING_EDIT_PATH = '/onboarding/:step';

export function onboardingEditPath(step: string): string {
  return `/onboarding/${step}`;
}

export function workoutTemplatePath(id: string): string {
  return `/workouts/${id}`;
}

export function workoutEditPath(id: string): string {
  return `/workouts/${id}/edit`;
}

export function workoutSessionPath(id: string): string {
  return `/workouts/session/${id}`;
}

export function workoutSessionSummaryPath(id: string): string {
  return `/workouts/session/${id}/summary`;
}
