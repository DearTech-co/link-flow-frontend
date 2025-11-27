import apiClient from './client';

/**
 * Authentication API
 */

/**
 * Sign up a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.username - Unique username
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Promise} Response with token and user data
 */
export const signup = async (userData) => {
  return apiClient.post('/auth/signup', userData);
};

/**
 * Log in an existing user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email or username
 * @param {string} credentials.password - User's password
 * @returns {Promise} Response with token and user data
 */
export const login = async (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

/**
 * Verify the current user's token
 * @returns {Promise} Response with user data
 */
export const verifyToken = async () => {
  return apiClient.get('/auth/verify');
};

/**
 * Log out the current user (client-side only)
 * Clears token from localStorage
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

/**
 * Request password reset email
 * @param {string} email - User's email address
 * @returns {Promise} Response with success message
 */
export const forgotPassword = async (email) => {
  return apiClient.post('/auth/forgot-password', { email });
};

/**
 * Validate password reset token
 * @param {string} token - Password reset token
 * @returns {Promise} Response with user email
 */
export const validateResetToken = async (token) => {
  return apiClient.get(`/auth/reset-password/${token}`);
};

/**
 * Reset password with token
 * @param {string} token - Password reset token
 * @param {string} password - New password
 * @returns {Promise} Response with success message
 */
export const resetPassword = async (token, password) => {
  return apiClient.post(`/auth/reset-password/${token}`, { password });
};
