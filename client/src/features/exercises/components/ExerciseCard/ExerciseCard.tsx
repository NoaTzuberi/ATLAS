import { Link, useLocation } from 'react-router-dom';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { Badge } from '../../../../components/common/Badge/Badge';
import { ExerciseMedia } from '../ExerciseMedia/ExerciseMedia';
import { muscleLabel, equipmentLabel } from '../../data/filterOptions';
import { exercisePath } from '../../../../app/config/routes';
import type { PublicExercise } from '../../types';
import './ExerciseCard.css';

const MAX_VISIBLE_TAGS = 2;

function visibleTags(values: string[], labelFor: (value: string) => string): string[] {
  const labels = values.map(labelFor);
  if (labels.length <= MAX_VISIBLE_TAGS) {
    return labels;
  }
  return [...labels.slice(0, MAX_VISIBLE_TAGS), `+${labels.length - MAX_VISIBLE_TAGS} more`];
}

interface ExerciseCardProps {
  exercise: PublicExercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const location = useLocation();
  const muscleTags = visibleTags(exercise.primaryMuscles, muscleLabel);
  const equipmentTags = visibleTags(exercise.equipment, equipmentLabel);

  const isEnhanced = exercise.contentTier === 'enhanced';

  return (
    <Link
      to={exercisePath(exercise.slug)}
      state={{ backgroundLocation: location }}
      className="exercise-card-link"
    >
      <GlassCard className="exercise-card">
        <div className="exercise-card-media-wrap">
          <ExerciseMedia media={exercise.media} alt={exercise.name} variant="card" />
          {isEnhanced && <span className="exercise-card-enhanced-badge">Enhanced</span>}
        </div>
        <h3 className="exercise-card-name">{exercise.name}</h3>
        <div className="exercise-card-tags">
          {muscleTags.map((tag) => (
            <Badge key={`muscle-${tag}`} variant="accent">
              {tag}
            </Badge>
          ))}
          {equipmentTags.map((tag) => (
            <Badge key={`equipment-${tag}`}>{tag}</Badge>
          ))}
          <Badge variant="achievement">{exercise.difficulty}</Badge>
        </div>
      </GlassCard>
    </Link>
  );
}
