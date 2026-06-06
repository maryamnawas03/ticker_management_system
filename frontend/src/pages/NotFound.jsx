import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '50%',
          width: 80,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <span className="material-icons" style={{ fontSize: 40, color: '#ef4444' }}>
          error_outline
        </span>
      </div>

      <h1
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: 12,
          letterSpacing: '-0.025em',
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: 8,
        }}
      >
        Page Not Found
      </h2>

      <p
        style={{
          fontSize: 14,
          color: 'var(--text-muted)',
          maxWidth: 380,
          marginBottom: 32,
          lineHeight: 1.6,
        }}
      >
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <button
        onClick={() => navigate('/dashboard')}
        className="auth-btn"
        style={{
          width: 'auto',
          padding: '12px 28px',
          marginTop: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontWeight: 600,
        }}
      >
        <span className="material-icons" style={{ fontSize: 18 }}>
          dashboard
        </span>
        <span>Go to Dashboard</span>
      </button>
    </div>
  );
};

export default NotFound;
