import { useEffect, useMemo, useState } from 'react';
import { PageLayout } from '../../../../components/layout/PageLayout/PageLayout';
import { Container } from '../../../../components/layout/Container/Container';
import { Section } from '../../../../components/layout/Section/Section';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { Spinner } from '../../../../components/common/Spinner/Spinner';
import { Button } from '../../../../components/common/Button/Button';
import { Modal } from '../../../../components/common/Modal/Modal';
import { Input } from '../../../../components/common/Input/Input';
import { MonthCalendar, toDateKey } from '../../components/MonthCalendar/MonthCalendar';
import { WorkoutChip } from '../../../workouts/components/WorkoutChip/WorkoutChip';
import { ACTIVITY_TYPE_OPTIONS, activityTypeLabel, activityTypeIcon } from '../../../activities/data/activityOptions';
import { listWorkouts } from '../../../../services/workouts/workoutSessionService';
import { createActivity, listActivities, deleteActivity } from '../../../../services/activities/activityService';
import type { WorkoutSummary } from '../../../workouts/types';
import type { Activity, ActivityType } from '../../../activities/types';
import './CalendarPage.css';

function startOfMonthPadded(year: number, month: number): string {
  const date = new Date(year, month, -1);
  return date.toISOString();
}

function endOfMonthPadded(year: number, month: number): string {
  const date = new Date(year, month + 1, 2);
  return date.toISOString();
}

export function CalendarPage() {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(today));

  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();

  const [isLogActivityOpen, setIsLogActivityOpen] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType>('running');
  const [duration, setDuration] = useState('30');
  const [distance, setDistance] = useState('');
  const [difficulty, setDifficulty] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>();

  async function loadMonth() {
    setIsLoading(true);
    setLoadError(undefined);
    try {
      const from = startOfMonthPadded(year, month);
      const to = endOfMonthPadded(year, month);
      const [workoutData, activityData] = await Promise.all([
        listWorkouts({ from, to, status: 'completed' }),
        listActivities({ from, to }),
      ]);
      setWorkouts(workoutData);
      setActivities(activityData);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Couldn't load your calendar.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const workoutDates = useMemo(() => new Set(workouts.map((w) => toDateKey(new Date(w.date)))), [workouts]);
  const activityDates = useMemo(() => new Set(activities.map((a) => toDateKey(new Date(a.date)))), [activities]);

  const selectedWorkouts = workouts.filter((w) => toDateKey(new Date(w.date)) === selectedDateKey);
  const selectedActivities = activities.filter((a) => toDateKey(new Date(a.date)) === selectedDateKey);

  function goToPrevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function openLogActivity() {
    setActivityType('running');
    setDuration('30');
    setDistance('');
    setDifficulty(undefined);
    setNotes('');
    setSaveError(undefined);
    setIsLogActivityOpen(true);
  }

  async function handleSaveActivity() {
    const durationNum = Number(duration);
    if (!duration || Number.isNaN(durationNum) || durationNum <= 0) {
      setSaveError('Enter a valid duration.');
      return;
    }

    setIsSaving(true);
    setSaveError(undefined);
    try {
      await createActivity({
        type: activityType,
        date: new Date(`${selectedDateKey}T12:00:00`).toISOString(),
        duration: durationNum,
        distance: distance ? Number(distance) : undefined,
        difficulty,
        metadata: notes ? { notes } : undefined,
      });
      setIsLogActivityOpen(false);
      await loadMonth();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Couldn't save this activity.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteActivity(id: string) {
    await deleteActivity(id);
    await loadMonth();
  }

  return (
    <PageLayout>
      <Section className="calendar-page">
        <Container>
          <div className="calendar-page-header">
            <div>
              <h1 className="calendar-page-title">Calendar</h1>
              <p className="text-body calendar-page-subtitle">Your gym sessions and activities.</p>
            </div>
            <Button onClick={openLogActivity}>Log Activity</Button>
          </div>

          {isLoading && (
            <div className="calendar-page-loading">
              <Spinner size="lg" />
            </div>
          )}

          {!isLoading && loadError && <p className="calendar-page-error">{loadError}</p>}

          {!isLoading && !loadError && (
            <div className="calendar-page-layout">
              <GlassCard className="calendar-page-calendar">
                <MonthCalendar
                  year={year}
                  month={month}
                  workoutDates={workoutDates}
                  activityDates={activityDates}
                  selectedDateKey={selectedDateKey}
                  onSelectDate={setSelectedDateKey}
                  onPrevMonth={goToPrevMonth}
                  onNextMonth={goToNextMonth}
                />
              </GlassCard>

              <GlassCard className="calendar-page-day">
                <h2>{selectedDateKey}</h2>

                {selectedWorkouts.length === 0 && selectedActivities.length === 0 && (
                  <p className="text-body calendar-page-empty">Nothing logged this day.</p>
                )}

                {selectedWorkouts.map((workout) => (
                  <div key={workout.id} className="calendar-day-entry">
                    <span className="calendar-day-entry-icon" aria-hidden="true">
                      🏋
                    </span>
                    <div>
                      <span className="calendar-day-entry-title">{workout.name}</span>
                      <span className="calendar-day-entry-meta text-caption">
                        {workout.duration ? `${workout.duration} min` : ''}
                        {workout.totalVolume ? ` — ${workout.totalVolume}kg volume` : ''}
                      </span>
                    </div>
                  </div>
                ))}

                {selectedActivities.map((activity) => (
                  <div key={activity.id} className="calendar-day-entry">
                    <span className="calendar-day-entry-icon" aria-hidden="true">
                      {activityTypeIcon(activity.type)}
                    </span>
                    <div>
                      <span className="calendar-day-entry-title">{activityTypeLabel(activity.type)}</span>
                      <span className="calendar-day-entry-meta text-caption">
                        {activity.duration} min
                        {activity.distance ? ` — ${activity.distance}km` : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="calendar-day-entry-remove"
                      onClick={() => handleDeleteActivity(activity.id)}
                      aria-label="Delete activity"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </GlassCard>
            </div>
          )}
        </Container>
      </Section>

      <Modal isOpen={isLogActivityOpen} onClose={() => setIsLogActivityOpen(false)} title="Log Activity">
        <div className="log-activity-chips">
          {ACTIVITY_TYPE_OPTIONS.map((option) => (
            <WorkoutChip
              key={option.value}
              label={`${option.icon} ${option.label}`}
              selected={activityType === option.value}
              onClick={() => setActivityType(option.value)}
            />
          ))}
        </div>

        <div className="log-activity-row">
          <Input
            label="Duration (min)"
            type="number"
            min={1}
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
          />
          <Input
            label="Distance (km)"
            type="number"
            min={0}
            placeholder="optional"
            value={distance}
            onChange={(event) => setDistance(event.target.value)}
          />
        </div>

        <span className="log-activity-field-label">Difficulty</span>
        <div className="log-activity-difficulty">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className={
                'log-activity-difficulty-star' + (difficulty && value <= difficulty ? ' log-activity-difficulty-star-selected' : '')
              }
              onClick={() => setDifficulty(value === difficulty ? undefined : value)}
              aria-label={`Difficulty ${value} out of 5`}
            >
              &#9733;
            </button>
          ))}
        </div>

        <textarea
          className="log-activity-notes"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={2}
        />

        {saveError && <p className="calendar-page-error">{saveError}</p>}

        <div className="log-activity-actions">
          <Button variant="ghost" onClick={() => setIsLogActivityOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveActivity} loading={isSaving}>
            Save
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
}
