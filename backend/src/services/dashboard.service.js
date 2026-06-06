import Ticket from '../models/Ticket.js';

class DashboardService {
  /**
   * Get ticket stats based on user role:
   * - Admin: sees all system tickets
   * - Agent: sees only assigned tickets
   * - User: sees only created tickets
   */
  static async getStats(user) {
    const filter = {};

    if (user.role === 'User') {
      filter.createdBy = user._id;
    } else if (user.role === 'Agent') {
      filter.assignedTo = user._id;
    }

    const [total, open, inProgress, resolved, closed, urgent] = await Promise.all([
      Ticket.countDocuments(filter),
      Ticket.countDocuments({ ...filter, status: 'Open' }),
      Ticket.countDocuments({ ...filter, status: 'In Progress' }),
      Ticket.countDocuments({ ...filter, status: 'Resolved' }),
      Ticket.countDocuments({ ...filter, status: 'Closed' }),
      Ticket.countDocuments({ ...filter, priority: 'Urgent' })
    ]);

    return { total, open, inProgress, resolved, closed, urgent };
  }
}

export default DashboardService;
