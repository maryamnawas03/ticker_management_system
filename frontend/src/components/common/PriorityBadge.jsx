/**
 * PriorityBadge Component
 *
 * Colored pill badge for ticket priority.
 *
 * Props:
 *   priority — 'Low' | 'Medium' | 'High' | 'Urgent'
 */
const priorityConfig = {
  Low:    { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' },
  Medium: { bg: 'rgba(59,130,246,0.15)',  color: '#93c5fd' },
  High:   { bg: 'rgba(249,115,22,0.15)',  color: '#fdba74' },
  Urgent: { bg: 'rgba(239,68,68,0.15)',   color: '#fca5a5' },
};

const PriorityBadge = ({ priority }) => {
  const cfg = priorityConfig[priority] || { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' };
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
      {priority}
    </span>
  );
};

export default PriorityBadge;
