import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * RoleRoute
 *
 * Blocks users whose role is not in `allowedRoles`.
 * Redirects to /dashboard so they see something useful instead of a blank page.
 *
 * Usage:
 *   <RoleRoute allowedRoles={['Admin']} />
 */
const RoleRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
