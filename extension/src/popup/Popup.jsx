import React, { useEffect, useMemo, useState } from 'react';
import { login, verifyToken, createProspect } from '../services/api.js';
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

async function getActiveProfile() {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage({ type: 'GET_ACTIVE_PROFILE' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('[LinkFlow Popup] Error getting active profile:', chrome.runtime.lastError);
          resolve(null);
          return;
        }
        resolve(response?.profileData?.profile || null);
      });
    } catch (err) {
      console.error('[LinkFlow Popup] Exception getting active profile:', err);
      resolve(null);
    }
  });
}

function Popup() {
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [lastProspect, setLastProspect] = useState(null);

  const initialForm = useMemo(() => ({
    linkedinUrl: profile?.linkedinUrl || '',
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    jobTitle: profile?.jobTitle || '',
    companyName: profile?.companyName || '',
    notes: ''
  }), [profile]);

  useEffect(() => {
    async function init() {
      try {
        const [storedToken, storedRefreshToken, activeProfile] = await Promise.all([
          getAuthToken(),
          getRefreshToken(),
          getActiveProfile()
        ]);

        console.log('[LinkFlow Popup] Initializing with stored token:', storedToken ? 'Found' : 'Not found', 'Refresh:', storedRefreshToken ? 'Found' : 'Not found');
        setProfile(activeProfile);

        if (storedToken || storedRefreshToken) {
          setAuthenticating(true);
          try {
            const verified = await verifyToken(storedToken || undefined);
            console.log('[LinkFlow Popup] Token verified:', verified?.data?.user?.email);
            setToken(storedToken || verified?.data?.token || null);
            setUser(verified?.data?.user || null);
          } catch (err) {
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
            setAuthenticating(false);
          }
        }
      } catch (err) {
        console.error('[LinkFlow Popup] Initialization error:', err);
        setError(err?.message || 'Failed to initialize extension.');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

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
      const result = await createProspect(formData, token);
      setLastProspect(result?.data || null);
    } catch (err) {
      setError(err?.message || 'Failed to add prospect.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await clearAuthToken();
    await clearRefreshToken();
    setToken(null);
    setUser(null);
    setLastProspect(null);
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
          <ProspectSuccess prospect={lastProspect} onAddAnother={() => setLastProspect(null)} />
        ) : (
          <AddProspectForm
            initialValues={initialForm}
            loading={submitting}
            onSubmit={handleSubmitProspect}
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
