import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

/**
 * Navbar component
 * Main navigation bar with user menu
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-linkedin-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                LinkFlow
              </span>
            </Link>
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-linkedin-50 text-linkedin-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/prospects"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/prospects')
                  ? 'bg-linkedin-50 text-linkedin-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Prospects
            </Link>
            <Link
              to="/lists"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/lists')
                  ? 'bg-linkedin-50 text-linkedin-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Lists
            </Link>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-gray-500 text-xs">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                size="small"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/dashboard')
                ? 'bg-linkedin-50 text-linkedin-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/prospects"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/prospects')
                ? 'bg-linkedin-50 text-linkedin-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Prospects
          </Link>
          <Link
            to="/lists"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/lists')
                ? 'bg-linkedin-50 text-linkedin-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Lists
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
