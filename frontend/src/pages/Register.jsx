import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../features/auth/authSlice';
import ErrorMessage from '../components/common/ErrorMessage';
import Loader from '../components/common/Loader';

/**
 * Register Page
 *
 * New users sign up with Name, Email, Password.
 * Role defaults to 'User' — Admin assigns roles later.
 * Redirects to /dashboard on success.
 */
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
  }, [token, navigate]);

  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email';
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) errors.confirm = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
    }));
    if (registerUser.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">⚡</div>
          <h1 className="auth-title">TicketFlow</h1>
          <p className="auth-subtitle">Create your account</p>
        </div>

        {error && (
          <ErrorMessage message={error} onDismiss={() => dispatch(clearError())} />
        )}

        <form id="register-form" className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="reg-name" className="field-label">Full name</label>
            <input
              id="reg-name"
              name="name"
              type="text"
              autoComplete="name"
              className={`field-input${fieldErrors.name ? ' field-input--error' : ''}`}
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange}
            />
            {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
          </div>

          <div className="field-group">
            <label htmlFor="reg-email" className="field-label">Email address</label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password" className="field-label">Password</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              autoComplete="new-password"
              className={`field-input${fieldErrors.password ? ' field-input--error' : ''}`}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
            />
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          <div className="field-group">
            <label htmlFor="reg-confirm" className="field-label">Confirm password</label>
            <input
              id="reg-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              className={`field-input${fieldErrors.confirm ? ' field-input--error' : ''}`}
              placeholder="••••••••"
              value={form.confirm}
              onChange={handleChange}
            />
            {fieldErrors.confirm && <p className="field-error">{fieldErrors.confirm}</p>}
          </div>

          <p className="auth-note">
            ℹ Your account will be created as <strong>User</strong>. An Admin can change your role.
          </p>

          <button
            id="register-submit-btn"
            type="submit"
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? <Loader size="sm" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
