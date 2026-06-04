/**
 * CONCEPT: Role-Based Access Control (RBAC)
 * 
 * After authentication (user is verified), we need authorization (user has permission).
 * This middleware checks if user's role can access the route.
 * 
 * Usage: router.get('/admin-only', roleMiddleware('Admin'), controller)
 */

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        statusCode: 401,
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
        statusCode: 403,
      });
    }

    next();
  };
};

export default roleMiddleware;
