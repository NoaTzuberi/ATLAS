import { apiClient } from '../api/apiClient';
import type { OnboardingFormState } from '../../features/onboarding/types';

interface OnboardingProfilePayload {
  name?: string;
  age: number;
  height: number;
  weight: number;
  gender?: string;
  units: {
    weight: 'kg' | 'lb';
    distance: 'km' | 'miles';
  };
  goals: string[];
  trainingFrequency: {
    minDays: number;
    maxDays: number;
    flexibleSchedule: boolean;
  };
  preferredActivities: string[];
  exercisePreferences: {
    favoriteExerciseNotes?: string;
    improvementExerciseNotes?: string;
    muscleFocus: string[];
  };
  equipment: string[];
  recovery: {
    flags: string[];
    notes?: string;
  };
}

export async function saveOnboardingProfile(formState: OnboardingFormState) {
  const payload: OnboardingProfilePayload = {
    name: formState.name.trim() || undefined,
    age: Number(formState.age),
    height: Number(formState.height),
    weight: Number(formState.weight),
    gender: formState.gender.trim() || undefined,
    units: formState.units,
    goals: formState.goals,
    trainingFrequency: formState.trainingFrequency,
    preferredActivities: formState.preferredActivities,
    exercisePreferences: {
      favoriteExerciseNotes: formState.exercisePreferences.favoriteExerciseNotes.trim() || undefined,
      improvementExerciseNotes:
        formState.exercisePreferences.improvementExerciseNotes.trim() || undefined,
      muscleFocus: formState.exercisePreferences.muscleFocus,
    },
    equipment: formState.equipment,
    recovery: {
      flags: formState.recovery.flags,
      notes: formState.recovery.notes.trim() || undefined,
    },
  };

  const { data } = await apiClient.put('/users/profile', payload);
  return data;
}
