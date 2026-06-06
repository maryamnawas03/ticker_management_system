import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

class DashboardService {
  /**
   * Get ticket stats based on user role:
   * - Admin: sees all system tickets + user stats
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

    let userStats = null;
    if (user.role === 'Admin') {
      const [totalUsers, admins, agents, users] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'Admin' }),
        User.countDocuments({ role: 'Agent' }),
        User.countDocuments({ role: 'User' })
      ]);
      userStats = { totalUsers, admins, agents, users };
    }

    return { 
      total, 
      open, 
      inProgress, 
      resolved, 
      closed, 
      urgent,
      ...(userStats && { userStats })
    };
  }
}

export default DashboardService;
