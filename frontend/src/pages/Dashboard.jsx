import { useEffect, useState } from 'react';
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



const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, isLoading, error } = useSelector((state) => state.dashboard);
  
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    if (stats) {
      const timer = setTimeout(() => setAnimateBars(true), 150);
      return () => clearTimeout(timer);
    }
  }, [stats]);

  const counts = stats || {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0,
  };

  const donutTotal = counts.open + counts.inProgress + counts.resolved + counts.closed;
  const circumference = 314.16;
  const statuses = [
    { name: 'Open', value: counts.open, color: '#3B82F6' },
    { name: 'In Progress', value: counts.inProgress, color: '#F59E0B' },
    { name: 'Resolved', value: counts.resolved, color: '#22C55E' },
    { name: 'Closed', value: counts.closed, color: '#64748B' },
  ];

  let accumulatedAngle = -90;
  const donutSegments = statuses.map((status) => {
    const percentage = donutTotal > 0 ? (status.value / donutTotal) * 100 : 0;
    const length = donutTotal > 0 ? (status.value / donutTotal) * circumference : 0;
    const angle = donutTotal > 0 ? (status.value / donutTotal) * 360 : 0;
    const rotateAngle = accumulatedAngle;
    accumulatedAngle += angle;
    return { ...status, percentage, length, rotateAngle };
  });

  const priorityTotal = (counts.low ?? 0) + (counts.medium ?? 0) + (counts.high ?? 0) + (counts.urgent ?? 0);
  const priorities = [
    { key: 'low', label: 'Low', count: counts.low ?? 0, glowClass: 'priority-glow-low' },
    { key: 'medium', label: 'Medium', count: counts.medium ?? 0, glowClass: 'priority-glow-medium' },
    { key: 'high', label: 'High', count: counts.high ?? 0, glowClass: 'priority-glow-high' },
    { key: 'urgent', label: 'Urgent', count: counts.urgent ?? 0, glowClass: 'priority-glow-urgent' },
  ];

  const cards = [];
  if (user?.role === 'Admin') {
    cards.push(
      { label: 'Total Tickets', icon: 'confirmation_number', color: '#6366F1', value: counts.total },
      { label: 'Urgent Tickets', icon: 'error', color: '#EF4444', value: counts.urgent },
      { label: 'Total Users', icon: 'people', color: '#8B5CF6', value: counts.userStats?.totalUsers ?? 0 },
      { label: 'Support Agents', icon: 'support_agent', color: '#06B6D4', value: counts.userStats?.agents ?? 0 }
    );
  } else {
    cards.push(
      { label: 'Total Tickets', icon: 'confirmation_number', color: '#6366F1', value: counts.total },
      { label: 'Pending Tickets', icon: 'folder_open', color: '#F59E0B', value: (counts.open ?? 0) + (counts.inProgress ?? 0) },
      { label: 'Urgent Tickets', icon: 'error', color: '#EF4444', value: counts.urgent }
    );
  }

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
          {cards.map((card, idx) => (
            <div key={idx} className="stat-card">
              <div 
                className="stat-icon-wrapper" 
                style={{ 
                  background: `rgba(${hexToRgb(card.color)}, 0.1)`,
                  color: card.color
                }}
              >
                <span className="material-icons" style={{ fontSize: 20 }}>{card.icon}</span>
              </div>
              <div className="stat-info">
                <p className="stat-value" style={{ color: card.color }}>
                  {card.value}
                </p>
                <p className="stat-label">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      {!isLoading && (
        <div className="dashboard-charts-grid">
          {/* Status Distribution Donut */}
          <div className="chart-card">
            <h3 className="chart-title">Ticket Status Distribution</h3>
            <div className="donut-container">
              <div className="donut-chart-wrapper">
                <svg className="donut-svg" viewBox="0 0 120 120">
                  {donutTotal === 0 ? (
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="donut-ring"
                    />
                  ) : (
                    <>
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        className="donut-ring"
                      />
                      {donutSegments.map((seg, idx) => (
                        seg.value > 0 && (
                          <circle
                            key={seg.name}
                            cx="60"
                            cy="60"
                            r="50"
                            className={`donut-segment ${hoveredIndex === idx ? 'active' : ''}`}
                            stroke={seg.color}
                            strokeDasharray={`${seg.length} ${circumference}`}
                            strokeDashoffset={0}
                            transform={`rotate(${seg.rotateAngle}, 60, 60)`}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                          />
                        )
                      ))}
                    </>
                  )}
                </svg>
                <div className="donut-center-text">
                  {hoveredIndex !== null ? (
                    <>
                      <span className="donut-center-label">{donutSegments[hoveredIndex].name}</span>
                      <span className="donut-center-value">{donutSegments[hoveredIndex].value}</span>
                      <span className="donut-center-percent">
                        {donutSegments[hoveredIndex].percentage.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="donut-center-label">Active</span>
                      <span className="donut-center-value">{donutTotal}</span>
                      <span className="donut-center-percent">Tickets</span>
                    </>
                  )}
                </div>
              </div>

              <div className="donut-legend">
                {donutSegments.map((seg, idx) => (
                  <div
                    key={seg.name}
                    className={`donut-legend-item ${hoveredIndex === idx ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="donut-legend-label">
                      <span className="donut-legend-color" style={{ background: seg.color }}></span>
                      <span>{seg.name}</span>
                    </div>
                    <span className="donut-legend-value">{seg.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Priority Distribution Bar Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Priority Distribution</h3>
            <div className="priority-bars-wrapper">
              {priorities.map((item) => {
                const pct = priorityTotal > 0 ? (item.count / priorityTotal) * 100 : 0;
                return (
                  <div key={item.key} className="priority-bar-item">
                    <div className="priority-bar-header">
                      <span className="priority-bar-label">{item.label}</span>
                      <span className="priority-bar-stats">
                        <span className="priority-bar-count">{item.count}</span>
                        {priorityTotal > 0 ? ` (${pct.toFixed(1)}%)` : ' (0%)'}
                      </span>
                    </div>
                    <div className="priority-bar-track">
                      <div
                        className={`priority-bar-fill ${item.glowClass}`}
                        style={{ width: animateBars ? `${pct}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                );
              })}
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
