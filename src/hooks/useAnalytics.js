import { useCallback, useEffect } from 'react';
import posthog from 'posthog-js';

// Initialize PostHog (privacy-friendly analytics)
// Replace with your actual PostHog project API key
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || 'phc_DEMO_KEY';
const POSTHOG_HOST = 'https://app.posthog.com';

let isInitialized = false;

if (typeof window !== 'undefined' && !isInitialized) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    loaded: () => {
      if (import.meta.env.DEV) {
        console.log('[Analytics] PostHog initialized');
      }
    },
    autocapture: false, // Disable automatic event capture
    capture_pageview: false, // We'll manually track pageviews
  });
  isInitialized = true;
}

/**
 * Analytics Hook
 * Provides functions for tracking user interactions and page views
 * Uses PostHog for privacy-friendly analytics (GDPR compliant)
 */
export const useAnalytics = () => {
  const trackEvent = useCallback((eventName, properties = {}) => {
    if (typeof window !== 'undefined') {
      try {
        posthog.capture(eventName, properties);
        if (import.meta.env.DEV) {
          console.log('[Analytics] Event:', eventName, properties);
        }
      } catch (error) {
        console.error('[Analytics] Error tracking event:', error);
      }
    }
  }, []);

  const trackPageView = useCallback((path) => {
    if (typeof window !== 'undefined') {
      try {
        posthog.capture('$pageview', {
          path: path || window.location.pathname,
        });
        if (import.meta.env.DEV) {
          console.log('[Analytics] Page view:', path);
        }
      } catch (error) {
        console.error('[Analytics] Error tracking page view:', error);
      }
    }
  }, []);

  const identify = useCallback((userId, traits = {}) => {
    if (typeof window !== 'undefined') {
      try {
        posthog.identify(userId, traits);
        if (import.meta.env.DEV) {
          console.log('[Analytics] User identified:', userId);
        }
      } catch (error) {
        console.error('[Analytics] Error identifying user:', error);
      }
    }
  }, []);

  const reset = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        posthog.reset();
        if (import.meta.env.DEV) {
          console.log('[Analytics] User session reset');
        }
      } catch (error) {
        console.error('[Analytics] Error resetting session:', error);
      }
    }
  }, []);

  return {
    trackEvent,
    trackPageView,
    identify,
    reset,
  };
};

/**
 * Hook to track scroll depth
 * Tracks when user scrolls to 25%, 50%, 75%, and 100% of page
 */
export const useScrollDepth = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const milestones = new Set();

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

      // Track milestones
      if (scrollPercent >= 25 && !milestones.has(25)) {
        milestones.add(25);
        trackEvent('scroll_depth', { depth: 25 });
      }
      if (scrollPercent >= 50 && !milestones.has(50)) {
        milestones.add(50);
        trackEvent('scroll_depth', { depth: 50 });
      }
      if (scrollPercent >= 75 && !milestones.has(75)) {
        milestones.add(75);
        trackEvent('scroll_depth', { depth: 75 });
      }
      if (scrollPercent >= 95 && !milestones.has(100)) {
        milestones.add(100);
        trackEvent('scroll_depth', { depth: 100 });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackEvent]);
};
