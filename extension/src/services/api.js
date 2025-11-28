const API_BASE_URL = (import.meta.env?.VITE_API_URL || 'https://link-flow-backend.fly.dev/api').replace(/\/+$/, '');

class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function getExtensionOrigin() {
  try {
    if (typeof chrome !== 'undefined' && chrome?.runtime?.id) {
      const origin = `chrome-extension://${chrome.runtime.id}`;
      console.log('[LinkFlow API] Using extension origin:', origin);
      return origin;
    }
  } catch (err) {
    console.error('[LinkFlow API] Error getting extension origin:', err);
  }
  console.warn('[LinkFlow API] No extension origin available');
  return null;
}

async function refreshAccessToken() {
  const refreshToken = await (await import('./storage.js')).getRefreshToken();
  const originHeader = getExtensionOrigin();
  if (!refreshToken) {
    throw new ApiError('No refresh token available', 401);
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(originHeader ? { Origin: originHeader } : {})
    },
    body: JSON.stringify({ refreshToken })
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    /* ignore */
  }

  if (!response.ok) {
    throw new ApiError(data?.message || 'Failed to refresh session', response.status);
  }

  const { token: accessToken, refreshToken: nextRefreshToken } = data?.data || {};
  const { setAuthToken, setRefreshToken } = await import('./storage.js');
  if (accessToken) await setAuthToken(accessToken);
  if (nextRefreshToken) await setRefreshToken(nextRefreshToken);
  return accessToken;
}

async function makeRequest(path, { method = 'GET', body, token, headers = {}, credentials, retry } = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const originHeader = getExtensionOrigin();

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...(originHeader ? { Origin: originHeader } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers
  };

  console.log('[LinkFlow API] Request:', method, url);
  console.log('[LinkFlow API] Headers:', { ...requestHeaders, Authorization: token ? 'Bearer ***' : undefined });

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      credentials
    });

    console.log('[LinkFlow API] Response status:', response.status, response.statusText);

    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      /* ignore non-JSON */
    }

    if (response.status === 401 && !retry) {
      try {
        const nextToken = await refreshAccessToken();
        return makeRequest(path, { method, body, token: nextToken, headers, credentials, retry: true });
      } catch (refreshErr) {
        console.error('[LinkFlow API] Refresh failed:', refreshErr);
        throw refreshErr;
      }
    }

    if (!response.ok) {
      const errorMessage = data?.message || `API request failed: ${response.status} ${response.statusText}`;
      console.error('[LinkFlow API] Error:', errorMessage, data);
      throw new ApiError(errorMessage, response.status, data?.data ?? null);
    }

    console.log('[LinkFlow API] Success:', data?.message || 'OK');
    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network error or other fetch failure
    console.error('[LinkFlow API] Network error:', err);
    throw new ApiError(err.message || 'Network request failed', 0, null);
  }
}

export async function login(email, password) {
  return makeRequest('/auth/login', {
    method: 'POST',
    body: { email, password }
  });
}

export async function verifyToken(token) {
  return makeRequest('/auth/verify', {
    method: 'GET',
    token
  });
}

export async function createProspect(prospectData, token) {
  return makeRequest('/prospects', {
    method: 'POST',
    body: prospectData,
    token
  });
}

export { API_BASE_URL, ApiError };
