const ROUTINE_QUESTION_BY_GOAL: Record<string, string> = {
  build_muscle: 'Can you build me a routine focused on building muscle?',
  increase_strength: 'Can you build me a routine focused on getting stronger?',
  lose_weight: 'Can you build me a routine that supports fat loss?',
  improve_endurance: 'Can you build me a routine to build my endurance?',
};

const PROGRESS_QUESTION_BY_GOAL: Record<string, string> = {
  build_muscle: 'How do I know if I’m actually building muscle?',
  increase_strength: 'How do I know if my strength is actually improving?',
  lose_weight: 'How do I know I’m losing fat and not muscle?',
  improve_endurance: 'How do I know if my endurance is improving?',
};

const DEFAULT_ROUTINE_QUESTION = 'Can you build me a beginner routine based on my goals?';
const DEFAULT_PROGRESS_QUESTION = 'How do I know if I’m progressing?';

/** Starter questions shown on an empty conversation. The routine and progress
 * questions are tailored to the user's first stated onboarding goal when known. */
export function getSuggestedQuestions(goals: string[] | undefined): string[] {
  const primaryGoal = goals?.[0];

  return [
    'How should I structure my first week of training?',
    'What should I eat before and after a workout?',
    'How many rest days do I actually need?',
    (primaryGoal && ROUTINE_QUESTION_BY_GOAL[primaryGoal]) || DEFAULT_ROUTINE_QUESTION,
    (primaryGoal && PROGRESS_QUESTION_BY_GOAL[primaryGoal]) || DEFAULT_PROGRESS_QUESTION,
    "What's a good warm-up before lifting?",
  ];
}
