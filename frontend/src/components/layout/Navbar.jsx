import { useSelector } from 'react-redux';

/**
 * Navbar — Top bar showing current page title and user info
 *
 * Props:
 *   title — page heading to display
 */
const Navbar = ({ title, onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onMenuClick}
          className="navbar-menu-btn"
          aria-label="Open menu"
        >
          <span className="material-icons">menu</span>
        </button>
        <div className="navbar-title">
          <h1>{title || 'Dashboard'}</h1>
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-user">
          <div className="navbar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">{user?.name}</span>
            <span className={`role-badge role-badge--${user?.role?.toLowerCase()}`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
