import axios from 'axios';

const ACCESS_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const setTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('user');
};

// Choose API base URL from env, falling back to production backend
const envUrl = import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_API_URL;
const apiBaseUrl = (envUrl || 'https://link-flow-backend.fly.dev/api').replace(/\/+$/, '');

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let refreshRequest = null;

const refreshAccessToken = async () => {
  if (refreshRequest) return refreshRequest;

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  refreshRequest = apiClient.post('/auth/refresh', { refreshToken });

  try {
    const response = await refreshRequest;
    const { token: newAccessToken, refreshToken: newRefreshToken } = response.data?.data || {};
    setTokens(newAccessToken, newRefreshToken);
    return newAccessToken;
  } finally {
    refreshRequest = null;
  }
};

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle different types of errors
    if (error.response) {
      const { status, data } = error.response;

      if (
        status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/login') &&
        !originalRequest.url.includes('/auth/signup') &&
        !originalRequest.url.includes('/auth/refresh')
      ) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          clearTokens();
          // Only redirect if not already on login/signup page
          if (
            typeof window !== 'undefined' &&
            !window.location.pathname.includes('/login') &&
            !window.location.pathname.includes('/signup')
          ) {
            window.location.href = '/login';
          }
        }
      }

      switch (status) {
        case 403:
          console.error('Access forbidden:', data.message);
          break;
        case 404:
          console.error('Resource not found:', data.message);
          break;
        case 500:
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
