import api from './axiosInstance';

// Stub — full implementation on Day 5
export const getDashboardStatsRequest = () =>
  api.get('/dashboard/stats');
