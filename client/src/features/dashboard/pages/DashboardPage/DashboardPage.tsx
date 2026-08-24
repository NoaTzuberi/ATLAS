import { useEffect, useState } from 'react';
import { PageLayout } from '../../../../components/layout/PageLayout/PageLayout';
import { Container } from '../../../../components/layout/Container/Container';
import { Section } from '../../../../components/layout/Section/Section';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { Spinner } from '../../../../components/common/Spinner/Spinner';
import { Button } from '../../../../components/common/Button/Button';
import { Modal } from '../../../../components/common/Modal/Modal';
import { Input } from '../../../../components/common/Input/Input';
import { getDashboardSummary } from '../../../../services/dashboard/dashboardService';
import { createProgressEntry } from '../../../../services/progress/progressService';
import type { DashboardSummary, WeightTrendPoint } from '../../types';
import './DashboardPage.css';

const SPARKLINE_WIDTH = 100;
const SPARKLINE_HEIGHT = 32;

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

function buildSparklinePoints(points: WeightTrendPoint[]): string {
  const weights = points.map((p) => p.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;
  const stepX = SPARKLINE_WIDTH / (points.length - 1);

  return points
    .map((point, index) => {
      const x = index * stepX;
      const y = SPARKLINE_HEIGHT - ((point.weight - min) / range) * SPARKLINE_HEIGHT;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();
  const [isLogWeightOpen, setIsLogWeightOpen] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>();

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

  return (
    <PageLayout>
      <Section className="dashboard-page">
        <Container>
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
              <div className="dashboard-stats">
                <GlassCard className="dashboard-stat dashboard-stat-hero">
                  <div className="dashboard-stat-hero-glow" aria-hidden="true" />
                  <span className="dashboard-stat-badge dashboard-stat-badge-hero" aria-hidden="true">
                    🔥
                  </span>
                  <span className="dashboard-stat-value dashboard-stat-value-hero">{summary.streak}</span>
                  <span className="dashboard-stat-label">{summary.streak === 1 ? 'Day Streak' : 'Day Streak'}</span>
                </GlassCard>

                <GlassCard className="dashboard-stat">
                  <span className="dashboard-stat-badge" aria-hidden="true">
                    📅
                  </span>
                  <span className="dashboard-stat-value">{summary.workoutsLast7Days}</span>
                  <span className="dashboard-stat-label">This Week</span>
                </GlassCard>

                <GlassCard className="dashboard-stat">
                  <span className="dashboard-stat-badge" aria-hidden="true">
                    🏋
                  </span>
                  <span className="dashboard-stat-value">{summary.totalWorkouts}</span>
                  <span className="dashboard-stat-label">Total Workouts</span>
                </GlassCard>

                <GlassCard className="dashboard-stat dashboard-stat-weight">
                  <span className="dashboard-stat-badge" aria-hidden="true">
                    ⚖️
                  </span>
                  <span className="dashboard-stat-value">
                    {summary.latestWeight !== undefined ? `${summary.latestWeight}kg` : '—'}
                  </span>
                  <span className="dashboard-stat-label">
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
                  {summary.weightTrend.length >= 2 && (
                    <svg
                      className="dashboard-weight-sparkline"
                      viewBox={`0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`}
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <polyline points={buildSparklinePoints(summary.weightTrend)} />
                    </svg>
                  )}
                </GlassCard>
              </div>

              <GlassCard className="dashboard-prs">
                <h2>Recent Personal Records</h2>
                {summary.recentPersonalRecords.length === 0 ? (
                  <p className="text-body dashboard-empty-note">
                    Complete a workout and log your sets to start earning personal records.
                  </p>
                ) : (
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
                          {pr.type === 'weight' ? '🏆' : '🔁'}
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
                )}
              </GlassCard>
            </>
          )}
        </Container>
      </Section>

      <Modal
        isOpen={isLogWeightOpen}
        onClose={() => setIsLogWeightOpen(false)}
        title="Log Weight"
      >
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
    </PageLayout>
  );
}
