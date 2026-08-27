import { useEffect, useRef, useState } from 'react';
import { FlagIcon, FlameIcon, StarIcon, TrophyIcon, ScaleIcon, CompassIcon, LockIcon } from '../icons';
import { useStaggerReveal } from '../../../../hooks/useStaggerReveal';
import { listActivities } from '../../../../services/activities/activityService';
import type { DashboardSummary } from '../../types';
import './AchievementBadges.css';

interface BadgeProgress {
  current: number;
  target: number;
  unitLabel: string;
}

interface BadgeContext {
  summary: DashboardSummary;
  activityTypeCount: number;
}

interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  getProgress: (ctx: BadgeContext) => BadgeProgress;
}

const BADGES: BadgeDefinition[] = [
  {
    id: 'first-workout',
    name: 'First Workout',
    description: 'Complete your first workout',
    icon: <FlagIcon />,
    getProgress: ({ summary }) => ({ current: Math.min(summary.totalWorkouts, 1), target: 1, unitLabel: 'workout' }),
  },
  {
    id: 'seven-day-streak',
    name: '7-Day Streak',
    description: 'Train 7 days in a row',
    icon: <FlameIcon />,
    getProgress: ({ summary }) => ({ current: Math.min(summary.streak, 7), target: 7, unitLabel: 'days' }),
  },
  {
    id: 'first-pr',
    name: 'First PR',
    description: 'Set your first personal record',
    icon: <StarIcon />,
    getProgress: ({ summary }) => ({
      current: Math.min(summary.recentPersonalRecords.length, 1),
      target: 1,
      unitLabel: 'PR',
    }),
  },
  {
    id: 'ten-workouts',
    name: '10 Workouts',
    description: 'Complete 10 workouts',
    icon: <TrophyIcon />,
    getProgress: ({ summary }) => ({ current: Math.min(summary.totalWorkouts, 10), target: 10, unitLabel: 'workouts' }),
  },
  {
    id: 'thirty-day-streak',
    name: '30-Day Streak',
    description: 'Train 30 days in a row',
    icon: <FlameIcon />,
    getProgress: ({ summary }) => ({ current: Math.min(summary.streak, 30), target: 30, unitLabel: 'days' }),
  },
  {
    id: 'fifty-workouts',
    name: '50 Workouts',
    description: 'Complete 50 workouts',
    icon: <TrophyIcon />,
    getProgress: ({ summary }) => ({ current: Math.min(summary.totalWorkouts, 50), target: 50, unitLabel: 'workouts' }),
  },
  {
    id: 'hundred-workouts',
    name: '100 Workouts',
    description: 'Complete 100 workouts',
    icon: <TrophyIcon />,
    getProgress: ({ summary }) => ({
      current: Math.min(summary.totalWorkouts, 100),
      target: 100,
      unitLabel: 'workouts',
    }),
  },
  {
    id: 'first-weigh-in',
    name: 'First Weigh-In',
    description: 'Log your weight for the first time',
    icon: <ScaleIcon />,
    getProgress: ({ summary }) => ({
      current: summary.latestWeight !== undefined ? 1 : 0,
      target: 1,
      unitLabel: 'entry',
    }),
  },
  {
    id: 'multi-sport',
    name: 'Multi-Sport',
    description: 'Log 3 different activity types',
    icon: <CompassIcon />,
    getProgress: ({ activityTypeCount }) => ({
      current: Math.min(activityTypeCount, 3),
      target: 3,
      unitLabel: 'activity types',
    }),
  },
];

interface AchievementBadgesProps {
  summary: DashboardSummary;
}

export function AchievementBadges({ summary }: AchievementBadgesProps) {
  const gridRef = useStaggerReveal<HTMLDivElement>([summary]);
  const previousEarnedRef = useRef<Set<string>>();
  const [justEarnedIds, setJustEarnedIds] = useState<Set<string>>(new Set());
  const [activityTypeCount, setActivityTypeCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    listActivities({ limit: 200 })
      .then((activities) => {
        if (cancelled) return;
        setActivityTypeCount(new Set(activities.map((activity) => activity.type)).size);
      })
      .catch(() => {
        // Multi-Sport progress just stays at 0 if activities can't be loaded.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const ctx: BadgeContext = { summary, activityTypeCount };
    const currentlyEarned = new Set(
      BADGES.filter((badge) => {
        const { current, target } = badge.getProgress(ctx);
        return current >= target;
      }).map((badge) => badge.id),
    );
    const previouslyEarned = previousEarnedRef.current;

    if (previouslyEarned) {
      const newlyEarned = new Set([...currentlyEarned].filter((id) => !previouslyEarned.has(id)));
      if (newlyEarned.size > 0) {
        setJustEarnedIds(newlyEarned);
      }
    }

    previousEarnedRef.current = currentlyEarned;
  }, [summary, activityTypeCount]);

  return (
    <div className="achievements-grid" ref={gridRef}>
      {BADGES.map((badge) => {
        const { current, target, unitLabel } = badge.getProgress({ summary, activityTypeCount });
        const earned = current >= target;
        const justEarned = justEarnedIds.has(badge.id);
        const progressPct = Math.min(100, (current / target) * 100);

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
              <>
                <span className="badge-tile-progress-text">
                  {current}/{target} {unitLabel}
                </span>
                <span className="badge-tile-lock" aria-hidden="true">
                  <LockIcon />
                </span>
                <div className="badge-tile-progress-track" aria-hidden="true">
                  <div className="badge-tile-progress-fill" style={{ width: `${progressPct}%` }} />
                </div>
              </>
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
