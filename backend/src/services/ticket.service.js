import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import generateTicketNumber from '../utils/generateTicketNumber.js';

class TicketService {
  /**
   * Create a new ticket
   */
  static async createTicket(data, userId) {
    const { title, description, category, priority } = data;

    if (!title || !description || !category) {
      const error = new Error('Title, description, and category are required');
      error.statusCode = 400;
      throw error;
    }

    const ticketNumber = await generateTicketNumber();

    const ticket = await Ticket.create({
      ticketNumber,
      title,
      description,
      category,
      priority: priority || 'Medium',
      createdBy: userId,
      statusHistory: [
        {
          status: 'Open',
          changedBy: userId,
          changedAt: new Date()
        }
      ]
    });

    return ticket;
  }

  /**
   * Get filtered, searched, and paginated tickets based on user role
   */
  static async getTickets(query, user) {
    const { status, priority, category, search, page = 1, limit = 10 } = query;
    const filter = {};

    // 1. Role-based restrictions
    if (user.role === 'User') {
      filter.createdBy = user._id;
    } else if (user.role === 'Agent') {
      filter.assignedTo = user._id;
    }
    // Admin has no role restrictions, sees all

    // 2. Status/Priority/Category Filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    // 3. Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // 4. Pagination & Query execution
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Ticket.countDocuments(filter);
    const pages = Math.ceil(total / limitNum);

    return {
      tickets,
      pagination: {
        total,
        page: parseInt(page),
        limit: limitNum,
        pages
      }
    };
  }

  /**
   * Get ticket by ID with permission checks
   */
  static async getTicketById(id, user) {
    const ticket = await Ticket.findById(id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('comments.user', 'name email role')
      .populate('statusHistory.changedBy', 'name email role');

    if (!ticket) {
      const error = new Error('Ticket not found');
      error.statusCode = 404;
      throw error;
    }

    // Role-based authorization check
    if (user.role === 'User' && ticket.createdBy._id.toString() !== user._id.toString()) {
      const error = new Error('Unauthorized to view this ticket');
      error.statusCode = 403;
      throw error;
    }

    if (user.role === 'Agent' && (!ticket.assignedTo || ticket.assignedTo._id.toString() !== user._id.toString())) {
      const error = new Error('Unauthorized to view this ticket');
      error.statusCode = 403;
      throw error;
    }

    return ticket;
  }

  /**
   * Update ticket — Admin can update all fields; User can edit own Open tickets
   */
  static async updateTicket(id, data, user) {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      const error = new Error('Ticket not found');
      error.statusCode = 404;
      throw error;
    }

    // Authorization checks
    if (user.role === 'Agent') {
      const error = new Error('Agents cannot edit ticket details');
      error.statusCode = 403;
      throw error;
    }

    if (user.role === 'User') {
      if (ticket.createdBy.toString() !== user._id.toString()) {
        const error = new Error('Unauthorized to edit this ticket');
        error.statusCode = 403;
        throw error;
      }
      if (ticket.status !== 'Open') {
        const error = new Error('Tickets can only be edited when they are Open');
        error.statusCode = 400;
        throw error;
      }
    }

    // Update core fields
    const { title, description, category, priority, assignedTo, status } = data;
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (category) ticket.category = category;
    if (priority) ticket.priority = priority;

    // Admin-only: update agent assignment
    if (user.role === 'Admin' && assignedTo !== undefined) {
      if (assignedTo === null || assignedTo === '') {
        ticket.assignedTo = null;
      } else {
        const agent = await User.findById(assignedTo);
        if (!agent || agent.role !== 'Agent') {
          const error = new Error('Assigned user must have the Agent role');
          error.statusCode = 400;
          throw error;
        }
        ticket.assignedTo = assignedTo;
      }
    }

    // Admin-only: update status with audit trail
    if (user.role === 'Admin' && status && status !== ticket.status) {
      const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
      if (!validStatuses.includes(status)) {
        const error = new Error('Invalid status value');
        error.statusCode = 400;
        throw error;
      }
      ticket.status = status;
      ticket.statusHistory.push({
        status,
        changedBy: user._id,
        changedAt: new Date()
      });
    }

    await ticket.save();
    return this.getTicketById(ticket._id, user);
  }

