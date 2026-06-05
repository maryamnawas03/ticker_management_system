/**
 * Loader Component
 *
 * Props:
 *   fullScreen — centers the spinner on the entire viewport
 *   size       — 'sm' | 'md' (default) | 'lg'
 *   text       — optional label below the spinner
 */
const Loader = ({ fullScreen = false, size = 'md', text = '' }) => {
  const sizeMap = { sm: 20, md: 36, lg: 52 };
  const px = sizeMap[size] ?? 36;

  const spinner = (
    <div className="loader-wrapper" style={{ textAlign: 'center' }}>
      <div
        className="spinner"
        style={{
          width: px,
          height: px,
          border: `${px / 8}px solid rgba(99,102,241,0.2)`,
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.75s linear infinite',
          margin: '0 auto',
        }}
      />
      {text && (
        <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 14 }}>{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          zIndex: 9999,
        }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;
