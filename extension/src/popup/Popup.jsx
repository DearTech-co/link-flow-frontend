import React, { useEffect, useMemo, useState, useRef } from 'react';
import { login, verifyToken, createProspect, checkProspect, updateProspect } from '../services/api.js';
import {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  getRefreshToken,
  setRefreshToken,
  clearRefreshToken
} from '../services/storage.js';
import LoginForm from '../components/LoginForm.jsx';
import AddProspectForm from '../components/AddProspectForm.jsx';
import ProspectSuccess from '../components/ProspectSuccess.jsx';

async function getActiveProfile(retries = 3, delay = 500) {
  return new Promise((resolve) => {
    const attemptFetch = (attemptsLeft) => {
      try {
        chrome.runtime.sendMessage({ type: 'GET_ACTIVE_PROFILE' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('[LinkFlow Popup] Error getting active profile:', chrome.runtime.lastError);
            if (attemptsLeft > 0) {
              console.log(`[LinkFlow Popup] Retrying profile fetch... (${attemptsLeft} attempts left)`);
              setTimeout(() => attemptFetch(attemptsLeft - 1), delay);
            } else {
              resolve(null);
            }
            return;
          }

          const profile = response?.profileData?.profile || null;

          // If profile is empty but we have retries left, try again
          if (!profile && attemptsLeft > 0) {
            console.log(`[LinkFlow Popup] Empty profile, retrying... (${attemptsLeft} attempts left)`);
            setTimeout(() => attemptFetch(attemptsLeft - 1), delay);
            return;
          }

          resolve(profile);
        });
      } catch (err) {
        console.error('[LinkFlow Popup] Exception getting active profile:', err);
        if (attemptsLeft > 0) {
          setTimeout(() => attemptFetch(attemptsLeft - 1), delay);
        } else {
          resolve(null);
        }
      }
    };

    attemptFetch(retries);
  });
}

