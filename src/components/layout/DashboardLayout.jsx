import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * DashboardLayout component
 * Main layout wrapper for authenticated pages
 * Includes Navbar and renders child routes via Outlet
 */
const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
