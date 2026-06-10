import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerExit = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      removeToast(id);
    }, 250);
  }, [removeToast]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type, duration, exiting: false };
    
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      triggerExit(id);
    }, duration - 250);
  }, [triggerExit]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast: triggerExit }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-card toast-card--${toast.type} ${toast.exiting ? 'toast-exit' : ''}`}
          >
            <span className="material-icons toast-icon">{getIcon(toast.type)}</span>
            <div className="toast-message">{toast.message}</div>
            <button
              onClick={() => triggerExit(toast.id)}
              className="toast-close-btn"
              aria-label="Dismiss"
            >
              <span className="material-icons">close</span>
            </button>
            {!toast.exiting && (
              <div
                className="toast-progress-bar"
                style={{ animationDuration: `${toast.duration}ms` }}
              />
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
