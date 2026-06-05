import api from './axiosInstance';

// Stub — full implementation on Day 3
export const getTicketsRequest = (params) =>
  api.get('/tickets', { params });

export const getTicketByIdRequest = (id) =>
  api.get(`/tickets/${id}`);

export const createTicketRequest = (data) =>
  api.post('/tickets', data);

export const updateTicketRequest = (id, data) =>
  api.put(`/tickets/${id}`, data);

export const deleteTicketRequest = (id) =>
  api.delete(`/tickets/${id}`);

export const updateTicketStatusRequest = (id, status) =>
  api.patch(`/tickets/${id}/status`, { status });

export const assignTicketRequest = (id, agentId) =>
  api.patch(`/tickets/${id}/assign`, { agentId });

export const addCommentRequest = (id, message) =>
  api.post(`/tickets/${id}/comments`, { message });
