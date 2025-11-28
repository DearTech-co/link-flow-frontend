import { useScrollAnimation } from '../../hooks/useScrollAnimation';

/**
 * Screenshots Section
 * Showcases the extension and dashboard with placeholder images
 */
function Screenshots() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16" ref={ref}>
          <h2
            className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-dark-text mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            See LinkFlow in Action
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-dark-text-secondary transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            A seamless workflow from LinkedIn to your CRM.
          </p>
        </div>

        {/* Screenshots Grid */}
        <div className="space-y-16">
          {/* Screenshot 1: Extension */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="order-2 lg:order-1">
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-dark-border">
                {/* Placeholder for screenshot */}
                <div className="aspect-video bg-gradient-to-br from-linkedin-100 to-linkedin-50 dark:from-linkedin-900/20 dark:to-linkedin-800/20 flex items-center justify-center p-8">
                  <div className="text-center">
                    <svg
                      className="h-16 w-16 text-linkedin-400 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                      Extension Screenshot
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-4">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                One-Click Capture
              </h3>
              <p className="text-lg text-gray-600 dark:text-dark-text-secondary leading-relaxed">
                The floating widget appears on every LinkedIn profile. Fill in
                details, add to lists, and save—all without leaving the page.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 text-success flex-shrink-0 mt-1"
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
                  <p className="text-base text-gray-600 dark:text-dark-text-secondary">
                    Auto-detects duplicate prospects
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 text-success flex-shrink-0 mt-1"
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
                  <p className="text-base text-gray-600 dark:text-dark-text-secondary">
                    Pre-fills profile data automatically
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot 2: Dashboard */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                Powerful Dashboard
              </h3>
              <p className="text-lg text-gray-600 dark:text-dark-text-secondary leading-relaxed">
                View all prospects, filter by enrichment status, search by name
                or company, and manage lists—all from one clean interface.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 text-success flex-shrink-0 mt-1"
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
                  <p className="text-base text-gray-600 dark:text-dark-text-secondary">
                    Real-time enrichment tracking
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 text-success flex-shrink-0 mt-1"
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
                  <p className="text-base text-gray-600 dark:text-dark-text-secondary">
                    Bulk actions and CSV export
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-dark-border">
                {/* Placeholder for screenshot */}
                <div className="aspect-video bg-gradient-to-br from-linkedin-100 to-linkedin-50 dark:from-linkedin-900/20 dark:to-linkedin-800/20 flex items-center justify-center p-8">
                  <div className="text-center">
                    <svg
                      className="h-16 w-16 text-linkedin-400 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                      Dashboard Screenshot
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Screenshots;
