import { getAuthToken, setAuthToken, clearAuthToken } from '../services/storage.js';
import { checkProspect } from '../services/api.js';

const profileCache = new Map(); // tabId -> profileData

const hasProfileData = (entry) => {
  const profile = entry?.profile || entry;
  return Boolean(
    profile &&
    profile.linkedinUrl &&
    (profile.firstName || profile.lastName || profile.jobTitle || profile.companyName)
  );
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type } = message || {};

  if (type === 'CACHE_PROFILE') {
    try {
      if (sender?.tab?.id) {
        profileCache.set(sender.tab.id, {
          profile: message.profile || null,
          url: sender.tab.url || null,
          cachedAt: Date.now()
        });
        console.log('[LinkFlow Background] Profile cached for tab:', sender.tab.id);
      } else {
        console.warn('[LinkFlow Background] CACHE_PROFILE called without valid tab ID');
      }
      sendResponse({ success: true });
    } catch (err) {
      console.error('[LinkFlow Background] Error caching profile:', err);
      sendResponse({ success: false, error: err.message });
    }
    return false;
  }

  if (type === 'GET_ACTIVE_PROFILE') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs?.[0];
      const cached = tab ? profileCache.get(tab.id) : null;
      const urlChanged = cached?.url && tab?.url && cached.url !== tab.url;

      // Cache expires after 30 seconds
      const CACHE_TTL_MS = 30000;
      const cacheExpired = cached && (Date.now() - (cached.cachedAt || 0) > CACHE_TTL_MS);

      if (cached && hasProfileData(cached) && !urlChanged && !cacheExpired) {
        console.log('[LinkFlow Background] Returning cached profile for tab:', tab?.id);
        sendResponse({ tab, profileData: cached });
        return;
      }

      if (cacheExpired) {
        console.log('[LinkFlow Background] Cache expired for tab:', tab?.id);
      }

      if (!tab?.id) {
        sendResponse({ tab: tab || null, profileData: null });
        return;
      }

      console.log('[LinkFlow Background] Fetching fresh profile data for tab:', tab.id);
      chrome.tabs.sendMessage(tab.id, { type: 'REQUEST_PROFILE_DATA' }, (resp) => {
        if (chrome.runtime.lastError) {
          console.warn('[LinkFlow Background] Failed to fetch profile from content script:', chrome.runtime.lastError.message);
          sendResponse({ tab, profileData: null });
          return;
        }

        const profile = resp?.profile || null;
        if (hasProfileData(profile)) {
          const entry = {
            profile,
            url: profile.url || tab.url || null,
            cachedAt: Date.now()
          };
          profileCache.set(tab.id, entry);
          sendResponse({ tab, profileData: entry });
        } else {
          sendResponse({ tab, profileData: null });
        }
      });
    });
    return true;
  }

  if (type === 'GET_AUTH_TOKEN') {
    getAuthToken()
      .then((token) => sendResponse({ token: token || null }))
      .catch((err) => sendResponse({ error: err?.message || 'Failed to read token' }));
    return true;
  }

  if (type === 'SET_AUTH_TOKEN') {
    setAuthToken(message.token || '')
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ error: err?.message || 'Failed to store token' }));
    return true;
  }

  if (type === 'CLEAR_AUTH_TOKEN') {
    clearAuthToken()
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ error: err?.message || 'Failed to clear token' }));
    return true;
  }

  if (type === 'CHECK_PROSPECT') {
    // Proxy API call to check if prospect exists
    // Uses api.js service which has automatic token refresh on 401
    const { linkedinUrl, authToken } = message;

    if (!authToken || !linkedinUrl) {
      sendResponse({ success: false, error: 'Missing required parameters' });
      return false;
    }

    // Use centralized API service with automatic token refresh
    checkProspect(linkedinUrl, authToken)
      .then((data) => {
        sendResponse({
          success: true,
          exists: data?.data?.exists || false,
          prospect: data?.data?.prospect || null
        });
      })
      .catch((err) => {
        console.error('[LinkFlow Background] Error checking prospect:', err);
        sendResponse({
          success: false,
          error: err.message || 'Failed to check prospect'
        });
      });

    return true; // Indicates async response
  }

  return false;
});

chrome.tabs.onRemoved.addListener((tabId) => {
  profileCache.delete(tabId);
});
