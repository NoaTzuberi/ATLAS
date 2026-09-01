import { Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../services/auth/AuthContext';
import { ROUTES } from '../../../../app/config/routes';
import { PageLayout } from '../../../../components/layout/PageLayout/PageLayout';
import { Container } from '../../../../components/layout/Container/Container';
import { Section } from '../../../../components/layout/Section/Section';
import { Spinner } from '../../../../components/common/Spinner/Spinner';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import './ProtectedRoute.css';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <Section className="auth-gate-section">
          <Container>
            <GlassCard className="auth-gate-card">
              <h1>Log in required</h1>
              <p className="text-body">You need an account to view this page.</p>
              <div className="auth-gate-actions">
                <Link to={ROUTES.LOGIN} className="btn btn-primary">
                  <span className="btn-label">Log In</span>
                </Link>
                <Link to={ROUTES.REGISTER} className="btn btn-secondary">
                  <span className="btn-label">Sign Up</span>
                </Link>
              </div>
            </GlassCard>
          </Container>
        </Section>
      </PageLayout>
    );
  }

  if (user) {
    const isOnboardingRoute =
      location.pathname === ROUTES.ONBOARDING || location.pathname.startsWith(`${ROUTES.ONBOARDING}/`);

    // Force incomplete users into onboarding, but let completed users revisit it
    // voluntarily (e.g. the "Update Training Profile" CTA on the Profile page).
    if (!user.onboardingCompleted && !isOnboardingRoute) {
      return <Navigate to={ROUTES.ONBOARDING} replace />;
    }
  }

  return <Outlet />;
}
