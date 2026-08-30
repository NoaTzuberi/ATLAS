import { Link, useLocation } from 'react-router-dom';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { Badge } from '../../../../components/common/Badge/Badge';
import { CategoryBadge } from '../CategoryBadge/CategoryBadge';
import { workoutTemplatePath } from '../../../../app/config/routes';
import { difficultyBadgeVariant } from '../../data/workoutOptions';
import { getCategoryVisual } from '../../data/categoryVisuals';
import type { WorkoutTemplate } from '../../types';
import './TemplateCard.css';

const NEW_THRESHOLD_MS = 24 * 60 * 60 * 1000;

interface TemplateCardProps {
  template: WorkoutTemplate;
  /** Number of times this user has completed this template. Omit/0 renders no indicator — never fabricated. */
  completionCount?: number;
}

export function TemplateCard({ template, completionCount }: TemplateCardProps) {
  const location = useLocation();
  const isNew = template.isOwner && Date.now() - new Date(template.createdAt).getTime() < NEW_THRESHOLD_MS;
  const { coverImage, Icon } = getCategoryVisual(template.category);

  return (
    <Link
      to={workoutTemplatePath(template.id)}
      state={{ backgroundLocation: location }}
      className="template-card-link"
    >
      <GlassCard className={'template-card' + (isNew ? ' template-card-new' : '')}>
        <div className="template-card-cover" style={{ backgroundImage: `url(${coverImage})` }}>
          {template.category && (
            <CategoryBadge
              category={template.category}
              icon={<Icon />}
              className="template-card-cover-badge"
            />
          )}
          {completionCount ? (
            <span className="template-card-completion-badge">
              <CheckIcon />
              Completed {completionCount}x
            </span>
          ) : null}
        </div>
        <div className="template-card-body">
          {(!template.isSystemTemplate || isNew) && (
            <div className="template-card-header">
              {!template.isSystemTemplate && <span className="template-card-mine-badge">Mine</span>}
              {isNew && <span className="template-card-new-badge">New</span>}
            </div>
          )}
          <h3 className="template-card-name">{template.name}</h3>
          {template.description && <p className="template-card-description text-body">{template.description}</p>}
          <div className="template-card-meta">
            <span>{template.exercises.length} exercises</span>
            {template.duration && <span>{template.duration} min</span>}
            {template.difficulty && (
              <Badge variant={difficultyBadgeVariant(template.difficulty)}>{template.difficulty}</Badge>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12L10 18L20 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
