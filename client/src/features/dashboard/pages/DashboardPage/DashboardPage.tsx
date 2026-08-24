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
import type { DashboardSummary } from '../../types';
import './DashboardPage.css';

function formatPrValue(type: 'weight' | 'reps', value: number): string {
  return type === 'weight' ? `${value}kg` : `${value} reps`;
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
                <GlassCard className="dashboard-stat">
                  <span className="dashboard-stat-icon" aria-hidden="true">
                    🔥
                  </span>
                  <span className="dashboard-stat-value">{summary.streak}</span>
                  <span className="dashboard-stat-label">Day Streak</span>
                </GlassCard>
                <GlassCard className="dashboard-stat">
                  <span className="dashboard-stat-value">{summary.workoutsLast7Days}</span>
                  <span className="dashboard-stat-label">This Week</span>
                </GlassCard>
                <GlassCard className="dashboard-stat">
                  <span className="dashboard-stat-value">{summary.totalWorkouts}</span>
                  <span className="dashboard-stat-label">Total Workouts</span>
                </GlassCard>
                <GlassCard className="dashboard-stat">
                  <span className="dashboard-stat-value">
                    {summary.latestWeight !== undefined ? `${summary.latestWeight}kg` : '—'}
                  </span>
                  <span className="dashboard-stat-label">
                    Weight
                    {summary.weightChange !== undefined && (
                      <span
                        className={
                          'dashboard-weight-change' +
                          (summary.weightChange < 0
                            ? ' dashboard-weight-change-down'
                            : summary.weightChange > 0
                              ? ' dashboard-weight-change-up'
                              : '')
                        }
                      >
                        {' '}
                        ({summary.weightChange > 0 ? '+' : ''}
                        {summary.weightChange}kg)
                      </span>
                    )}
                  </span>
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
                      <div key={pr.id} className="dashboard-pr">
                        <span className="dashboard-pr-badge">PR</span>
                        <span>
                          {pr.exercise.name} — {formatPrValue(pr.type, pr.newValue)}
                        </span>
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
