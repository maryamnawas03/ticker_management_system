import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/auth/authSlice';
import ErrorMessage from '../components/common/ErrorMessage';
import Loader from '../components/common/Loader';

import { useToast } from '../context/ToastContext';

/**
 * Login Page
 *
 * Allows all roles to log in with email + password.
 * Redirects to /dashboard on success.
 * Shows inline validation and API error messages.
 */
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, token } = useSelector((state) => state.auth);
  const { addToast } = useToast();

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
  }, [token, navigate]);

  // Clear API error on unmount
  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const validate = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email';
    if (!form.password) errors.password = 'Password is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear field error on change
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      addToast(`Welcome back, ${result.payload.user?.name || 'User'}!`, 'success');
      navigate('/dashboard', { replace: true });
    } else if (loginUser.rejected.match(result)) {
      addToast(result.payload || 'Invalid email or password', 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="material-icons" style={{ fontSize: 36, color: 'var(--accent-light)' }}>flash_on</span>
          </div>
          <h1 className="auth-title">TicketFlow</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        {/* API Error */}
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => dispatch(clearError())}
          />
        )}

        {/* Form */}
        <form id="login-form" className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="login-email" className="field-label">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              className={`field-input${fieldErrors.email ? ' field-input--error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
          </div>

          <div className="field-group">
            <label htmlFor="login-password" className="field-label">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={`field-input${fieldErrors.password ? ' field-input--error' : ''}`}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? <Loader size="sm" /> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
