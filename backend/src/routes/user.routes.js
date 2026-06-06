import express from 'express';
import UserController from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// All user management routes require authentication + Admin role
router.use(authMiddleware);
router.use(roleMiddleware(['Admin']));

// GET /api/users          — list all users (with pagination, filter, search)
router.get('/', asyncHandler(UserController.getAllUsers));

// POST /api/users         — create a new user (Admin only)
router.post('/', asyncHandler(UserController.createUser));

// GET /api/users/agents   — list active agents (for ticket assignment)
// IMPORTANT: must be defined BEFORE /:id to avoid 'agents' being treated as an ID
router.get('/agents', asyncHandler(UserController.getAgents));

// GET /api/users/:id      — get single user
router.get('/:id', asyncHandler(UserController.getUserById));

// PATCH /api/users/:id/role   — change role
router.patch('/:id/role', asyncHandler(UserController.updateRole));

// PATCH /api/users/:id/status — activate or deactivate
router.patch('/:id/status', asyncHandler(UserController.updateStatus));

// DELETE /api/users/:id       — delete user (Admin only)
router.delete('/:id', asyncHandler(UserController.deleteUser));

export default router;
