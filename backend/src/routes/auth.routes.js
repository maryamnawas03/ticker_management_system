import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validateBody from '../middleware/validate.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Public routes — validate required fields before hitting the controller
router.post('/register', validateBody(['name', 'email', 'password']), asyncHandler(AuthController.register));
router.post('/login', validateBody(['email', 'password']), asyncHandler(AuthController.login));

// Protected route — requires valid JWT
router.get('/me', authMiddleware, asyncHandler(AuthController.getCurrentUser));

export default router;