function Popup() {
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkingExistence, setCheckingExistence] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [lastProspect, setLastProspect] = useState(null);
  const [existingProspect, setExistingProspect] = useState(null);
  const [mode, setMode] = useState(null); // 'add' | 'update' | null
  const [wasUpdate, setWasUpdate] = useState(false); // Track if last action was update

  // Refs for race condition prevention
  const isMountedRef = useRef(true);
  const checkAbortControllerRef = useRef(null);
  const currentProfileUrlRef = useRef(null);

  const initialForm = useMemo(() => {
    // If we have an existing prospect, prefer its data (database is source of truth)
    // but allow scraped data to fill in missing fields
    if (existingProspect) {
      return {
        linkedinUrl: existingProspect.linkedinUrl || profile?.linkedinUrl || '',
        firstName: existingProspect.firstName || profile?.firstName || '',
        lastName: existingProspect.lastName || profile?.lastName || '',
        jobTitle: existingProspect.jobTitle || profile?.jobTitle || '',
        companyName: existingProspect.companyName || profile?.companyName || '',
        notes: existingProspect.notes || ''
      };
    }

    // New prospect - use scraped data
    return {
      linkedinUrl: profile?.linkedinUrl || '',
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      jobTitle: profile?.jobTitle || '',
      companyName: profile?.companyName || '',
      notes: ''
    };
  }, [profile, existingProspect]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Abort any in-flight check requests
      if (checkAbortControllerRef.current) {
        checkAbortControllerRef.current = 'cancelled';
      }
    };
  }, []);

  useEffect(() => {
    async function init() {
      try {
        setProfileLoading(true);
        const [storedToken, storedRefreshToken, activeProfile] = await Promise.all([
          getAuthToken(),
          getRefreshToken(),
          getActiveProfile()
        ]);

        // Check if component was unmounted during async operation
        if (!isMountedRef.current) return;

        console.log('[LinkFlow Popup] Initializing with stored token:', storedToken ? 'Found' : 'Not found', 'Refresh:', storedRefreshToken ? 'Found' : 'Not found');
        console.log('[LinkFlow Popup] Active profile:', activeProfile);
        setProfile(activeProfile);
        currentProfileUrlRef.current = activeProfile?.linkedinUrl || null;
        setProfileLoading(false);

        if (storedToken || storedRefreshToken) {
          setAuthenticating(true);
          try {
            const verified = await verifyToken(storedToken || undefined);

            // Check if unmounted
            if (!isMountedRef.current) return;

            console.log('[LinkFlow Popup] Token verified:', verified?.data?.user?.email);
            setToken(storedToken || verified?.data?.token || null);
            setUser(verified?.data?.user || null);
          } catch (err) {
            // Check if unmounted
            if (!isMountedRef.current) return;

            console.error('[LinkFlow Popup] Token verification failed:', err);
            // Only clear token if it's actually invalid (401), not for network errors
            if (err?.status === 401) {
              await clearAuthToken();
              await clearRefreshToken();
              setToken(null);
              setUser(null);
              setError('Session expired. Please login again.');
            } else {
              // Network error - keep token for retry
              setToken(storedToken);
              setError('Failed to verify session. Check your connection.');
            }
          } finally {
            if (isMountedRef.current) {
              setAuthenticating(false);
            }
          }
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        console.error('[LinkFlow Popup] Initialization error:', err);
        setError(err?.message || 'Failed to initialize extension.');
        setProfileLoading(false);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }

    init();
  }, []);

  // Check if prospect exists when we have both token and profile
  useEffect(() => {
    async function checkExistence() {
      // Don't check if we're still loading, not authenticated, or no profile URL
      if (loading || !token || !profile?.linkedinUrl || profileLoading) {
        return;
      }

      // Don't check if URL hasn't changed (prevents re-checking on re-render)
      if (currentProfileUrlRef.current === profile.linkedinUrl && mode !== null) {
        return;
      }

      // Abort previous check if still running
      if (checkAbortControllerRef.current) {
        checkAbortControllerRef.current = 'cancelled';
      }

      // Create new abort flag
      const abortFlag = {};
      checkAbortControllerRef.current = abortFlag;

      setCheckingExistence(true);
      setError('');
      currentProfileUrlRef.current = profile.linkedinUrl;

      try {
        console.log('[LinkFlow Popup] Checking if prospect exists:', profile.linkedinUrl);
        const result = await checkProspect(profile.linkedinUrl, token);

        // Check if this request was cancelled or component unmounted
        if (!isMountedRef.current || checkAbortControllerRef.current !== abortFlag) {
          console.log('[LinkFlow Popup] Check cancelled or stale');
          return;
        }

        const exists = result?.data?.exists || false;
        const prospect = result?.data?.prospect || null;

        console.log('[LinkFlow Popup] Prospect exists:', exists, prospect);

        if (exists && prospect) {
          setExistingProspect(prospect);
          setMode('update');
        } else {
          setExistingProspect(null);
          setMode('add');
        }
      } catch (err) {
        // Check if cancelled or unmounted
        if (!isMountedRef.current || checkAbortControllerRef.current !== abortFlag) {
          return;
        }

        console.error('[LinkFlow Popup] Error checking prospect existence:', err);

        // For non-critical errors (network, etc), default to add mode
        if (err?.status === 401) {
          setError('Session expired. Please login again.');
          await clearAuthToken();
          await clearRefreshToken();
          setToken(null);
          setUser(null);
        } else {
          // Network error or other - assume new prospect to allow user to proceed
          console.warn('[LinkFlow Popup] Failed to check existence, defaulting to add mode');
          setExistingProspect(null);
          setMode('add');
        }
      } finally {
        if (isMountedRef.current && checkAbortControllerRef.current === abortFlag) {
          setCheckingExistence(false);
          checkAbortControllerRef.current = null;
        }
      }
    }

    checkExistence();
  }, [loading, token, profile, profileLoading, mode]);

  const handleLogin = async (email, password) => {
    setError('');
    setAuthenticating(true);
    try {
      const res = await login(email, password);
      const nextToken = res?.data?.token;
      const nextRefreshToken = res?.data?.refreshToken;
      const nextUser = res?.data?.user;
      if (!nextToken) {
        throw new Error('No token returned from API.');
      }
      await setAuthToken(nextToken);
      if (nextRefreshToken) {
        await setRefreshToken(nextRefreshToken);
      }
      setToken(nextToken);
      setUser(nextUser || null);
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setAuthenticating(false);
    }
  };

  const handleSubmitProspect = async (formData) => {
    if (!token) {
      setError('You must be logged in.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      let result;

      if (mode === 'update' && existingProspect?._id) {
        // Update existing prospect
        console.log('[LinkFlow Popup] Updating prospect:', existingProspect._id);
        result = await updateProspect(existingProspect._id, formData, token);
        setWasUpdate(true);
      } else {
        // Create new prospect
        console.log('[LinkFlow Popup] Creating new prospect');
        result = await createProspect(formData, token);
        setWasUpdate(false);
      }

      if (!isMountedRef.current) return;

      const prospect = result?.data?.prospect || result?.data || null;
      setLastProspect(prospect);

      // Update existing prospect state if we just updated
      if (mode === 'update') {
        setExistingProspect(prospect);
      }

      // Notify content script to update button state
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: mode === 'update' ? 'PROSPECT_UPDATED' : 'PROSPECT_ADDED',
            prospect
          }).catch(err => console.warn('[LinkFlow Popup] Failed to notify content script:', err));
        }
      } catch (err) {
        console.warn('[LinkFlow Popup] Failed to get active tab:', err);
      }
    } catch (err) {
      if (!isMountedRef.current) return;

      console.error('[LinkFlow Popup] Error submitting prospect:', err);

      // Handle specific error cases
      if (err?.status === 401) {
        setError('Session expired. Please login again.');
        await clearAuthToken();
        await clearRefreshToken();
        setToken(null);
        setUser(null);
      } else if (err?.status === 404 && mode === 'update') {
        // Prospect was deleted - switch to add mode
        setError('This prospect was deleted. Saving as new...');
        setExistingProspect(null);
        setMode('add');
      } else if (err?.status === 400 && err?.message?.includes('duplicate')) {
        // Duplicate detected during create - try to fetch and switch to update
        setError('This prospect already exists. Please refresh to update.');
      } else {
        setError(err?.message || `Failed to ${mode === 'update' ? 'update' : 'add'} prospect.`);
      }
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await clearAuthToken();
      await clearRefreshToken();
      setToken(null);
      setUser(null);
      setLastProspect(null);
      setExistingProspect(null);
      setMode(null);
      setWasUpdate(false);
      setError('');
    } catch (err) {
      console.error('[LinkFlow Popup] Logout error:', err);
      setError('Failed to logout. Please try again.');
    }
  };

  const handleAddAnother = () => {
    setLastProspect(null);
    setWasUpdate(false);
    // Reset mode to trigger re-check
    setMode(null);
    setExistingProspect(null);
    currentProfileUrlRef.current = null;
  };

  const showLogin = !token || !user;

  return (
    <div className="popup">
      <div className="card">
        <div className="header">
          <div>
            <p className="title">LinkFlow</p>
            <p className="subtitle">Save LinkedIn prospects to your CRM</p>
          </div>
          {user && (
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        {profile && (
          <div className="profile-chip">
            {profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : 'LinkedIn profile detected'}
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {loading ? (
          <p className="subtitle">Loading...</p>
        ) : showLogin ? (
          <LoginForm onSubmit={handleLogin} loading={authenticating} />
        ) : lastProspect ? (
          <ProspectSuccess
            prospect={lastProspect}
            onAddAnother={handleAddAnother}
            isUpdate={wasUpdate}
          />
        ) : profileLoading ? (
          <p className="subtitle">Loading profile data...</p>
        ) : checkingExistence ? (
          <p className="subtitle">Checking if prospect exists...</p>
        ) : !profile?.linkedinUrl ? (
          <p className="subtitle">Navigate to a LinkedIn profile to get started.</p>
        ) : (
          <AddProspectForm
            key={`${profile?.linkedinUrl}-${mode}`}
            initialValues={initialForm}
            loading={submitting}
            onSubmit={handleSubmitProspect}
            mode={mode}
            existingProspect={existingProspect}
          />
        )}

        <div className="footer">
          <span>{user ? `Signed in as ${user.email}` : 'Not signed in'}</span>
          <a className="link" href="https://link-flow.netlify.app" target="_blank" rel="noreferrer">Open app</a>
        </div>
      </div>
    </div>
  );
}

export default Popup;
