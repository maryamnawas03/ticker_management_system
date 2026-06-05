import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

/**
 * Sidebar — Role-Based Navigation
 *
 * Menu structure adapts to the logged-in user's role:
 *   Admin  → Dashboard, Ticket Management, User Management, All Tickets
 *   Agent  → Dashboard, Assigned Tickets
 *   User   → Dashboard, My Tickets, Create Ticket
 */

const adminNav = [
  { path: '/dashboard',   label: 'Dashboard',         icon: '◈' },
  { path: '/tickets',     label: 'Ticket Management', icon: '🎫' },
  { path: '/users',       label: 'User Management',   icon: '👥' },
];

const agentNav = [
  { path: '/dashboard',   label: 'Dashboard',         icon: '◈' },
  { path: '/tickets',     label: 'Assigned Tickets',  icon: '🎫' },
];

const userNav = [
  { path: '/dashboard',   label: 'Dashboard',         icon: '◈' },
  { path: '/tickets',     label: 'My Tickets',        icon: '🎫' },
  { path: '/tickets/new', label: 'Create Ticket',     icon: '＋' },
];

const navByRole = { Admin: adminNav, Agent: agentNav, User: userNav };

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const navItems = navByRole[user?.role] || userNav;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-name">TicketFlow</span>
      </div>

      {/* Role indicator */}
      <div className="sidebar-role">
        <span className="role-dot" data-role={user?.role} />
        <span className="role-label">{user?.role}</span>
      </div>

      {/* Nav links */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
            }
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Spacer + Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-meta">
            <p className="user-name">{user?.name}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <button
          id="logout-btn"
          className="logout-btn"
          onClick={handleLogout}
          aria-label="Log out"
        >
          <span aria-hidden="true">⏻</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
