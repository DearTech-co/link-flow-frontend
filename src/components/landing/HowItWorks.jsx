import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import Card from '../common/Card';

/**
 * How It Works Section
 * 3-step visual workflow showing how LinkFlow works
 */
function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const steps = [
    {
      number: 1,
      title: 'Install Extension',
      description:
        'Add LinkFlow to Chrome in seconds. Free to install, no credit card required.',
      icon: (
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          />
        </svg>
      ),
    },
    {
      number: 2,
      title: 'Capture Prospects',
      description:
        'Visit any LinkedIn profile and click the "Add" button. Data is automatically captured and enriched.',
      icon: (
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
    },
    {
      number: 3,
      title: 'Manage & Export',
      description:
        'Create lists, manage prospects, and export to CSV for your outreach campaigns.',
      icon: (
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16" ref={ref}>
          <h2
            className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-dark-text mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            How LinkFlow Works
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-dark-text-secondary transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            From LinkedIn profile to organized pipeline in three simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connector Line (desktop only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-linkedin-200 via-linkedin-300 to-linkedin-200 dark:from-linkedin-800 dark:via-linkedin-700 dark:to-linkedin-800 transform -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                <Card className="text-center relative bg-white dark:bg-dark-bg h-full">
                  {/* Step Number Badge */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="h-12 w-12 bg-linkedin-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="pt-8 pb-6">
                    <div className="inline-flex items-center justify-center h-20 w-20 bg-linkedin-50 dark:bg-linkedin-900/20 rounded-2xl mb-6">
                      <div className="text-linkedin-500">{step.icon}</div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-dark-text mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-gray-600 dark:text-dark-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
