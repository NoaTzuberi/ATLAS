import { Link, useLocation } from 'react-router-dom';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { Badge } from '../../../../components/common/Badge/Badge';
import { ExerciseMedia } from '../ExerciseMedia/ExerciseMedia';
import { muscleLabel, equipmentLabel, equipmentIcon, muscleTagHue } from '../../data/filterOptions';
import { SparkleIcon } from '../icons';
import { exercisePath } from '../../../../app/config/routes';
import type { PublicExercise } from '../../types';
import './ExerciseCard.css';

const MAX_VISIBLE_EQUIPMENT_TAGS = 2;

interface ExerciseCardProps {
  exercise: PublicExercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const location = useLocation();
  const primaryMuscle = exercise.primaryMuscles[0];
  const equipmentTags = exercise.equipment.slice(0, MAX_VISIBLE_EQUIPMENT_TAGS);
  const extraEquipmentCount = exercise.equipment.length - equipmentTags.length;

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
          {isEnhanced && (
            <span className="exercise-card-enhanced-badge">
              <SparkleIcon />
              Enhanced
            </span>
          )}
        </div>
        <div className="exercise-card-body">
          <h3 className="exercise-card-name">{exercise.name}</h3>
          <div className="exercise-card-tags">
            {primaryMuscle && (
              <span className={`exercise-card-muscle-tag exercise-card-muscle-tag-${muscleTagHue(primaryMuscle)}`}>
                {muscleLabel(primaryMuscle)}
              </span>
            )}
            {equipmentTags.map((tag) => {
              const Icon = equipmentIcon(tag);
              return (
                <span key={`equipment-${tag}`} className="exercise-card-equipment-tag">
                  {Icon && (
                    <span className="exercise-card-equipment-icon" aria-hidden="true">
                      <Icon />
                    </span>
                  )}
                  {equipmentLabel(tag)}
                </span>
              );
            })}
            {extraEquipmentCount > 0 && (
              <span className="exercise-card-equipment-tag">+{extraEquipmentCount} more</span>
            )}
            <Badge variant="achievement">{exercise.difficulty}</Badge>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
