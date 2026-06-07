/**
 * ErrorMessage Component
 *
 * Displays a red error banner with an optional dismiss button.
 *
 * Props:
 *   message  — string to display
 *   onDismiss — optional callback to clear the error
 */
const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 8,
        background: 'rgba(239,68,68,0.12)',
        border: '1px solid rgba(239,68,68,0.3)',
        color: '#fca5a5',
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="material-icons" style={{ fontSize: 18, color: '#ef4444' }}>error</span>
        <span>{message}</span>
      </span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          style={{
            background: 'none',
            border: 'none',
            color: '#fca5a5',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span className="material-icons" style={{ fontSize: 18 }}>close</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
