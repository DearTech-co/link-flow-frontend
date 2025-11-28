import { Link } from 'react-router-dom';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import Button from '../common/Button';
import Card from '../common/Card';

/**
 * Final CTA Section
 * Conversion-focused bottom section with call to action
 */
function FinalCTA() {
  const { trackEvent } = useAnalytics();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  const handleCTAClick = (buttonName) => {
    trackEvent('cta_click', { button_name: buttonName, section: 'final_cta' });
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-dark-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <Card className="text-center bg-gradient-to-br from-linkedin-500 to-linkedin-600 text-white border-none">
            <div className="py-12 px-6 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to streamline your prospecting?
              </h2>

              <p className="text-lg md:text-xl text-linkedin-50 max-w-2xl mx-auto">
                Join hundreds of professionals who've automated their LinkedIn
                workflow with LinkFlow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="large"
                    className="bg-white text-linkedin-500 hover:bg-gray-50 hover:text-linkedin-600 shadow-lg"
                    onClick={() => handleCTAClick('Get Started Free - Final CTA')}
                  >
                    Get Started Free
                  </Button>
                </Link>

                <Link to="/login">
                  <Button
                    variant="outline"
                    size="large"
                    className="border-2 border-white text-white hover:bg-white/10"
                    onClick={() => handleCTAClick('Sign In - Final CTA')}
                  >
                    Sign In
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-linkedin-100 pt-2">
                No credit card required • Free to start • Cancel anytime
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;
