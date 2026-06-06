import DashboardService from '../services/dashboard.service.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

class DashboardController {
  /**
   * Retrieve ticket dashboard stats
   */
  static getStats = asyncHandler(async (req, res) => {
    const stats = await DashboardService.getStats(req.user);
    return res.status(200).json(
      new ApiResponse(200, stats, 'Dashboard statistics retrieved successfully')
    );
  });
}

export default DashboardController;
