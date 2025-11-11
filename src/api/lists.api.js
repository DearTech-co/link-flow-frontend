import apiClient from './client';

/**
 * Lists API
 */

/**
 * Get all lists for the authenticated user
 * @returns {Promise} Response with lists array
 */
export const getAllLists = async () => {
  return apiClient.get('/lists');
};

/**
 * Get a single list by ID
 * @param {string} id - List ID
 * @returns {Promise} Response with list data and populated prospects
 */
export const getListById = async (id) => {
  return apiClient.get(`/lists/${id}`);
};

/**
 * Create a new list
 * @param {Object} listData - List data
 * @param {string} listData.name - List name
 * @param {string} [listData.description] - List description
 * @param {Array<string>} [listData.prospects] - Array of prospect IDs
 * @returns {Promise} Response with created list
 */
export const createList = async (listData) => {
  return apiClient.post('/lists', listData);
};

/**
 * Update an existing list
 * @param {string} id - List ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} Response with updated list
 */
export const updateList = async (id, updates) => {
  return apiClient.put(`/lists/${id}`, updates);
};

/**
 * Delete a list
 * @param {string} id - List ID
 * @returns {Promise} Response confirming deletion
 */
export const deleteList = async (id) => {
  return apiClient.delete(`/lists/${id}`);
};

/**
 * Add prospects to a list
 * @param {string} id - List ID
 * @param {Array<string>} prospectIds - Array of prospect IDs to add
 * @returns {Promise} Response with updated list
 */
export const addProspectsToList = async (id, prospectIds) => {
  return apiClient.post(`/lists/${id}/prospects`, { prospectIds });
};

/**
 * Remove prospects from a list
 * @param {string} id - List ID
 * @param {Array<string>} prospectIds - Array of prospect IDs to remove
 * @returns {Promise} Response with updated list
 */
export const removeProspectsFromList = async (id, prospectIds) => {
  return apiClient.delete(`/lists/${id}/prospects`, {
    data: { prospectIds },
  });
};
