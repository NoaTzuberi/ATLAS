import { Badge } from '../../../../components/common/Badge/Badge';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { muscleLabel } from '../../../exercises/data/filterOptions';
import { estimateWorkoutMinutes } from '../../data/workoutEstimate';
import { collectCoveredMuscles } from '../../data/bodyRegions';
import { ExerciseCountIcon, DurationIcon } from '../icons';
import type { WorkoutExerciseRowValue } from '../WorkoutExerciseRow/WorkoutExerciseRow';
import './WorkoutSummaryCard.css';

interface WorkoutSummaryCardProps {
  rows: WorkoutExerciseRowValue[];
}

export function WorkoutSummaryCard({ rows }: WorkoutSummaryCardProps) {
  const exerciseCount = rows.length;
  const estimatedMinutes = estimateWorkoutMinutes(rows);
  const coveredMuscles = collectCoveredMuscles(rows);

  return (
    <GlassCard className="workout-summary-card">
      <span className="workout-summary-title">Workout Summary</span>

      <div className="workout-summary-stats">
        <div className="workout-summary-stat">
          <span className="workout-summary-stat-icon" aria-hidden="true">
            <ExerciseCountIcon />
          </span>
          <span key={exerciseCount} className="workout-summary-stat-value">
            {exerciseCount}
          </span>
          <span className="workout-summary-stat-label">{exerciseCount === 1 ? 'Exercise' : 'Exercises'}</span>
        </div>

        <div className="workout-summary-stat">
          <span className="workout-summary-stat-icon" aria-hidden="true">
            <DurationIcon />
          </span>
          <span key={estimatedMinutes} className="workout-summary-stat-value">
            ~{estimatedMinutes}
          </span>
          <span className="workout-summary-stat-label">Est. minutes</span>
        </div>
      </div>

      {coveredMuscles.length > 0 && (
        <div className="workout-summary-muscles">
          <span className="workout-summary-muscles-label">Muscles covered</span>
          <div className="workout-summary-muscle-chips">
            {coveredMuscles.map((muscle) => (
              <Badge key={muscle} variant="accent" className="workout-summary-muscle-chip">
                {muscleLabel(muscle)}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
