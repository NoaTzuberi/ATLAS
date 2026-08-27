import { useEffect, useState } from 'react';
import { AppShell } from '../../../../components/layout/AppShell/AppShell';
import { Container } from '../../../../components/layout/Container/Container';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { Spinner } from '../../../../components/common/Spinner/Spinner';
import { Button } from '../../../../components/common/Button/Button';
import { Modal } from '../../../../components/common/Modal/Modal';
import { Input } from '../../../../components/common/Input/Input';
import { getDashboardSummary } from '../../../../services/dashboard/dashboardService';
import { createProgressEntry } from '../../../../services/progress/progressService';
import { useAuth } from '../../../../services/auth/AuthContext';
import { useStaggerReveal } from '../../../../hooks/useStaggerReveal';
import { usePrevious } from '../../../../hooks/usePrevious';
import { ProgressRing } from '../../components/ProgressRing/ProgressRing';
import { AchievementBadges } from '../../components/AchievementBadges/AchievementBadges';
import { FlameIcon, CalendarIcon, TrophyIcon, ScaleIcon, RepeatIcon } from '../../components/icons';
import type { DashboardSummary, WeightTrendPoint } from '../../types';
import './DashboardPage.css';

const WEEKLY_GOAL = 3;
const WORKOUT_MILESTONES = [10, 25, 50, 100, 250, 500];
const STREAK_RING_TARGET = 7;
const WEIGHT_CHART_WIDTH = 400;
const WEIGHT_CHART_HEIGHT = 100;

function getNextMilestone(total: number): number {
  return WORKOUT_MILESTONES.find((milestone) => milestone > total) ?? total + 50;
}

function formatPrValue(type: 'weight' | 'reps', value: number): string {
  return type === 'weight' ? `${value}kg` : `${value} reps`;
}

function formatRelativeDate(dateStr: string): string {
  const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(dateStr).toLocaleDateString();
}

