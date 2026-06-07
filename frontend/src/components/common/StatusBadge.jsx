/**
 * StatusBadge Component
 *
 * Colored pill badge for ticket status.
 *
 * Props:
 *   status — 'Open' | 'In Progress' | 'Resolved' | 'Closed'
 */
const statusConfig = {
  Open:         { bg: 'rgba(59, 130, 246, 0.15)',  color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)', label: 'Open' },
  'In Progress':{ bg: 'rgba(245, 158, 11, 0.15)',  color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)', label: 'In Progress' },
  Resolved:     { bg: 'rgba(34, 197, 94, 0.15)',   color: '#4ade80', border: 'rgba(34, 197, 94, 0.3)', label: 'Resolved' },
  Closed:       { bg: 'rgba(100, 116, 139, 0.15)',  color: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)', label: 'Closed' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'rgba(148,163,184,0.2)', label: status };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.02em',
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
