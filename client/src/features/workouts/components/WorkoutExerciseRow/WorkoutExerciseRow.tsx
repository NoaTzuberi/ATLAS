import { Input } from '../../../../components/common/Input/Input';
import { Button } from '../../../../components/common/Button/Button';
import { ExerciseMedia } from '../../../exercises/components/ExerciseMedia/ExerciseMedia';
import type { ExerciseMediaFields } from '../../../exercises/types';
import './WorkoutExerciseRow.css';

/** Structurally satisfied by both PublicExercise (picker search results) and
 * WorkoutTemplateExerciseSummary (loaded from a saved template) — only the
 * fields this row actually renders. */
export interface WorkoutExerciseRowExercise {
  id: string;
  name: string;
  media: ExerciseMediaFields;
}

export interface WorkoutExerciseRowValue {
  exercise: WorkoutExerciseRowExercise;
  defaultSets: number;
  defaultReps: string;
  defaultWeight?: number;
  restTime?: number;
}

interface WorkoutExerciseRowProps {
  value: WorkoutExerciseRowValue;
  isFirst: boolean;
  isLast: boolean;
  onChange: (patch: Partial<WorkoutExerciseRowValue>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export function WorkoutExerciseRow({
  value,
  isFirst,
  isLast,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: WorkoutExerciseRowProps) {
  return (
    <div className="workout-exercise-row">
      <div className="workout-exercise-row-order">
        <button type="button" onClick={onMoveUp} disabled={isFirst} aria-label="Move up">
          &uarr;
        </button>
        <button type="button" onClick={onMoveDown} disabled={isLast} aria-label="Move down">
          &darr;
        </button>
      </div>

      <div className="workout-exercise-row-media">
        <ExerciseMedia media={value.exercise.media} alt={value.exercise.name} variant="card" />
      </div>

      <div className="workout-exercise-row-main">
        <span className="workout-exercise-row-name">{value.exercise.name}</span>

        <div className="workout-exercise-row-fields">
          <Input
            label="Sets"
            type="number"
            min={1}
            value={value.defaultSets}
            onChange={(event) => onChange({ defaultSets: Number(event.target.value) })}
          />
          <Input
            label="Reps"
            value={value.defaultReps}
            placeholder="e.g. 8-12"
            onChange={(event) => onChange({ defaultReps: event.target.value })}
          />
          <Input
            label="Weight (kg)"
            type="number"
            min={0}
            value={value.defaultWeight ?? ''}
            placeholder="optional"
            onChange={(event) =>
              onChange({ defaultWeight: event.target.value === '' ? undefined : Number(event.target.value) })
            }
          />
          <Input
            label="Rest (s)"
            type="number"
            min={0}
            value={value.restTime ?? ''}
            placeholder="optional"
            onChange={(event) =>
              onChange({ restTime: event.target.value === '' ? undefined : Number(event.target.value) })
            }
          />
        </div>
      </div>

      <Button variant="ghost" onClick={onRemove} aria-label="Remove exercise">
        Remove
      </Button>
    </div>
  );
}
