import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../../../components/layout/AppShell/AppShell';
import { Container } from '../../../../components/layout/Container/Container';
import { Section } from '../../../../components/layout/Section/Section';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { Input } from '../../../../components/common/Input/Input';
import { Select } from '../../../../components/common/Select/Select';
import { Button } from '../../../../components/common/Button/Button';
import { Spinner } from '../../../../components/common/Spinner/Spinner';
import { WorkoutChip } from '../../components/WorkoutChip/WorkoutChip';
import { ExercisePicker } from '../../components/ExercisePicker/ExercisePicker';
import { WorkoutExerciseRow } from '../../components/WorkoutExerciseRow/WorkoutExerciseRow';
import type { WorkoutExerciseRowValue } from '../../components/WorkoutExerciseRow/WorkoutExerciseRow';
import { WORKOUT_CATEGORY_OPTIONS, WORKOUT_GOAL_OPTIONS } from '../../data/workoutOptions';
import { DIFFICULTY_OPTIONS } from '../../../exercises/data/filterOptions';
import {
  getWorkoutTemplateById,
  createWorkoutTemplate,
  updateWorkoutTemplate,
} from '../../../../services/workouts/workoutTemplatesService';
import { ROUTES, workoutTemplatePath } from '../../../../app/config/routes';
import type { WorkoutCategory, WorkoutGoal } from '../../types';
import type { Difficulty } from '../../../exercises/types';
import './WorkoutBuilderPage.css';

export function WorkoutBuilderPage() {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string>();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WorkoutCategory | ''>('');
  const [goal, setGoal] = useState<WorkoutGoal[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [duration, setDuration] = useState<string>('');
  const [rows, setRows] = useState<WorkoutExerciseRowValue[]>([]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      try {
        const template = await getWorkoutTemplateById(id!);
        if (cancelled) return;
        setName(template.name);
        setDescription(template.description);
        setCategory(template.category ?? '');
        setGoal(template.goal);
        setDifficulty(template.difficulty ?? '');
        setDuration(template.duration ? String(template.duration) : '');
        setRows(
          template.exercises.map((entry) => ({
            exercise: entry.exercise,
            defaultSets: entry.defaultSets,
            defaultReps: entry.defaultReps,
            defaultWeight: entry.defaultWeight,
            restTime: entry.restTime,
          })),
        );
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Couldn't load this workout.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function toggleGoal(value: WorkoutGoal) {
    setGoal((prev) => (prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]));
  }

  function addExercise(exercise: WorkoutExerciseRowValue['exercise']) {
    setRows((prev) => [...prev, { exercise, defaultSets: 3, defaultReps: '10', restTime: 60 }]);
  }

  function updateRow(index: number, patch: Partial<WorkoutExerciseRowValue>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function moveRow(index: number, direction: -1 | 1) {
    setRows((prev) => {
      const next = [...prev];
      const target = index + direction;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!name.trim()) {
      setFormError('Name is required.');
      return;
    }
    if (rows.length === 0) {
      setFormError('Add at least one exercise.');
      return;
    }

    setFormError(undefined);
    setIsSaving(true);

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      goal,
      difficulty: difficulty || undefined,
      duration: duration ? Number(duration) : undefined,
      category: category || undefined,
      exercises: rows.map((row, index) => ({
        exerciseId: row.exercise.id,
        order: index + 1,
        defaultSets: row.defaultSets,
        defaultReps: row.defaultReps,
        defaultWeight: row.defaultWeight,
        restTime: row.restTime,
      })),
    };

    try {
      const saved = id ? await updateWorkoutTemplate(id, payload) : await createWorkoutTemplate(payload);
      navigate(workoutTemplatePath(saved.id));
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Couldn't save this workout.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <AppShell>
        <Section>
          <Container>
            <div className="workout-builder-loading">
              <Spinner size="lg" />
            </div>
          </Container>
        </Section>
      </AppShell>
    );
  }

  if (loadError) {
    return (
      <AppShell>
        <Section>
          <Container>
            <p className="workout-builder-error">{loadError}</p>
          </Container>
        </Section>
      </AppShell>
    );
  }

  const addedExerciseIds = new Set(rows.map((row) => row.exercise.id));

  return (
    <AppShell>
      <Section className="workout-builder-page">
        <Container>
          <h1 className="workout-builder-title">{isEditMode ? 'Edit Workout' : 'Create Workout'}</h1>

          <GlassCard className="workout-builder-card">
            <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} />

            <label className="workout-builder-field-label" htmlFor="workout-description">
              Description
            </label>
            <textarea
              id="workout-description"
              className="workout-builder-textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional description"
              rows={3}
            />

            <div className="workout-builder-row">
              <Select
                label="Category"
                placeholder="No category"
                value={category}
                onChange={(event) => setCategory(event.target.value as WorkoutCategory | '')}
                options={WORKOUT_CATEGORY_OPTIONS}
              />
              <Select
                label="Difficulty"
                placeholder="No difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value as Difficulty | '')}
                options={DIFFICULTY_OPTIONS}
              />
              <Input
                label="Duration (min)"
                type="number"
                min={1}
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              />
            </div>

            <div>
              <span className="workout-builder-field-label">Goal</span>
              <div className="workout-builder-chips">
                {WORKOUT_GOAL_OPTIONS.map((option) => (
                  <WorkoutChip
                    key={option.value}
                    label={option.label}
                    selected={goal.includes(option.value)}
                    onClick={() => toggleGoal(option.value)}
                  />
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="workout-builder-card">
            <h2>Add Exercises</h2>
            <ExercisePicker addedExerciseIds={addedExerciseIds} onAdd={addExercise} />
          </GlassCard>

          {rows.length > 0 && (
            <GlassCard className="workout-builder-card">
              <h2>Exercises ({rows.length})</h2>
              <div className="workout-builder-rows">
                {rows.map((row, index) => (
                  <WorkoutExerciseRow
                    key={row.exercise.id}
                    value={row}
                    isFirst={index === 0}
                    isLast={index === rows.length - 1}
                    onChange={(patch) => updateRow(index, patch)}
                    onMoveUp={() => moveRow(index, -1)}
                    onMoveDown={() => moveRow(index, 1)}
                    onRemove={() => removeRow(index)}
                  />
                ))}
              </div>
            </GlassCard>
          )}

          {formError && <p className="workout-builder-error">{formError}</p>}

          <div className="workout-builder-actions">
            <Button variant="ghost" onClick={() => navigate(ROUTES.WORKOUTS)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={isSaving}>
              Save Workout
            </Button>
          </div>
        </Container>
      </Section>
    </AppShell>
  );
}
