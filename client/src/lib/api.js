import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Hardcoded for now, should use env
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
