/**
 * PriorityBadge Component
 *
 * Colored pill badge for ticket priority.
 *
 * Props:
 *   priority — 'Low' | 'Medium' | 'High' | 'Urgent'
 */
const priorityConfig = {
  Low:    { bg: 'rgba(100, 116, 139, 0.15)', color: '#cbd5e1', border: 'rgba(100, 116, 139, 0.3)' },
  Medium: { bg: 'rgba(59, 130, 246, 0.15)',  color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
  High:   { bg: 'rgba(245, 158, 11, 0.15)',  color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
  Urgent: { bg: 'rgba(239, 68, 68, 0.15)',   color: '#fca5a5', border: 'rgba(239, 68, 68, 0.3)' },
};

const PriorityBadge = ({ priority }) => {
  const cfg = priorityConfig[priority] || { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'rgba(148,163,184,0.2)' };
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
      {priority}
    </span>
  );
};

export default PriorityBadge;
