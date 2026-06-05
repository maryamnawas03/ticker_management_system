import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStatsRequest } from '../api/dashboardApi';
import Loader from '../components/common/Loader';

/**
 * Dashboard Page
 *
 * Shows summary statistics cards for the logged-in user's role:
 *   Admin → all tickets
 *   Agent → assigned tickets
 *   User  → own tickets
 *
 * Stats API will be wired on Day 5. For now shows placeholder cards
 * with zeros that will hydrate once the dashboard backend is complete.
 */

const statCards = [
  { key: 'total',      label: 'Total Tickets',       icon: '🎫', color: '#6366f1' },
  { key: 'open',       label: 'Open',                icon: '📂', color: '#6366f1' },
  { key: 'inProgress', label: 'In Progress',         icon: '⚙️',  color: '#eab308' },
  { key: 'resolved',   label: 'Resolved',            icon: '✅',  color: '#22c55e' },
  { key: 'closed',     label: 'Closed',              icon: '🔒',  color: '#94a3b8' },
  { key: 'urgent',     label: 'Urgent',              icon: '🚨',  color: '#ef4444' },
];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Stats placeholder — will be wired to dashboardSlice thunk on Day 5
  const stats = {
    total: 0, open: 0, inProgress: 0,
    resolved: 0, closed: 0, urgent: 0,
  };
  const isLoading = false;

  return (
    <div className="dashboard-page">
      {/* Welcome banner */}
      <div className="dashboard-welcome">
        <h2 className="welcome-title">
          Welcome back, <span className="welcome-name">{user?.name}</span> 👋
        </h2>
        <p className="welcome-sub">
          Here&apos;s a snapshot of your {user?.role === 'Admin' ? 'system' : user?.role === 'Agent' ? 'assigned work' : 'tickets'}.
        </p>
      </div>

      {/* Stats grid */}
      {isLoading ? (
        <Loader text="Loading statistics…" />
      ) : (
        <div className="stats-grid">
          {statCards.map((card) => (
            <div key={card.key} className="stat-card">
              <div className="stat-icon" style={{ color: card.color }}>{card.icon}</div>
              <div className="stat-info">
                <p className="stat-value" style={{ color: card.color }}>
                  {stats[card.key] ?? 0}
                </p>
                <p className="stat-label">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="dashboard-actions">
        <h3 className="actions-title">Quick Actions</h3>
        <div className="actions-grid">
          {user?.role !== 'Admin' && (
            <a href="/tickets/new" className="action-card">
              <span className="action-icon">＋</span>
              <span>Create Ticket</span>
            </a>
          )}
          <a href="/tickets" className="action-card">
            <span className="action-icon">🎫</span>
            <span>{user?.role === 'Admin' ? 'All Tickets' : user?.role === 'Agent' ? 'Assigned Tickets' : 'My Tickets'}</span>
          </a>
          {user?.role === 'Admin' && (
            <a href="/users" className="action-card">
              <span className="action-icon">👥</span>
              <span>Manage Users</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
