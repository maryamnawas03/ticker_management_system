/**
 * CONCEPT: Global Error Handling Middleware
 * 
 * Express middleware that runs when an error is passed to next(error)
 * or when we throw an error in a controller.
 * 
 * Middleware signature: (err, req, res, next)
 * The 4 parameters tell Express this is an error handler.
 * 
 * This middleware:
 * 1. Catches all errors from controllers
 * 2. Formats them consistently
 * 3. Returns appropriate status codes
 * 4. Logs errors for debugging
 * 5. Never exposes sensitive error details to frontend
 */

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${statusCode} - ${message}`);

  // MongoDB Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
      statusCode: 400,
    });
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      statusCode: 400,
    });
  }

  // MongoDB Cast Error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      statusCode: 400,
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      statusCode: 401,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      statusCode: 401,
    });
  }

  // Generic error response
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
};

export default errorMiddleware;
