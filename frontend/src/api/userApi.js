import api from './axiosInstance';

export const getUsersRequest = (params) =>
  api.get('/users', { params });

export const createUserRequest = (userData) =>
  api.post('/users', userData);

export const getAgentsRequest = () =>
  api.get('/users/agents');

export const getUserByIdRequest = (id) =>
  api.get(`/users/${id}`);

export const updateUserRoleRequest = (id, role) =>
  api.patch(`/users/${id}/role`, { role });

export const updateUserStatusRequest = (id, status) =>
  api.patch(`/users/${id}/status`, { status });
