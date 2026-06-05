import axios from 'axios';

/**
 * Axios Instance
 *
 * Centralised HTTP client used by all API modules.
 *
 * Features:
 *  - Base URL from environment variable
 *  - Request interceptor: attaches JWT from localStorage automatically
 *  - Response interceptor: extracts `data` from the ApiResponse envelope,
 *    converts error messages to plain strings for Redux slices
 */

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Request Interceptor ───────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => {
    // Unwrap the ApiResponse envelope — return only `data` payload
    return response.data.data ?? response.data;
  },
  (error) => {
    // 401 = token invalid/expired → force logout
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    // Normalise error message for Redux rejectWithValue
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
