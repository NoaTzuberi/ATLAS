import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
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
import { ProgressRing } from '../../components/ProgressRing/ProgressRing';
import { AchievementBadges } from '../../components/AchievementBadges/AchievementBadges';
import { FlameIcon, CalendarIcon, TrophyIcon, ScaleIcon, RepeatIcon } from '../../components/icons';
import type { DashboardSummary, WeightTrendPoint } from '../../types';
import './DashboardPage.css';

const WORKOUT_MILESTONES = [10, 25, 50, 100, 250, 500];
const STREAK_RING_TARGET = 7;
const MILESTONE_SEGMENT_COUNT = 10;
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

/** Last 7 calendar days ending today, as single-letter weekday labels. */
function getLast7DayLetters(): string[] {
  const letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const days: string[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(letters[date.getDay()]);
  }
  return days;
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
  const [ringProgress, setRingProgress] = useState(0);
  const bentoRef = useStaggerReveal<HTMLDivElement>([summary]);
  const weekDotsRef = useRef<HTMLDivElement>(null);
  const milestoneBarRef = useRef<HTMLDivElement>(null);
  const weightPolylineRef = useRef<SVGPolylineElement>(null);
  const weightEmptyLineRef = useRef<SVGLineElement>(null);

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

  // Sweep the streak ring in from empty to its real value — also fires
  // smoothly on any later change since it always animates from wherever
  // the ring currently sits toward the new target.
  useEffect(() => {
    if (!summary) return;
    const raf = requestAnimationFrame(() => {
      setRingProgress(summary.streak / STREAK_RING_TARGET);
    });
    return () => cancelAnimationFrame(raf);
  }, [summary]);

  // Stagger-fill the week dots and milestone segments, and draw in the
  // weight line, whenever the underlying data changes.
  useEffect(() => {
    if (!summary) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dots = weekDotsRef.current ? gsap.utils.toArray<HTMLElement>('.day-dot', weekDotsRef.current) : [];
    const segments = milestoneBarRef.current
      ? gsap.utils.toArray<HTMLElement>('.milestone-segment', milestoneBarRef.current)
      : [];

    const timeline = gsap.timeline();
    if (dots.length > 0) {
      timeline.fromTo(
        dots,
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.8)', stagger: 0.05 },
        0,
      );
    }
    if (segments.length > 0) {
      timeline.fromTo(
        segments,
        { scaleY: 0.3, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.35, ease: 'power2.out', stagger: 0.04 },
        0,
      );
    }
    const weightLineEl = weightPolylineRef.current ?? weightEmptyLineRef.current;
    if (weightLineEl) {
      const length = weightLineEl.getTotalLength();
      timeline.fromTo(
        weightLineEl,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' },
        0.1,
      );
    }

    return () => {
      timeline.kill();
    };
  }, [summary]);

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
  const filledSegments = summary
    ? Math.min(MILESTONE_SEGMENT_COUNT, Math.round((summary.totalWorkouts / nextMilestone) * MILESTONE_SEGMENT_COUNT))
    : 0;
  const initial = user?.name?.trim().charAt(0).toUpperCase() ?? '?';
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const dayLetters = getLast7DayLetters();

  return (
    <AppShell>
      <Container>
        <div className="dashboard-page">
          <div className="dashboard-actions-row">
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
                  <ProgressRing progress={ringProgress} size={112} strokeWidth={7} glow>
                    <span className="streak-ring-icon">
                      <FlameIcon />
                    </span>
                    <span className="streak-ring-value">{summary.streak}</span>
                  </ProgressRing>
                  <span className="dashboard-stat-label">Day Streak</span>
                  <span className="dashboard-stat-microcopy">
                    {summary.streak === 0 ? 'Start today to light it up' : `${STREAK_RING_TARGET}-day ring`}
                  </span>
                </GlassCard>

                <GlassCard className="bento-tile bento-tile-week">
                  <span className="dashboard-stat-badge" aria-hidden="true">
                    <CalendarIcon />
                  </span>
                  <span className="dashboard-stat-label">This Week</span>
                  <div className="day-dots" ref={weekDotsRef}>
                    {dayLetters.map((letter, index) => {
                      const filled = index >= dayLetters.length - summary.workoutsLast7Days;
                      return (
                        <div className="day-dot-column" key={index}>
                          <span className={'day-dot' + (filled ? ' day-dot-filled' : '')} />
                          <span className="day-dot-letter">{letter}</span>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>

                <GlassCard className="bento-tile bento-tile-total">
                  <span className="dashboard-stat-badge" aria-hidden="true">
                    <TrophyIcon />
                  </span>
                  <span className="dashboard-stat-value">{summary.totalWorkouts}</span>
                  <span className="dashboard-stat-label">Total Workouts</span>
                  <div
                    className="milestone-segments"
                    ref={milestoneBarRef}
                    role="progressbar"
                    aria-valuenow={summary.totalWorkouts}
                    aria-valuemin={0}
                    aria-valuemax={nextMilestone}
                  >
                    {Array.from({ length: MILESTONE_SEGMENT_COUNT }).map((_, index) => (
                      <span
                        key={index}
                        className={'milestone-segment' + (index < filledSegments ? ' milestone-segment-filled' : '')}
                      />
                    ))}
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
                          ref={weightPolylineRef}
                          points={buildWeightChartPoints(summary.weightTrend)}
                          className="weight-chart-line"
                        />
                      ) : (
                        <line
                          ref={weightEmptyLineRef}
                          x1="0"
                          y1={WEIGHT_CHART_HEIGHT / 2}
                          x2={WEIGHT_CHART_WIDTH}
                          y2={WEIGHT_CHART_HEIGHT / 2}
                          className="weight-chart-empty-line"
                        />
                      )}
                    </svg>
                    {summary.weightTrend.length < 2 && (
                      <span className="weight-chart-empty-note">Log your weight to start the trend</span>
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
