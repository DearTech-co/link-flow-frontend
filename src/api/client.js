import axios from 'axios';

// Auto-detect API URL based on hostname
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'link-flow.netlify.app'
      ? 'https://link-flow-backend.fly.dev/api'
      : 'http://localhost:5005/api';
  }
  return 'http://localhost:5005/api'; // Fallback for SSR
};

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response.data;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');

          // Only redirect if not already on login/signup page
          if (!window.location.pathname.includes('/login') &&
              !window.location.pathname.includes('/signup')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', data.message);
          break;

        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;

        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;

        default:
          console.error('API error:', data.message);
      }

      // Return a consistent error structure
      return Promise.reject({
        message: data.message || 'An error occurred',
        status,
        data: data.data || null,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error: No response from server');
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
        data: null,
      });
    } else {
      // Something else happened
      console.error('Request error:', error.message);
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0,
        data: null,
      });
    }
  }
);

export default apiClient;
