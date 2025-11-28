import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import Button from '../common/Button';
import DarkModeToggle from '../common/DarkModeToggle';

/**
 * Hero Section
 * Displays different content based on authentication status
 * - Unauthenticated: Marketing content with CTA buttons
 * - Authenticated: Personalized welcome with quick stats
 */
function Hero({ isAuthenticated }) {
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();

  const handleCTAClick = (buttonName) => {
    trackEvent('cta_click', { button_name: buttonName, section: 'hero' });
  };

  return (
    <section className="relative bg-gradient-to-b from-linkedin-25 to-white dark:from-dark-card dark:to-dark-bg">
      {/* Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <svg
              className="h-10 w-10 text-linkedin-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span className="text-2xl font-bold text-gray-900 dark:text-dark-text">
              LinkFlow
            </span>
          </Link>

          {/* Navigation Actions */}
          <div className="flex items-center gap-4">
            <DarkModeToggle />

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" onClick={() => handleCTAClick('Go to Dashboard')}>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button
                    variant="ghost"
                    onClick={() => handleCTAClick('Login')}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="primary"
                    onClick={() => handleCTAClick('Sign Up')}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {isAuthenticated ? (
          <AuthenticatedHero user={user} onCTAClick={handleCTAClick} />
        ) : (
          <UnauthenticatedHero onCTAClick={handleCTAClick} />
        )}
      </div>
    </section>
  );
}

/**
 * Unauthenticated Hero
 * Marketing content for visitors
 */
function UnauthenticatedHero({ onCTAClick }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left Column: Content */}
      <div className="text-center lg:text-left space-y-8">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-dark-text leading-tight">
          LinkedIn Prospecting,{' '}
          <span className="text-linkedin-500">Simplified</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-dark-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
          Capture LinkedIn profiles with one click, enrich with powerful data,
          and manage your prospects—all in one seamless workflow.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link to="/signup">
            <Button
              variant="primary"
              size="large"
              className="shadow-lg"
              onClick={() => onCTAClick('Get Started Free')}
            >
              Get Started Free
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="outline"
              size="large"
              onClick={() => onCTAClick('Sign In')}
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Trust Badge */}
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
          No credit card required • Free to start
        </p>
      </div>

      {/* Right Column: Visual */}
      <div className="relative">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-linkedin-100 to-linkedin-50 dark:from-linkedin-900/20 dark:to-linkedin-800/20 rounded-2xl transform rotate-3 scale-105 opacity-50"></div>

        {/* Screenshot placeholder */}
        <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl overflow-hidden border-4 border-white dark:border-dark-border p-8">
          <div className="space-y-4">
            <div className="h-8 bg-linkedin-100 dark:bg-linkedin-900/30 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-4/6"></div>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="h-24 bg-linkedin-50 dark:bg-linkedin-900/20 rounded-lg"></div>
              <div className="h-24 bg-linkedin-50 dark:bg-linkedin-900/20 rounded-lg"></div>
            </div>

            <div className="pt-4">
              <div className="h-10 bg-linkedin-500 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Floating badge */}
        <div className="absolute -bottom-6 -left-6 bg-white dark:bg-dark-card rounded-lg shadow-lg p-4 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-success/10 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                1000+ Prospects
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                Managed Daily
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Authenticated Hero
 * Personalized welcome for logged-in users
 */
function AuthenticatedHero({ user, onCTAClick }) {
  return (
    <div className="text-center space-y-8 max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-dark-text">
        Welcome back, {user?.firstName || 'there'}!
      </h1>

      <p className="text-xl text-gray-600 dark:text-dark-text-secondary">
        Ready to continue building your pipeline?
      </p>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Link to="/dashboard">
          <Button
            variant="primary"
            size="large"
            onClick={() => onCTAClick('Go to Dashboard')}
          >
            Go to Dashboard
          </Button>
        </Link>
        <Link to="/prospects/new">
          <Button
            variant="outline"
            size="large"
            onClick={() => onCTAClick('Add New Prospect')}
          >
            Add New Prospect
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
