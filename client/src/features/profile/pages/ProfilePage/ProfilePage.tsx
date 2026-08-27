import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../../../../components/layout/AppShell/AppShell';
import { Container } from '../../../../components/layout/Container/Container';
import { Section } from '../../../../components/layout/Section/Section';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { Badge } from '../../../../components/common/Badge/Badge';
import { Spinner } from '../../../../components/common/Spinner/Spinner';
import { GOAL_OPTIONS, EQUIPMENT_OPTIONS } from '../../../onboarding/data/options';
import { ACTIVITIES } from '../../../onboarding/data/activities';
import { getMyProfile } from '../../../../services/users/usersService';
import type { MyProfileResponse } from '../../../../services/users/usersService';
import { useAuth } from '../../../../services/auth/AuthContext';
import { ROUTES } from '../../../../app/config/routes';
import './ProfilePage.css';

const GOAL_LABELS = new Map(GOAL_OPTIONS.map((option) => [option.id, option.label]));
const EQUIPMENT_LABELS = new Map(EQUIPMENT_OPTIONS.map((option) => [option.id, option.label]));
const ACTIVITY_LABELS = new Map(ACTIVITIES.map((activity) => [activity.id, activity.label]));

function BadgeList({ ids, labels }: { ids: string[]; labels: Map<string, string> }) {
  if (ids.length === 0) {
    return <span className="profile-summary-empty">Not set yet</span>;
  }
  return (
    <div className="profile-summary-badges">
      {ids.map((id) => (
        <Badge key={id} variant="accent">
          {labels.get(id) ?? id}
        </Badge>
      ))}
    </div>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<MyProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch((error) => {
        setLoadError(error instanceof Error ? error.message : "Couldn't load your profile.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const frequency = profile?.profile?.trainingFrequency;

  return (
    <AppShell>
      <Section className="profile-page">
        <Container>
          <div className="profile-header">
            <h1 className="profile-title">Profile</h1>
            <p className="text-body profile-subtitle">
              Manage your account and training preferences.
            </p>
          </div>

          <GlassCard className="profile-section-card profile-account-card">
            <h2>Account</h2>
            <div className="profile-account-row">
              <span className="text-label">Email</span>
              <span>{user?.email}</span>
            </div>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              state={{ email: user?.email }}
              className="profile-change-password-link"
            >
              Change password
            </Link>
          </GlassCard>

          <GlassCard className="profile-section-card profile-training-card">
            <h2>Training Profile</h2>

            {isLoading && (
              <div className="profile-loading-inline">
                <Spinner size="md" />
              </div>
            )}

            {!isLoading && loadError && <p className="profile-error">{loadError}</p>}

            {!isLoading && !loadError && (
              <div className="profile-summary">
                <div className="profile-summary-row">
                  <span className="text-label">Goals</span>
                  <BadgeList ids={profile?.profile?.goals ?? []} labels={GOAL_LABELS} />
                </div>
                <div className="profile-summary-row">
                  <span className="text-label">Training Frequency</span>
                  {frequency ? (
                    <span>
                      {frequency.minDays}–{frequency.maxDays} days/week
                      {frequency.flexibleSchedule && ' · Flexible schedule'}
                    </span>
                  ) : (
                    <span className="profile-summary-empty">Not set yet</span>
                  )}
                </div>
                <div className="profile-summary-row">
                  <span className="text-label">Preferred Activities</span>
                  <BadgeList ids={profile?.profile?.preferredActivities ?? []} labels={ACTIVITY_LABELS} />
                </div>
                <div className="profile-summary-row">
                  <span className="text-label">Equipment</span>
                  <BadgeList ids={profile?.profile?.equipment ?? []} labels={EQUIPMENT_LABELS} />
                </div>
              </div>
            )}

            <Link to={ROUTES.ONBOARDING} className="btn btn-primary profile-onboarding-cta">
              <span className="btn-label">Update Training Profile</span>
            </Link>
          </GlassCard>
        </Container>
      </Section>
    </AppShell>
  );
}
