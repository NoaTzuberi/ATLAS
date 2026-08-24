import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../app/config/routes';
import { useAuth } from '../../../services/auth/AuthContext';
import atlasLogo from '../../../assets/Logo/ATLASlogo3.png';
import './Navbar.css';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTES.HOME);
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to={ROUTES.HOME} className="navbar-brand">
          <img className="navbar-logo" src={atlasLogo} alt="ATLAS Logo" />
          <span className="navbar-logoName">ATLAS</span>
        </Link>
        <nav className="navbar-links">
          <Link to={ROUTES.HOME} className="navbar-link">
            Home
          </Link>
          <Link to={ROUTES.DASHBOARD} className="navbar-link">
            Dashboard
          </Link>
          <Link to={ROUTES.EXERCISES} className="navbar-link">
            Exercises
          </Link>
          <Link to={ROUTES.WORKOUTS} className="navbar-link">
            Workouts
          </Link>
          <Link to={ROUTES.CALENDAR} className="navbar-link">
            Calendar
          </Link>
          <Link to={ROUTES.PROFILE} className="navbar-link">
            Profile
          </Link>
        </nav>
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">{user?.name}</span>
              <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                <span className="btn-label">Log Out</span>
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="btn btn-ghost">
                <span className="btn-label">Log In</span>
              </Link>
              <Link to={ROUTES.REGISTER} className="btn btn-primary">
                <span className="btn-label">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
