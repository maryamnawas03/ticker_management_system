import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../features/dashboard/dashboardSlice';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

/**
 * Dashboard Page
 *
 * Shows summary statistics cards dynamically fetched for the logged-in user's role:
 *   Admin → all system tickets
 *   Agent → assigned tickets
 *   User  → own tickets
 */

const statCards = [
  { key: 'total',      label: 'Total Tickets',       icon: 'confirmation_number', color: '#6366f1' },
  { key: 'open',       label: 'Open',                icon: 'folder_open',          color: '#6366f1' },
  { key: 'inProgress', label: 'In Progress',         icon: 'sync',                 color: '#eab308' },
  { key: 'resolved',   label: 'Resolved',            icon: 'check_circle',         color: '#22c55e' },
  { key: 'closed',     label: 'Closed',              icon: 'lock',                 color: '#94a3b8' },
  { key: 'urgent',     label: 'Urgent',              icon: 'error',                color: '#ef4444' },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, isLoading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const counts = stats || {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    urgent: 0,
  };

  return (
    <div className="dashboard-page">
      {/* Welcome banner */}
      <div className="dashboard-welcome">
        <h2 className="welcome-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>Welcome back,</span>
          <span className="welcome-name">{user?.name}</span>
          <span className="material-icons" style={{ color: '#fbbf24', fontSize: 24 }}>waving_hand</span>
        </h2>
        <p className="welcome-sub">
          Here&apos;s a snapshot of your {user?.role === 'Admin' ? 'system' : user?.role === 'Agent' ? 'assigned work' : 'tickets'}.
        </p>
      </div>

      {error && <ErrorMessage message={error} style={{ marginBottom: 24 }} />}

      {/* Stats grid */}
      {isLoading ? (
        <Loader text="Loading statistics…" />
      ) : (
        <div className="stats-grid">
          {statCards.map((card) => (
            <div key={card.key} className="stat-card">
              <div className="material-icons stat-icon" style={{ color: card.color }}>{card.icon}</div>
              <div className="stat-info">
                <p className="stat-value" style={{ color: card.color }}>
                  {counts[card.key] ?? 0}
                </p>
                <p className="stat-label">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Stats Grid (Admin only) */}
      {!isLoading && user?.role === 'Admin' && counts.userStats && (
        <div style={{ marginTop: 28, marginBottom: 12 }}>
          <h3 className="actions-title" style={{ marginBottom: 16 }}>User Account Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="material-icons stat-icon" style={{ color: '#6366f1' }}>people</div>
              <div className="stat-info">
                <p className="stat-value" style={{ color: '#6366f1' }}>
                  {counts.userStats.totalUsers ?? 0}
                </p>
                <p className="stat-label">Total Registered</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="material-icons stat-icon" style={{ color: '#ef4444' }}>shield</div>
              <div className="stat-info">
                <p className="stat-value" style={{ color: '#ef4444' }}>
                  {counts.userStats.admins ?? 0}
                </p>
                <p className="stat-label">Administrators</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="material-icons stat-icon" style={{ color: '#eab308' }}>support_agent</div>
              <div className="stat-info">
                <p className="stat-value" style={{ color: '#eab308' }}>
                  {counts.userStats.agents ?? 0}
                </p>
                <p className="stat-label">Support Agents</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="material-icons stat-icon" style={{ color: '#3b82f6' }}>person</div>
              <div className="stat-info">
                <p className="stat-value" style={{ color: '#3b82f6' }}>
                  {counts.userStats.users ?? 0}
                </p>
                <p className="stat-label">Regular Clients</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="dashboard-actions">
        <h3 className="actions-title">Quick Actions</h3>
        <div className="actions-grid">
          {user?.role !== 'Admin' && (
            <a href="/tickets/new" className="action-card">
              <span className="material-icons action-icon">add</span>
              <span>Create Ticket</span>
            </a>
          )}
          <a href="/tickets" className="action-card">
            <span className="material-icons action-icon">confirmation_number</span>
            <span>{user?.role === 'Admin' ? 'All Tickets' : user?.role === 'Agent' ? 'Assigned Tickets' : 'My Tickets'}</span>
          </a>
          {user?.role === 'Admin' && (
            <a href="/users" className="action-card">
              <span className="material-icons action-icon">people</span>
              <span>Manage Users</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
