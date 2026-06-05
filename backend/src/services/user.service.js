import User from '../models/User.js';

/**
 * User Service
 *
 * Business logic for user management (Admin-facing operations).
 * Keeps controllers thin and reusable.
 */

class UserService {
  /**
   * Get all users with optional pagination and filtering
   */
  static async getAllUsers({ page = 1, limit = 10, role, status, search } = {}) {
    const query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    return {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all agents (role = 'Agent', status = 'Active')
   * Used when assigning tickets to agents
   */
  static async getAgents() {
    const agents = await User.find({ role: 'Agent', status: 'Active' })
      .select('name email role status createdAt')
      .sort({ name: 1 });

    return agents;
  }

  /**
   * Get a single user by ID
   */
  static async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Update a user's role (Admin only)
   * Cannot change own role to prevent accidental lockout
   */
  static async updateRole(userId, newRole, requestingUserId) {
    const allowedRoles = ['Admin', 'Agent', 'User'];
    if (!allowedRoles.includes(newRole)) {
      const error = new Error(`Invalid role. Allowed roles: ${allowedRoles.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    if (userId === requestingUserId.toString()) {
      const error = new Error('You cannot change your own role');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  /**
   * Update a user's status (Active / Inactive) — soft delete pattern
   */
  static async updateStatus(userId, newStatus, requestingUserId) {
    const allowedStatuses = ['Active', 'Inactive'];
    if (!allowedStatuses.includes(newStatus)) {
      const error = new Error(`Invalid status. Allowed: ${allowedStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    if (userId === requestingUserId.toString()) {
      const error = new Error('You cannot change your own status');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status: newStatus },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }
}

export default UserService;
