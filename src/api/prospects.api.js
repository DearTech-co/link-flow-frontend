import apiClient from './client';

/**
 * Prospects API
 */

/**
 * Get all prospects for the authenticated user
 * @returns {Promise} Response with prospects array
 */
export const getAllProspects = async () => {
  return apiClient.get('/prospects');
};

/**
 * Get a single prospect by ID
 * @param {string} id - Prospect ID
 * @returns {Promise} Response with prospect data
 */
export const getProspectById = async (id) => {
  return apiClient.get(`/prospects/${id}`);
};

/**
 * Create a new prospect
 * @param {Object} prospectData - Prospect data
 * @param {string} prospectData.linkedinUrl - LinkedIn profile URL
 * @param {string} [prospectData.firstName] - First name
 * @param {string} [prospectData.lastName] - Last name
 * @param {string} [prospectData.jobTitle] - Job title
 * @param {string} [prospectData.bio] - About/bio
 * @param {string} [prospectData.companyName] - Company name
 * @returns {Promise} Response with created prospect
 */
export const createProspect = async (prospectData) => {
  return apiClient.post('/prospects', prospectData);
};

/**
 * Update an existing prospect
 * @param {string} id - Prospect ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} Response with updated prospect
 */
export const updateProspect = async (id, updates) => {
  return apiClient.put(`/prospects/${id}`, updates);
};

/**
 * Delete a prospect
 * @param {string} id - Prospect ID
 * @returns {Promise} Response confirming deletion
 */
export const deleteProspect = async (id) => {
  return apiClient.delete(`/prospects/${id}`);
};

/**
 * Trigger enrichment for a prospect via Clay webhook
 * @param {string} id - Prospect ID
 * @returns {Promise} Response with enrichment status
 */
export const enrichProspect = async (id) => {
  return apiClient.post(`/prospects/${id}/enrich`);
};

/**
 * Export prospects to CSV
 * @param {Array<string>} [prospectIds] - Optional array of specific prospect IDs to export
 * @returns {Promise} Response with CSV data
 */
export const exportProspectsToCSV = async (prospectIds = null) => {
  const params = prospectIds ? { ids: prospectIds.join(',') } : {};
  return apiClient.get('/prospects/export/csv', {
    params,
    responseType: 'blob', // Important for file downloads
  });
};
