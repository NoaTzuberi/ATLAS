import { Link, useLocation } from 'react-router-dom';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { Badge } from '../../../../components/common/Badge/Badge';
import { workoutTemplatePath } from '../../../../app/config/routes';
import { workoutCategoryLabel } from '../../data/workoutOptions';
import type { WorkoutTemplate } from '../../types';
import './TemplateCard.css';

interface TemplateCardProps {
  template: WorkoutTemplate;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const location = useLocation();

  return (
    <Link
      to={workoutTemplatePath(template.id)}
      state={{ backgroundLocation: location }}
      className="template-card-link"
    >
      <GlassCard className="template-card">
        <div className="template-card-header">
          {template.category && <Badge variant="accent">{workoutCategoryLabel(template.category)}</Badge>}
          {!template.isSystemTemplate && <span className="template-card-mine-badge">Mine</span>}
        </div>
        <h3 className="template-card-name">{template.name}</h3>
        {template.description && <p className="template-card-description text-body">{template.description}</p>}
        <div className="template-card-meta">
          <span>{template.exercises.length} exercises</span>
          {template.duration && <span>{template.duration} min</span>}
          {template.difficulty && <Badge variant="achievement">{template.difficulty}</Badge>}
        </div>
      </GlassCard>
    </Link>
  );
}
