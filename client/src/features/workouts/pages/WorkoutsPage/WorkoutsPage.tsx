import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../../../components/layout/PageLayout/PageLayout';
import { Container } from '../../../../components/layout/Container/Container';
import { Section } from '../../../../components/layout/Section/Section';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { Spinner } from '../../../../components/common/Spinner/Spinner';
import { Button } from '../../../../components/common/Button/Button';
import { WorkoutChip } from '../../components/WorkoutChip/WorkoutChip';
import { TemplateCard } from '../../components/TemplateCard/TemplateCard';
import { WORKOUT_CATEGORY_OPTIONS } from '../../data/workoutOptions';
import { listWorkoutTemplates } from '../../../../services/workouts/workoutTemplatesService';
import { getActiveWorkout } from '../../../../services/workouts/workoutSessionService';
import { ROUTES, workoutSessionPath } from '../../../../app/config/routes';
import { useStaggerReveal } from '../../../../hooks/useStaggerReveal';
import type { WorkoutCategory, WorkoutTemplate, WorkoutSession } from '../../types';
import './WorkoutsPage.css';

export function WorkoutsPage() {
  const [category, setCategory] = useState<WorkoutCategory | undefined>(undefined);
  const [mineOnly, setMineOnly] = useState(false);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
  const gridRef = useStaggerReveal<HTMLDivElement>([templates]);

  useEffect(() => {
    getActiveWorkout().then(setActiveWorkout);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setLoadError(undefined);
      try {
        const data = await listWorkoutTemplates({ category, mine: mineOnly });
        if (!cancelled) setTemplates(data);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Couldn't load workouts. Please try again.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [category, mineOnly]);

  return (
    <PageLayout>
      <Section className="workouts-page">
        <Container>
          <div className="workouts-page-header">
            <div>
              <h1 className="workouts-page-title">Workouts</h1>
              <p className="text-body workouts-page-subtitle">
                Browse ready-made workouts or build your own.
              </p>
            </div>
            <Link to={ROUTES.WORKOUT_BUILDER}>
              <Button>Create Workout</Button>
            </Link>
          </div>

          {activeWorkout && (
            <GlassCard className="workouts-page-resume-banner">
              <span>Workout in progress: {activeWorkout.name}</span>
              <Link to={workoutSessionPath(activeWorkout.id)}>
                <Button variant="secondary">Resume</Button>
              </Link>
            </GlassCard>
          )}

          <GlassCard className="workouts-page-toolbar">
            <div className="workouts-page-chips">
              <WorkoutChip
                label="All"
                selected={category === undefined}
                onClick={() => setCategory(undefined)}
              />
              {WORKOUT_CATEGORY_OPTIONS.map((option) => (
                <WorkoutChip
                  key={option.value}
                  label={option.label}
                  selected={category === option.value}
                  onClick={() => setCategory(category === option.value ? undefined : option.value)}
                />
              ))}
            </div>
            <WorkoutChip label="My Workouts" selected={mineOnly} onClick={() => setMineOnly((v) => !v)} />
          </GlassCard>

          {isLoading && (
            <div className="workouts-page-loading">
              <Spinner size="lg" />
            </div>
          )}

          {!isLoading && loadError && <p className="workouts-page-error">{loadError}</p>}

          {!isLoading && !loadError && templates.length === 0 && (
            <GlassCard className="workouts-page-empty">
              <h2>{mineOnly ? "You haven't created any workouts yet." : 'No workouts match this filter.'}</h2>
              <Link to={ROUTES.WORKOUT_BUILDER}>
                <Button>Create Workout</Button>
              </Link>
            </GlassCard>
          )}

          {!isLoading && !loadError && templates.length > 0 && (
            <div className="workouts-page-grid" ref={gridRef}>
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </PageLayout>
  );
}
