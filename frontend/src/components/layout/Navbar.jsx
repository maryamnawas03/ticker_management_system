import { useSelector } from 'react-redux';

/**
 * Navbar — Top bar showing current page title and user info
 *
 * Props:
 *   title — page heading to display
 */
const Navbar = ({ title }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="navbar">
      <div className="navbar-title">
        <h1>{title || 'Dashboard'}</h1>
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
