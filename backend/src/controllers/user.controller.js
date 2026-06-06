import UserService from '../services/user.service.js';
import ApiResponse from '../utils/apiResponse.js';

/**
 * User Controller
 *
 * Handles HTTP request/response for user management endpoints.
 * All routes are Admin-only (enforced by roleMiddleware in routes).
 */

class UserController {
  /**
   * GET /api/users
   * List all users with optional filtering and pagination
   */
  static async getAllUsers(req, res) {
    const { page, limit, role, status, search } = req.query;
    const result = await UserService.getAllUsers({ page, limit, role, status, search });
    return res.status(200).json(
      new ApiResponse(200, result, 'Users fetched successfully')
    );
  }

  /**
   * GET /api/users/agents
   * List all active agents (used in ticket assignment dropdown)
   */
  static async getAgents(req, res) {
    const agents = await UserService.getAgents();
    return res.status(200).json(
      new ApiResponse(200, agents, 'Agents fetched successfully')
    );
  }

  /**
   * GET /api/users/:id
   * Get a single user by MongoDB ObjectId
   */
  static async getUserById(req, res) {
    const user = await UserService.getUserById(req.params.id);
    return res.status(200).json(
      new ApiResponse(200, user, 'User fetched successfully')
    );
  }

  /**
   * PATCH /api/users/:id/role
   * Update a user's role (Admin only)
   */
  static async updateRole(req, res) {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json(new ApiResponse(400, null, 'Role is required'));
    }
    const user = await UserService.updateRole(req.params.id, role, req.user._id);
    return res.status(200).json(
      new ApiResponse(200, user, 'User role updated successfully')
    );
  }

  /**
   * PATCH /api/users/:id/status
   * Activate or deactivate a user account (Admin only)
   */
  static async updateStatus(req, res) {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json(new ApiResponse(400, null, 'Status is required'));
    }
    const user = await UserService.updateStatus(req.params.id, status, req.user._id);
    return res.status(200).json(
      new ApiResponse(200, user, 'User status updated successfully')
    );
  }

  /**
   * POST /api/users
   * Create a new user (Admin only)
   */
  static async createUser(req, res) {
    const { name, email, password, role, status } = req.body;
    const user = await UserService.createUser({ name, email, password, role, status });
    return res.status(201).json(
      new ApiResponse(201, user, 'User created successfully')
    );
  }

  /**
   * DELETE /api/users/:id
   * Delete a user (Admin only)
   */
  static async deleteUser(req, res) {
    await UserService.deleteUser(req.params.id, req.user._id);
    return res.status(200).json(
      new ApiResponse(200, null, 'User deleted successfully')
    );
  }
}

export default UserController;
