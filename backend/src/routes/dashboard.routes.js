import express from 'express';
import DashboardController from '../controllers/dashboard.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Require authentication for all dashboard routes
router.use(authMiddleware);

// GET /api/dashboard/stats
router.get('/stats', DashboardController.getStats);

export default router;
