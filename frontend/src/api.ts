import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.SERVER_BACKEND_URL || 'http://localhost:3000', // Use an environment variable for the base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor (optional)
api.interceptors.request.use(
  async (config) => {
    // Example: Add Authorization header
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify if token is still valid before adding to header
      const authStore = await import('./main/stores/auth.store');
      if (authStore.default.isTokenValid(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Token is expired, try to refresh if keep connected is enabled
        const refreshed = await authStore.default.attemptAutoRefresh();
        if (refreshed && authStore.default.state.token) {
          config.headers.Authorization = `Bearer ${authStore.default.state.token}`;
        } else {
          // Could not refresh, redirect to login
          const router = await import('./main/router');
          if (router.default.currentRoute.value.name !== 'Login') {
            router.default.push({ name: 'Login' });
          }
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor (optional)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Example: Handle 401 errors globally
    if (error.config?.url !== '/user/login' && error.response && error.response.status === 401) {
      // Token is expired or invalid, try to refresh first
      const authStore = await import('./main/stores/auth.store');
      const refreshed = await authStore.default.attemptAutoRefresh();
      
      if (!refreshed) {
        // Could not refresh, clear authentication and redirect to login
        authStore.default.clearToken();
        
        const router = await import('./main/router');
        if (router.default.currentRoute.value.name !== 'Login') {
          router.default.push({ name: 'Login' });
        }
        
        alert('Session expired. Please log in again.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;