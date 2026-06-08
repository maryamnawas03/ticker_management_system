import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authenticates incoming requests using the Authorization header's Bearer JWT.

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
