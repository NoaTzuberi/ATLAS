import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../../../components/layout/PageLayout/PageLayout';
import { Container } from '../../../../components/layout/Container/Container';
import { Section } from '../../../../components/layout/Section/Section';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { Button } from '../../../../components/common/Button/Button';
import { OnboardingProgress } from '../../components/OnboardingProgress/OnboardingProgress';
import { StepVideoBackground } from '../../components/StepVideoBackground/StepVideoBackground';
import { WelcomeStep } from '../../steps/WelcomeStep/WelcomeStep';
import { BasicProfileStep } from '../../steps/BasicProfileStep/BasicProfileStep';
import { GoalsStep } from '../../steps/GoalsStep/GoalsStep';
import { FrequencyStep } from '../../steps/FrequencyStep/FrequencyStep';
import { ActivitiesStep } from '../../steps/ActivitiesStep/ActivitiesStep';
import { ExercisePreferencesStep } from '../../steps/ExercisePreferencesStep/ExercisePreferencesStep';
import { RecoveryStep } from '../../steps/RecoveryStep/RecoveryStep';
import { EquipmentStep } from '../../steps/EquipmentStep/EquipmentStep';
import { ReviewStep } from '../../steps/ReviewStep/ReviewStep';
import { INITIAL_ONBOARDING_STATE } from '../../types';
import type { OnboardingFormState } from '../../types';
import { saveOnboardingProfile } from '../../../../services/onboarding/onboardingService';
import { useAuth } from '../../../../services/auth/AuthContext';
import { ROUTES } from '../../../../app/config/routes';
import { STEP_VIDEO_MAP } from '../../data/stepVideoMap';
import type { OnboardingStepId } from '../../data/stepVideoMap';
import { ACTIVITY_VIDEO_MAP } from '../../data/activityVideoMap';
import './OnboardingPage.css';

const STEP_COUNT = 9;
const EXERCISE_PREFERENCES_STEP_INDEX = 5;
const ACTIVITIES_STEP_INDEX = 4;

const STEP_IDS: OnboardingStepId[] = [
  'welcome',
  'basic_profile',
  'goals',
  'frequency',
  'activities',
  'exercise_preferences',
  'recovery',
  'equipment',
  'review',
];

function isStepValid(index: number, state: OnboardingFormState): boolean {
  switch (index) {
    case 1:
      return (
        state.name.trim().length > 0 &&
        state.age !== '' &&
        state.height !== '' &&
        state.weight !== ''
      );
    case 2:
      return state.goals.length > 0;
    case 4:
      return state.preferredActivities.length > 0;
    case 7:
      return state.equipment.length > 0;
    default:
      return true;
  }
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [formState, setFormState] = useState<OnboardingFormState>(() => ({
    ...INITIAL_ONBOARDING_STATE,
    name: user?.name ?? '',
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const [previewActivityId, setPreviewActivityId] = useState<string | null>(null);

  const currentStepId = STEP_IDS[stepIndex];
  const activityVideo =
    stepIndex === ACTIVITIES_STEP_INDEX && previewActivityId
      ? ACTIVITY_VIDEO_MAP[previewActivityId]
      : undefined;
  const videoSrc = activityVideo ?? STEP_VIDEO_MAP[currentStepId];

  function updateFormState(patch: Partial<OnboardingFormState>) {
    setFormState((prev) => ({ ...prev, ...patch }));
  }

  async function handleContinue() {
    if (stepIndex === STEP_COUNT - 1) {
      setSubmitError(undefined);
      setIsSubmitting(true);
      try {
        const { user: savedUser } = await saveOnboardingProfile(formState);
        updateUser({ name: savedUser.name, onboardingCompleted: savedUser.onboardingCompleted });
        navigate(ROUTES.DASHBOARD);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'Could not save your profile. Please try again.',
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setStepIndex((index) => index + 1);
  }

  function handleBack() {
    setStepIndex((index) => Math.max(0, index - 1));
  }

  function handleSkip() {
    setStepIndex((index) => index + 1);
  }

  const steps = [
    <WelcomeStep key="welcome" />,
    <BasicProfileStep key="basic" formState={formState} updateFormState={updateFormState} />,
    <GoalsStep key="goals" formState={formState} updateFormState={updateFormState} />,
    <FrequencyStep key="frequency" formState={formState} updateFormState={updateFormState} />,
    <ActivitiesStep
      key="activities"
      formState={formState}
      updateFormState={updateFormState}
      onPreviewActivity={setPreviewActivityId}
    />,
    <ExercisePreferencesStep
      key="exercise-preferences"
      formState={formState}
      updateFormState={updateFormState}
    />,
    <RecoveryStep key="recovery" formState={formState} updateFormState={updateFormState} />,
    <EquipmentStep key="equipment" formState={formState} updateFormState={updateFormState} />,
    <ReviewStep key="review" />,
  ];

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEP_COUNT - 1;
  const showSkip = stepIndex === EXERCISE_PREFERENCES_STEP_INDEX;
  const continueLabel = isFirstStep ? 'Start' : isLastStep ? 'Create my profile' : 'Continue';

  return (
    <PageLayout>
      <Section>
        <Container>
          <GlassCard className="onboarding-card">
            <StepVideoBackground videoSrc={videoSrc} />
            <div className="onboarding-card-content">
              <OnboardingProgress currentStep={stepIndex + 1} totalSteps={STEP_COUNT} />

              <div className="onboarding-step-scroll">
                {steps[stepIndex]}

                {submitError && <p className="onboarding-error">{submitError}</p>}
              </div>

              <div className="onboarding-nav">
                {!isFirstStep && (
                  <Button variant="secondary" onClick={handleBack} disabled={isSubmitting}>
                    Back
                  </Button>
                )}
                <div className="onboarding-nav-spacer" />
                {showSkip && (
                  <Button variant="ghost" onClick={handleSkip} disabled={isSubmitting}>
                    Skip for now
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={handleContinue}
                  loading={isSubmitting}
                  disabled={!isStepValid(stepIndex, formState)}
                >
                  {continueLabel}
                </Button>
              </div>
            </div>
          </GlassCard>
        </Container>
      </Section>
    </PageLayout>
  );
}
