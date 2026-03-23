import axios from 'axios';

// Use environment variable or fallback to localhost for development
// In production (Vercel), use the deployed backend URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
});

api.interceptors.request.use((config) => {
  const token = window.top.localStorage.getItem("jwt"); // Use top window to avoid iframe context issues
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired/invalid token and user data
      window.top.localStorage.removeItem('jwt');
      window.top.localStorage.removeItem('user');
      window.top.localStorage.removeItem('cartItems');
      console.warn('Authentication expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

export default api;
