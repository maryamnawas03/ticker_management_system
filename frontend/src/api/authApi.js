import api from './axiosInstance';

export const loginRequest = (credentials) =>
  api.post('/auth/login', credentials);

export const registerRequest = (userData) =>
  api.post('/auth/register', userData);

export const getMeRequest = () =>
  api.get('/auth/me');
