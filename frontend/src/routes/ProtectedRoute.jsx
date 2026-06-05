import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/common/Loader';

/**
 * ProtectedRoute
 *
 * Blocks unauthenticated users from accessing private pages.
 * Shows a full-screen loader while the auth state is initializing
 * (prevents flash redirect to /login on page refresh).
 */
const ProtectedRoute = () => {
  const { token, isInitialized } = useSelector((state) => state.auth);

  // Still fetching current user from /api/auth/me — don't redirect yet
  if (!isInitialized) {
    return <Loader fullScreen />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
