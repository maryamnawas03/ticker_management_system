import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * CONCEPT: JWT Authentication Middleware
 * 
 * JWT (JSON Web Token) is a stateless authentication method:
 * 1. User logs in and receives a token
 * 2. Token contains encoded user information
 * 3. Client sends token in every protected request
 * 4. Server verifies token signature without hitting database
 * 
 * Process:
 * 1. Extract token from Authorization header
 * 2. Verify token signature using JWT_SECRET
 * 3. Decode token to get user ID
 * 4. Fetch full user details from database
 * 5. Attach user to request object for use in controllers
 * 6. Continue to next middleware/route handler
 */

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from "Authorization: Bearer <token>"
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in.',
        statusCode: 401,
      });
    }

    // Verify token signature and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        statusCode: 401,
      });
    }

    // Attach user to request object for use in controllers
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
