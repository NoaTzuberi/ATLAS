import { Badge } from '../../../../components/common/Badge/Badge';
import { workoutCategoryLabel, workoutGoalLabel, difficultyBadgeVariant } from '../../data/workoutOptions';
import { DIFFICULTY_OPTIONS } from '../../../exercises/data/filterOptions';
import type { WorkoutExerciseRowValue } from '../../components/WorkoutExerciseRow/WorkoutExerciseRow';
import type { WorkoutCategory, WorkoutGoal } from '../../types';
import type { Difficulty } from '../../../exercises/types';
import './ReviewWorkoutStep.css';

interface ReviewWorkoutStepProps {
  name: string;
  description: string;
  category: WorkoutCategory | '';
  difficulty: Difficulty | '';
  duration: string;
  goal: WorkoutGoal[];
  rows: WorkoutExerciseRowValue[];
}

export function ReviewWorkoutStep({
  name,
  description,
  category,
  difficulty,
  duration,
  goal,
  rows,
}: ReviewWorkoutStepProps) {
  return (
    <div className="workout-builder-step-fields">
      <div className="review-workout-header">
        <h3 className="review-workout-name">{name || 'Untitled workout'}</h3>
        {description && <p className="review-workout-description">{description}</p>}
      </div>

      <div className="review-workout-badges">
        {category && <Badge variant="neutral">{workoutCategoryLabel(category)}</Badge>}
        {difficulty && (
          <Badge variant={difficultyBadgeVariant(difficulty)}>
            {DIFFICULTY_OPTIONS.find((option) => option.value === difficulty)?.label ?? difficulty}
          </Badge>
        )}
        {duration && <Badge variant="neutral">{duration} min</Badge>}
        {goal.map((value) => (
          <Badge key={value} variant="accent">
            {workoutGoalLabel(value)}
          </Badge>
        ))}
      </div>

      <div className="review-workout-exercises">
        <span className="workout-builder-field-label">Exercises ({rows.length})</span>
        <ul className="review-workout-exercise-list">
          {rows.map((row) => (
            <li key={row.exercise.id} className="review-workout-exercise-item">
              <span className="review-workout-exercise-name">{row.exercise.name}</span>
              <span className="review-workout-exercise-detail">
                {row.defaultSets} × {row.defaultReps}
                {row.defaultWeight ? ` @ ${row.defaultWeight}kg` : ''}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
