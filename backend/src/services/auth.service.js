import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * CONCEPT: Service Layer
 * 
 * Services contain business logic separated from routes.
 * Controllers call services, services interact with database.
 * This keeps code organized and reusable.
 */

class AuthService {
  static generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
  }

  static async register(name, email, password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({ name, email, password });
    const token = this.generateToken(user._id);

    return { user: user.toObject(), token };
  }

  static async login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user._id);
    user.password = undefined;

    return { user: user.toObject(), token };
  }

  static async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user.toObject();
  }
}

export default AuthService;
