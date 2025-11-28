import { getAuthToken, setAuthToken, clearAuthToken } from '../services/storage.js';

const profileCache = new Map(); // tabId -> profileData

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
      if (cached) {
        sendResponse({ tab, profileData: cached });
        return;
      }

      if (!tab?.id) {
        sendResponse({ tab: tab || null, profileData: null });
        return;
      }

      chrome.tabs.sendMessage(tab.id, { type: 'REQUEST_PROFILE_DATA' }, (resp) => {
        if (chrome.runtime.lastError) {
          console.warn('[LinkFlow Background] Failed to fetch profile from content script:', chrome.runtime.lastError.message);
          sendResponse({ tab, profileData: null });
          return;
        }

        const profile = resp?.profile || null;
        if (profile) {
          const entry = {
            profile,
            url: tab.url || null,
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

  return false;
});

chrome.tabs.onRemoved.addListener((tabId) => {
  profileCache.delete(tabId);
});
