import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.SERVER_BACKEND_URL || 'http://localhost:3000', // Use an environment variable for the base URL
  timeout: 10000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor (optional)
api.interceptors.request.use(
  (config) => {
    // Example: Add Authorization header
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor (optional)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Example: Handle 401 errors globally
    if (error.config?.url !== '/user/login' && error.response && error.response.status === 401) {
      alert('Session expired. Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default api;