/**
 * StatusBadge Component
 *
 * Colored pill badge for ticket status.
 *
 * Props:
 *   status — 'Open' | 'In Progress' | 'Resolved' | 'Closed'
 */
const statusConfig = {
  Open:         { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc', label: 'Open' },
  'In Progress':{ bg: 'rgba(234,179,8,0.15)',  color: '#fde047', label: 'In Progress' },
  Resolved:     { bg: 'rgba(34,197,94,0.15)',  color: '#86efac', label: 'Resolved' },
  Closed:       { bg: 'rgba(148,163,184,0.15)',color: '#94a3b8', label: 'Closed' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', label: status };
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
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
