import { Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../services/auth/AuthContext';
import { ROUTES } from '../../../../app/config/routes';
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

  if (isAuthenticated && user) {
    const isOnboardingRoute = location.pathname === ROUTES.ONBOARDING;

    if (!user.onboardingCompleted && !isOnboardingRoute) {
      return <Navigate to={ROUTES.ONBOARDING} replace />;
    }

    if (user.onboardingCompleted && isOnboardingRoute) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  return (
    <>
      <Outlet />
      {!isAuthenticated && (
        <div className="auth-gate-overlay">
          <GlassCard className="auth-gate-card">
            <h2>Sign in required</h2>
            <p className="text-body">You need an account to view this page.</p>
            <div className="auth-gate-actions">
              <Link to={ROUTES.LOGIN} className="btn btn-primary">
                <span className="btn-label">Sign In</span>
              </Link>
              <Link to={ROUTES.REGISTER} className="btn btn-secondary">
                <span className="btn-label">Sign Up</span>
              </Link>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
}
