import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import Card from '../common/Card';

/**
 * Features Section
 * Showcases 4 key features of LinkFlow
 */
function Features() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const features = [
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
          />
        </svg>
      ),
      title: 'Chrome Extension',
      description:
        'Add prospects directly from LinkedIn profiles with a single click. No copy-paste, no manual data entry.',
      color: 'text-linkedin-500',
      bgColor: 'bg-linkedin-50 dark:bg-linkedin-900/20',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      title: 'Smart Enrichment',
      description:
        'Automatically enrich prospect data with company info, contact details, and professional insights via Clay API.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      ),
      title: 'Organized Lists',
      description:
        'Create custom lists, tag prospects, and segment your pipeline however your workflow demands.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      ),
      title: 'Export Anywhere',
      description:
        'Export your prospects to CSV with one click. Import into your CRM, email tool, or spreadsheet.',
      color: 'text-success',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16" ref={ref}>
          <h2
            className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-dark-text mb-4 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            Everything you need to{' '}
            <span className="text-linkedin-500">scale prospecting</span>
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-dark-text-secondary transition-all duration-700 delay-100 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            Built for recruiters, sales teams, and growth professionals who want
            to work smarter, not harder.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <Card hover className="text-center h-full dark:bg-dark-card dark:border-dark-border">
                {/* Icon Container */}
                <div
                  className={`inline-flex items-center justify-center h-16 w-16 ${feature.bgColor} rounded-xl mb-6`}
                >
                  <div className={feature.color}>{feature.icon}</div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-base text-gray-600 dark:text-dark-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
