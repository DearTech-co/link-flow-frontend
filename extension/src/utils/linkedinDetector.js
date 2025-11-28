import { LINKEDIN_PROFILE_PATTERN } from './constants.js';

export function isLinkedInProfilePage(url) {
  return LINKEDIN_PROFILE_PATTERN.test(url || '');
}

export function extractProfileId(url) {
  const match = LINKEDIN_PROFILE_PATTERN.exec(url || '');
  return match?.[1] || null;
}

export function buildLinkedInUrl(profileId) {
  if (!profileId) return null;
  return `https://www.linkedin.com/in/${profileId}/`;
}
