import type { WorkoutGoal, WorkoutTemplate } from '../types';

/** Only onboarding goals with a clean semantic match to a workout-template goal get
 * personalized here — others (improve_health, move_better, etc.) fall through to the
 * "recently added" placeholder rather than forcing a weak/confusing match. */
const GOAL_MATCH: Partial<Record<string, { workoutGoal: WorkoutGoal; phrase: string }>> = {
  build_muscle: { workoutGoal: 'hypertrophy', phrase: 'muscle-building goal' },
  increase_strength: { workoutGoal: 'strength', phrase: 'strength goal' },
  lose_weight: { workoutGoal: 'endurance', phrase: 'fat-loss goal' },
  improve_endurance: { workoutGoal: 'endurance', phrase: 'endurance goal' },
};

export interface RecommendedWorkout {
  template: WorkoutTemplate;
  reason?: string;
  isPersonalized: boolean;
}

/** Picks a featured workout: the first template matching the user's stated goals,
 * falling back to the most recently added template when there's no goal match
 * (no onboarding profile, or a goal with no clean template-goal equivalent). */
export function getRecommendedTemplate(
  templates: WorkoutTemplate[],
  onboardingGoals: string[] | undefined,
): RecommendedWorkout | null {
  if (templates.length === 0) return null;

  for (const goalId of onboardingGoals ?? []) {
    const match = GOAL_MATCH[goalId];
    if (!match) continue;
    const template = templates.find((t) => t.goal.includes(match.workoutGoal));
    if (template) {
      return { template, reason: `Matches your ${match.phrase}`, isPersonalized: true };
    }
  }

  const mostRecent = [...templates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];
  return { template: mostRecent, isPersonalized: false };
}
