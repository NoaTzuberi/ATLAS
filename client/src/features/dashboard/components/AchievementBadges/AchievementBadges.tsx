import { useEffect, useRef, useState } from 'react';
import { FlagIcon, FlameIcon, StarIcon, TrophyIcon, LockIcon } from '../icons';
import { useStaggerReveal } from '../../../../hooks/useStaggerReveal';
import type { DashboardSummary } from '../../types';
import './AchievementBadges.css';

interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isEarned: (summary: DashboardSummary) => boolean;
}

const BADGES: BadgeDefinition[] = [
  {
    id: 'first-workout',
    name: 'First Workout',
    description: 'Complete your first workout',
    icon: <FlagIcon />,
    isEarned: (summary) => summary.totalWorkouts >= 1,
  },
  {
    id: 'seven-day-streak',
    name: '7-Day Streak',
    description: 'Train 7 days in a row',
    icon: <FlameIcon />,
    isEarned: (summary) => summary.streak >= 7,
  },
  {
    id: 'first-pr',
    name: 'First PR',
    description: 'Set your first personal record',
    icon: <StarIcon />,
    isEarned: (summary) => summary.recentPersonalRecords.length >= 1,
  },
  {
    id: 'ten-workouts',
    name: '10 Workouts',
    description: 'Complete 10 workouts',
    icon: <TrophyIcon />,
    isEarned: (summary) => summary.totalWorkouts >= 10,
  },
];

interface AchievementBadgesProps {
  summary: DashboardSummary;
}

export function AchievementBadges({ summary }: AchievementBadgesProps) {
  const gridRef = useStaggerReveal<HTMLDivElement>([summary]);
  const previousEarnedRef = useRef<Set<string>>();
  const [justEarnedIds, setJustEarnedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentlyEarned = new Set(BADGES.filter((badge) => badge.isEarned(summary)).map((badge) => badge.id));
    const previouslyEarned = previousEarnedRef.current;

    if (previouslyEarned) {
      const newlyEarned = new Set(
        [...currentlyEarned].filter((id) => !previouslyEarned.has(id)),
      );
      if (newlyEarned.size > 0) {
        setJustEarnedIds(newlyEarned);
      }
    }

    previousEarnedRef.current = currentlyEarned;
  }, [summary]);

  return (
    <div className="achievements-grid" ref={gridRef}>
      {BADGES.map((badge) => {
        const earned = badge.isEarned(summary);
        const justEarned = justEarnedIds.has(badge.id);

        return (
          <div
            key={badge.id}
            className={
              'badge-tile' +
              (earned ? ' badge-tile-earned' : ' badge-tile-locked') +
              (justEarned ? ' badge-tile-just-earned' : '')
            }
            tabIndex={0}
          >
            <span className="badge-tile-icon">{badge.icon}</span>
            <span className="badge-tile-name">{badge.name}</span>
            {!earned && (
              <span className="badge-tile-lock" aria-hidden="true">
                <LockIcon />
              </span>
            )}
            <span className="badge-tile-tooltip" role="tooltip">
              {earned ? 'Unlocked' : badge.description}
            </span>
          </div>
        );
      })}
    </div>
  );
}