  /**
   * Delete ticket (Admin or Creator-when-Open only)
   */
  static async deleteTicket(id, user) {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      const error = new Error('Ticket not found');
      error.statusCode = 404;
      throw error;
    }

    // Authorization checks
    if (user.role === 'Agent') {
      const error = new Error('Agents cannot delete tickets');
      error.statusCode = 403;
      throw error;
    }

    if (user.role === 'User') {
      if (ticket.createdBy.toString() !== user._id.toString()) {
        const error = new Error('Unauthorized to delete this ticket');
        error.statusCode = 403;
        throw error;
      }
      if (ticket.status !== 'Open') {
        const error = new Error('Tickets can only be deleted when they are Open');
        error.statusCode = 400;
        throw error;
      }
    }

    await ticket.deleteOne();
    return { id };
  }

  /**
   * Update ticket status (with strict role-based lifecycle checking)
   */
  static async updateTicketStatus(id, status, user) {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      const error = new Error('Ticket not found');
      error.statusCode = 404;
      throw error;
    }

    const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      const error = new Error('Invalid status value');
      error.statusCode = 400;
      throw error;
    }

    // Role-specific constraints
    if (user.role === 'User') {
      if (ticket.createdBy.toString() !== user._id.toString()) {
        const error = new Error('Unauthorized to update this ticket status');
        error.statusCode = 403;
        throw error;
      }
      if (status !== 'Closed') {
        const error = new Error('Users can only close their own tickets');
        error.statusCode = 400;
        throw error;
      }
    } else if (user.role === 'Agent') {
      if (!ticket.assignedTo || ticket.assignedTo.toString() !== user._id.toString()) {
        const error = new Error('Agents can only update status of assigned tickets');
        error.statusCode = 403;
        throw error;
      }
      if (status === 'Open') {
        const error = new Error('Agents cannot set a ticket status back to Open');
        error.statusCode = 400;
        throw error;
      }
    }
    // Admin has no restrictions on status change

    // Apply the status change and audit trail
    ticket.status = status;
    ticket.statusHistory.push({
      status,
      changedBy: user._id,
      changedAt: new Date()
    });

    await ticket.save();
    return this.getTicketById(ticket._id, user);
  }

  /**
   * Assign ticket to an Agent (Admin only)
   */
  static async assignTicket(id, agentId, user) {
    // Only Admin allowed (this will also be guarded by middleware, but good to check here)
    if (user.role !== 'Admin') {
      const error = new Error('Only admins can assign tickets');
      error.statusCode = 403;
      throw error;
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      const error = new Error('Ticket not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if the agent exists and has the correct role
    if (agentId !== null) {
      const agent = await User.findById(agentId);
      if (!agent) {
        const error = new Error('Agent not found');
        error.statusCode = 404;
        throw error;
      }
      if (agent.role !== 'Agent') {
        const error = new Error('Tickets can only be assigned to users with the Agent role');
        error.statusCode = 400;
        throw error;
      }
    }

    ticket.assignedTo = agentId;
    
    // Automatically transition to "In Progress" if assigned to an agent and currently "Open"
    if (agentId && ticket.status === 'Open') {
      ticket.status = 'In Progress';
      ticket.statusHistory.push({
        status: 'In Progress',
        changedBy: user._id,
        changedAt: new Date()
      });
    }

    await ticket.save();
    return this.getTicketById(ticket._id, user);
  }

  /**
   * Add a comment to a ticket
   */
  static async addComment(id, message, user) {
    if (!message || message.trim() === '') {
      const error = new Error('Comment message is required');
      error.statusCode = 400;
      throw error;
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      const error = new Error('Ticket not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if the user has permission to comment
    if (user.role === 'User' && ticket.createdBy.toString() !== user._id.toString()) {
      const error = new Error('Unauthorized to comment on this ticket');
      error.statusCode = 403;
      throw error;
    }

    if (user.role === 'Agent' && (!ticket.assignedTo || ticket.assignedTo.toString() !== user._id.toString())) {
      const error = new Error('Unauthorized to comment on this ticket');
      error.statusCode = 403;
      throw error;
    }

    ticket.comments.push({
      user: user._id,
      message,
      createdAt: new Date()
    });

    await ticket.save();
    return this.getTicketById(ticket._id, user);
  }
}

export default TicketService;
