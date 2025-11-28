import { lazy, Suspense, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { useAnalytics, useScrollDepth } from '../hooks/useAnalytics';
import Hero from '../components/landing/Hero';
import Loading from '../components/common/Loading';

// Lazy load below-the-fold sections for performance
const Features = lazy(() => import('../components/landing/Features'));
const HowItWorks = lazy(() => import('../components/landing/HowItWorks'));
const Screenshots = lazy(() => import('../components/landing/Screenshots'));
const FinalCTA = lazy(() => import('../components/landing/FinalCTA'));
const Footer = lazy(() => import('../components/landing/Footer'));

/**
 * Landing Page
 * Public homepage with marketing content for unauthenticated users
 * Personalized dashboard preview for authenticated users
 */
function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { trackPageView } = useAnalytics();

  // Track page view and scroll depth
  useScrollDepth();

  useEffect(() => {
    trackPageView('/');
  }, [trackPageView]);

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>LinkFlow - Supercharge Your LinkedIn Prospecting</title>
        <meta
          name="title"
          content="LinkFlow - Supercharge Your LinkedIn Prospecting"
        />
        <meta
          name="description"
          content="Chrome extension for LinkedIn prospecting with AI-powered data enrichment. Capture profiles with one click, organize lists, and export to CSV."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://link-flow.netlify.app/" />
        <meta property="og:title" content="LinkFlow - LinkedIn Prospecting CRM" />
        <meta
          property="og:description"
          content="Streamline your LinkedIn prospecting workflow with our powerful Chrome extension and CRM."
        />
        <meta
          property="og:image"
          content="https://link-flow.netlify.app/og-image.jpg"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://link-flow.netlify.app/" />
        <meta
          property="twitter:title"
          content="LinkFlow - LinkedIn Prospecting CRM"
        />
        <meta
          property="twitter:description"
          content="Streamline your LinkedIn prospecting workflow"
        />
        <meta
          property="twitter:image"
          content="https://link-flow.netlify.app/og-image.jpg"
        />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'LinkFlow',
            applicationCategory: 'BusinessApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '127',
            },
          })}
        </script>
      </Helmet>

      {/* Main Content */}
      <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-200">
        {/* Hero Section - Always visible */}
        <Hero isAuthenticated={isAuthenticated} />

        {/* Lazy load below-fold sections */}
        <Suspense
          fallback={
            <div className="py-24">
              <Loading />
            </div>
          }
        >
          <Features />
          <HowItWorks />
          <Screenshots />
          <FinalCTA />
          <Footer />
        </Suspense>
      </div>
    </>
  );
}

export default LandingPage;
