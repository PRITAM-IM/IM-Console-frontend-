import axios from "axios";
import { clearStoredToken, getStoredToken } from "./auth";

// Production backend is deployed separately on Vercel
// In production: uses VITE_API_URL environment variable
// In development: defaults to local backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  withCredentials: true, // Include cookies for authentication
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || '';
      // Only clear token if it's explicitly invalid/expired, not just missing
      // "No token provided" means the request didn't send the token (config issue)
      // We should NOT clear here — it would wipe a valid token due to a URL misconfiguration
      if (
        message.toLowerCase().includes('invalid token') ||
        message.toLowerCase().includes('token expired') ||
        message.toLowerCase().includes('jwt expired')
      ) {
        clearStoredToken();
      }
    }
    return Promise.reject(error);
  }
);

export default api;

