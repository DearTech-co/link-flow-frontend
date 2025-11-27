import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * DashboardLayout component
 * Main layout wrapper for authenticated pages
 * Includes Navbar and renders child routes via Outlet
 * WCAG 2.1 AA compliant with skip navigation
 */
const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip Navigation Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar />

      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        role="main"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
