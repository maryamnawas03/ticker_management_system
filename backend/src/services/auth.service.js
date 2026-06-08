import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Business logic for registering users, handling authentication, and generating secure session tokens.

class AuthService {
  static generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
  }

  static async register(name, email, password) {
    if (!name || !email || !password) {
      const error = new Error('Name, email, and password are required');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({ name, email, password });
    const token = this.generateToken(user._id);

    // Never return password
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  static async login(email, password) {
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Block inactive accounts
    if (user.status === 'Inactive') {
      const error = new Error('Your account has been deactivated. Please contact support.');
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
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
