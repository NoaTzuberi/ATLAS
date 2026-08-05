import './Navbar.css';

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <span className="navbar-logo">ATLAS</span>
        {/* Temporary placeholder links — real navigation lands in a later phase */}
        <nav className="navbar-links">
          <span className="navbar-link">Home</span>
          <span className="navbar-link">Dashboard</span>
          <span className="navbar-link">Profile</span>
        </nav>
      </div>
    </header>
  );
}
