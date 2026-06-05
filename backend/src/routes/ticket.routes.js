import express from 'express';
import TicketController from '../controllers/ticket.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';
import validateBody from '../middleware/validate.middleware.js';

const router = express.Router();

// All ticket routes require authentication
router.use(authMiddleware);

// GET /api/tickets - List tickets (filtered/searched/paginated)
router.get('/', TicketController.getTickets);

// POST /api/tickets - Create ticket (Users and Admins only)
router.post('/', roleMiddleware(['User', 'Admin']), validateBody(['title', 'description', 'category']), TicketController.createTicket);

// GET /api/tickets/:id - Get ticket by ID
router.get('/:id', TicketController.getTicketById);

// PUT /api/tickets/:id - Update ticket details (Users and Admins only)
router.put('/:id', roleMiddleware(['User', 'Admin']), TicketController.updateTicket);

// DELETE /api/tickets/:id - Delete ticket (Users and Admins only)
router.delete('/:id', roleMiddleware(['User', 'Admin']), TicketController.deleteTicket);

// PATCH /api/tickets/:id/status - Update status
router.patch('/:id/status', validateBody(['status']), TicketController.updateTicketStatus);

// PATCH /api/tickets/:id/assign - Assign to agent (Admin only)
router.patch('/:id/assign', roleMiddleware(['Admin']), TicketController.assignTicket);

// POST /api/tickets/:id/comments - Add a comment
router.post('/:id/comments', validateBody(['message']), TicketController.addComment);

export default router;
