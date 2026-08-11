import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../../../services/auth/AuthContext';
import { ROUTES } from '../../../../app/config/routes';
import { Spinner } from '../../../../components/common/Spinner/Spinner';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import './ProtectedRoute.css';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <Spinner size="lg" />
      </div>
    );
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
