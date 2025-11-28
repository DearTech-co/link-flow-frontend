import { createContext, useState, useEffect, useContext } from 'react';
import {
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  verifyToken,
  refreshSession
} from '../api/auth.api';

// Create the context
const AuthContext = createContext(null);

/**
 * AuthProvider component
 * Manages authentication state globally
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const persistSession = (data) => {
    const payload = data?.data || data;
    if (payload?.token) {
      localStorage.setItem('authToken', payload.token);
    }
    if (payload?.refreshToken) {
      localStorage.setItem('refreshToken', payload.refreshToken);
    }
    if (payload?.user) {
      localStorage.setItem('user', JSON.stringify(payload.user));
      setUser(payload.user);
    }
    setIsAuthenticated(true);
  };

  const clearSession = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const tryRefresh = async (refreshToken) => {
    const response = await refreshSession(refreshToken);
    persistSession(response.data);
    return response.data;
  };

  /**
   * Verify token on mount and restore user session
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verify the token is still valid
          const response = await verifyToken();
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token verification failed:', error);
          // Token invalid: attempt refresh if available
          if (refreshToken) {
            try {
              await tryRefresh(refreshToken);
            } catch (refreshError) {
              console.error('Refresh failed:', refreshError);
              clearSession();
            }
          } else {
            clearSession();
          }
        }
      } else if (refreshToken) {
        try {
          await tryRefresh(refreshToken);
        } catch (error) {
          clearSession();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login function
   * @param {Object} credentials - Email/username and password
   */
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiLogin(credentials);

      // Store tokens and user data
      persistSession(response.data);

      return { success: true, data: response.data };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signup function
   * @param {Object} userData - User registration data
   */
  const signup = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiSignup(userData);

      // Store tokens and user data
      persistSession(response.data);

      return { success: true, data: response.data };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    apiLogout();
    clearSession();
    setError(null);
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 * Must be used within AuthProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
