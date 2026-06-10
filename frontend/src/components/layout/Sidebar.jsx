import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useToast } from '../../context/ToastContext';

/**
 * Sidebar — Role-Based Navigation
 *
 * Menu structure adapts to the logged-in user's role:
 *   Admin  → Dashboard, Ticket Management, User Management, All Tickets
 *   Agent  → Dashboard, Assigned Tickets
 *   User   → Dashboard, My Tickets, Create Ticket
 */

const adminNav = [
  { path: '/dashboard',   label: 'Dashboard',         icon: 'dashboard' },
  { path: '/tickets',     label: 'Ticket Management', icon: 'confirmation_number' },
  { path: '/users',       label: 'User Management',   icon: 'people' },
];

const agentNav = [
  { path: '/dashboard',   label: 'Dashboard',         icon: 'dashboard' },
  { path: '/tickets',     label: 'Assigned Tickets',  icon: 'confirmation_number' },
];

const userNav = [
  { path: '/dashboard',   label: 'Dashboard',         icon: 'dashboard' },
  { path: '/tickets',     label: 'My Tickets',        icon: 'confirmation_number' },
  { path: '/tickets/new', label: 'Create Ticket',     icon: 'add' },
];

const navByRole = { Admin: adminNav, Agent: agentNav, User: userNav };

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { addToast } = useToast();
  const navItems = navByRole[user?.role] || userNav;

  const handleLogout = () => {
    dispatch(logout());
    addToast('Signed out successfully', 'info');
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="material-icons brand-icon" style={{ color: '#f59e0b', fontSize: 24 }}>bolt</span>
          <span className="brand-name">TicketFlow</span>
        </div>
        <button
          onClick={onClose}
          className="sidebar-close-btn"
          aria-label="Close menu"
        >
          <span className="material-icons">close</span>
        </button>
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
            <span className="material-icons nav-icon" aria-hidden="true" style={{ fontSize: 20 }}>{item.icon}</span>
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
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <span className="material-icons" style={{ fontSize: 16 }}>power_settings_new</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
