import { Link } from 'react-router-dom';
import { ROUTES } from '../../../app/config/routes';
import atlasLogo from '../../../assets/Logo/ATLASlogo3.png';
import './Footer.css';

function InstagramIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.2L15 12L10.5 14.8V9.2Z" fill="currentColor" />
    </svg>
  );
}

const FOOTER_NAV_LINKS = [
  { to: ROUTES.HOME, label: 'Home' },
  { to: ROUTES.DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.EXERCISES, label: 'Exercises' },
  { to: ROUTES.WORKOUTS, label: 'Workouts' },
  { to: ROUTES.CALENDAR, label: 'Calendar' },
  { to: ROUTES.PROFILE, label: 'Profile' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to={ROUTES.HOME} className="footer-logo-link">
            <img src={atlasLogo} alt="ATLAS Logo" className="footer-logo" />
            <span className="footer-logo-name">ATLAS</span>
          </Link>
          {/* Draft tagline — replace with final copy. */}
          <p className="footer-tagline">
            Your intelligent training partner — track every session, understand your progress, and train smarter.
          </p>
          <p className="footer-copyright">&copy; {year} ATLAS. All rights reserved.</p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          {FOOTER_NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="footer-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="footer-social">
          {/* Placeholder profile links — swap for real ATLAS accounts. */}
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="footer-social-link"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noreferrer"
            className="footer-social-link"
            aria-label="YouTube"
          >
            <YouTubeIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
