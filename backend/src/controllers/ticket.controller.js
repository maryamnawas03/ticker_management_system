import TicketService from '../services/ticket.service.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

class TicketController {
  // Create a new ticket
  static createTicket = asyncHandler(async (req, res) => {
    const result = await TicketService.createTicket(req.body, req.user._id);
    return res.status(201).json(
      new ApiResponse(201, result, 'Ticket created successfully')
    );
  });

  // Get list of tickets (filtered, searched, paginated)
  static getTickets = asyncHandler(async (req, res) => {
    const result = await TicketService.getTickets(req.query, req.user);
    return res.status(200).json(
      new ApiResponse(200, result, 'Tickets retrieved successfully')
    );
  });

  // Get ticket by ID
  static getTicketById = asyncHandler(async (req, res) => {
    const result = await TicketService.getTicketById(req.params.id, req.user);
    return res.status(200).json(
      new ApiResponse(200, result, 'Ticket details retrieved successfully')
    );
  });

  // Update ticket details (PUT)
  static updateTicket = asyncHandler(async (req, res) => {
    const result = await TicketService.updateTicket(req.params.id, req.body, req.user);
    return res.status(200).json(
      new ApiResponse(200, result, 'Ticket updated successfully')
    );
  });

  // Delete ticket
  static deleteTicket = asyncHandler(async (req, res) => {
    const result = await TicketService.deleteTicket(req.params.id, req.user);
    return res.status(200).json(
      new ApiResponse(200, result, 'Ticket deleted successfully')
    );
  });

  // Update ticket status
  static updateTicketStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const result = await TicketService.updateTicketStatus(req.params.id, status, req.user);
    return res.status(200).json(
      new ApiResponse(200, result, `Ticket status updated to ${status}`)
    );
  });

  // Assign agent
  static assignTicket = asyncHandler(async (req, res) => {
    const { agentId } = req.body;
    const result = await TicketService.assignTicket(req.params.id, agentId, req.user);
    return res.status(200).json(
      new ApiResponse(200, result, agentId ? 'Ticket assigned successfully' : 'Ticket unassigned successfully')
    );
  });

  // Add comment
  static addComment = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const result = await TicketService.addComment(req.params.id, message, req.user);
    return res.status(201).json(
      new ApiResponse(201, result, 'Comment added successfully')
    );
  });
}

export default TicketController;