function buildWeightChartPoints(points: WeightTrendPoint[]): string {
  const weights = points.map((p) => p.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;
  const stepX = WEIGHT_CHART_WIDTH / (points.length - 1);

  return points
    .map((point, index) => {
      const x = index * stepX;
      const y = WEIGHT_CHART_HEIGHT - ((point.weight - min) / range) * (WEIGHT_CHART_HEIGHT - 16) - 8;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();
  const [isLogWeightOpen, setIsLogWeightOpen] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const bentoRef = useStaggerReveal<HTMLDivElement>([summary]);
  const previousSummary = usePrevious(summary);

  async function loadSummary() {
    setIsLoading(true);
    setLoadError(undefined);
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Couldn't load your dashboard.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  async function handleLogWeight() {
    const weight = Number(weightInput);
    if (!weightInput || Number.isNaN(weight) || weight <= 0) {
      setSaveError('Enter a valid weight.');
      return;
    }

    setIsSaving(true);
    setSaveError(undefined);
    try {
      await createProgressEntry({ weight });
      setIsLogWeightOpen(false);
      setWeightInput('');
      await loadSummary();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Couldn't save this entry.");
    } finally {
      setIsSaving(false);
    }
  }

  const nextMilestone = summary ? getNextMilestone(summary.totalWorkouts) : WORKOUT_MILESTONES[0];
  const streakChanged = previousSummary && summary && previousSummary.streak !== summary.streak;
  const totalWorkoutsChanged =
    previousSummary && summary && previousSummary.totalWorkouts !== summary.totalWorkouts;
  const weekChanged =
    previousSummary && summary && previousSummary.workoutsLast7Days !== summary.workoutsLast7Days;
  const initial = user?.name?.trim().charAt(0).toUpperCase() ?? '?';
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <AppShell>
      <Container>
        <div className="dashboard-page">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="text-body dashboard-subtitle">Your training at a glance.</p>
            </div>
            <Button onClick={() => setIsLogWeightOpen(true)}>Log Weight</Button>
          </div>

          {isLoading && (
            <div className="dashboard-loading">
              <Spinner size="lg" />
            </div>
          )}

          {!isLoading && loadError && <p className="dashboard-error">{loadError}</p>}

          {!isLoading && !loadError && summary && (
            <>
              <div className="welcome-banner">
                <span className="welcome-banner-avatar" aria-hidden="true">
                  {initial}
                </span>
                <div className="welcome-banner-text">
                  <span className="welcome-banner-greeting">Welcome back, {firstName}</span>
                </div>
                <div className="welcome-banner-streak">
                  <FlameIcon />
                  <span>
                    {summary.streak} day{summary.streak === 1 ? '' : 's'} streak
                  </span>
                </div>
              </div>

              <div className="bento-grid" ref={bentoRef}>
                <GlassCard className="bento-tile bento-tile-streak">
                  <div className="dashboard-stat-hero-glow" aria-hidden="true" />
                  <ProgressRing
                    key={`streak-${summary.streak}`}
                    progress={summary.streak / STREAK_RING_TARGET}
                    size={96}
                    strokeWidth={6}
                    glow
                    className={streakChanged ? 'progress-ring-just-updated' : undefined}
                  >
                    <FlameIcon />
                  </ProgressRing>
                  <span className="dashboard-stat-value dashboard-stat-value-hero">{summary.streak}</span>
                  <span className="dashboard-stat-label">Day Streak</span>
                  {summary.streak === 0 && (
                    <span className="dashboard-stat-microcopy">Start your streak today</span>
                  )}
                </GlassCard>

                <GlassCard className="bento-tile bento-tile-week">
                  <span className="dashboard-stat-badge" aria-hidden="true">
                    <CalendarIcon />
                  </span>
                  <div
                    key={`week-${summary.workoutsLast7Days}`}
                    className={'dashboard-week-dots' + (weekChanged ? ' dashboard-stat-just-updated' : '')}
                    aria-hidden="true"
                  >
                    {Array.from({ length: WEEKLY_GOAL }).map((_, index) => (
                      <span
                        key={index}
                        className={
                          'dashboard-week-dot' +
                          (index < summary.workoutsLast7Days ? ' dashboard-week-dot-filled' : '')
                        }
                      />
                    ))}
                  </div>
                  <span className="dashboard-stat-value">
                    {summary.workoutsLast7Days}/{WEEKLY_GOAL}
                  </span>
                  <span className="dashboard-stat-label">This Week</span>
                </GlassCard>

                <GlassCard className="bento-tile bento-tile-total">
                  <span className="dashboard-stat-badge" aria-hidden="true">
                    <TrophyIcon />
                  </span>
                  <span className="dashboard-stat-value">{summary.totalWorkouts}</span>
                  <span className="dashboard-stat-label">Total Workouts</span>
                  <div
                    key={`milestone-${summary.totalWorkouts}`}
                    className={
                      'dashboard-milestone-bar' + (totalWorkoutsChanged ? ' dashboard-stat-just-updated' : '')
                    }
                    role="progressbar"
                    aria-valuenow={summary.totalWorkouts}
                    aria-valuemin={0}
                    aria-valuemax={nextMilestone}
                  >
                    <div
                      className="dashboard-milestone-bar-fill"
                      style={{ width: `${Math.min(100, (summary.totalWorkouts / nextMilestone) * 100)}%` }}
                    />
                  </div>
                  <span className="dashboard-milestone-label">
                    {summary.totalWorkouts} / {nextMilestone} to next milestone
                  </span>
                </GlassCard>

                <GlassCard className="bento-tile bento-tile-weight">
                  <div className="dashboard-weight-header">
                    <span className="dashboard-stat-badge" aria-hidden="true">
                      <ScaleIcon />
                    </span>
                    <div>
                      <span className="dashboard-stat-value">
                        {summary.latestWeight !== undefined ? `${summary.latestWeight}kg` : '—'}
                      </span>
                      <span className="dashboard-stat-label dashboard-weight-inline-label">
                        Weight
                        {summary.weightChange !== undefined && summary.weightChange !== 0 && (
                          <span
                            className={
                              'dashboard-weight-change' +
                              (summary.weightChange < 0
                                ? ' dashboard-weight-change-down'
                                : ' dashboard-weight-change-up')
                            }
                          >
                            {' '}
                            ({summary.weightChange > 0 ? '+' : ''}
                            {summary.weightChange}kg)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="weight-chart">
                    <svg
                      className="weight-chart-svg"
                      viewBox={`0 0 ${WEIGHT_CHART_WIDTH} ${WEIGHT_CHART_HEIGHT}`}
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <line x1="0" y1="25" x2={WEIGHT_CHART_WIDTH} y2="25" className="weight-chart-gridline" />
                      <line x1="0" y1="50" x2={WEIGHT_CHART_WIDTH} y2="50" className="weight-chart-gridline" />
                      <line x1="0" y1="75" x2={WEIGHT_CHART_WIDTH} y2="75" className="weight-chart-gridline" />
                      {summary.weightTrend.length >= 2 ? (
                        <polyline
                          points={buildWeightChartPoints(summary.weightTrend)}
                          className="weight-chart-line"
                        />
                      ) : (
                        <line
                          x1="0"
                          y1={WEIGHT_CHART_HEIGHT / 2}
                          x2={WEIGHT_CHART_WIDTH}
                          y2={WEIGHT_CHART_HEIGHT / 2}
                          className="weight-chart-empty-line"
                        />
                      )}
                    </svg>
                    {summary.weightTrend.length < 2 && (
                      <span className="weight-chart-empty-note">Log your weight to start your trend</span>
                    )}
                  </div>
                </GlassCard>
              </div>

              <GlassCard className="dashboard-achievements">
                <h2>Achievements</h2>
                <AchievementBadges summary={summary} />
              </GlassCard>

              {summary.recentPersonalRecords.length > 0 && (
                <GlassCard className="dashboard-prs">
                  <h2>Recent Personal Records</h2>
                  <div className="dashboard-pr-list">
                    {summary.recentPersonalRecords.map((pr) => (
                      <div key={pr.id} className="dashboard-pr-row">
                        <span
                          className={
                            'dashboard-pr-icon' +
                            (pr.type === 'weight' ? ' dashboard-pr-icon-weight' : ' dashboard-pr-icon-reps')
                          }
                          aria-hidden="true"
                        >
                          {pr.type === 'weight' ? <TrophyIcon /> : <RepeatIcon />}
                        </span>
                        <div className="dashboard-pr-info">
                          <span className="dashboard-pr-name">{pr.exercise.name}</span>
                          <span className="dashboard-pr-detail text-caption">
                            {formatPrValue(pr.type, pr.newValue)} · {formatRelativeDate(pr.date)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </>
          )}
        </div>
      </Container>

      <Modal isOpen={isLogWeightOpen} onClose={() => setIsLogWeightOpen(false)} title="Log Weight">
        <Input
          label="Weight (kg)"
          type="number"
          min={0}
          value={weightInput}
          onChange={(event) => setWeightInput(event.target.value)}
        />
        {saveError && <p className="dashboard-error">{saveError}</p>}
        <div className="dashboard-log-weight-actions">
          <Button variant="ghost" onClick={() => setIsLogWeightOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogWeight} loading={isSaving}>
            Save
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}
