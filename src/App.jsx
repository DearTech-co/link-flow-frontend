import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Loading from './components/common/Loading';

// Landing page (public)
const LandingPage = lazy(() => import('./pages/LandingPage'));

// Auth pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Dashboard pages
import Dashboard from './pages/Dashboard';

// Prospect pages
import Prospects from './pages/Prospects';
import NewProspect from './pages/NewProspect';
import ProspectDetail from './pages/ProspectDetail';

// List pages
import Lists from './pages/Lists';
import NewList from './pages/NewList';
import ListDetail from './pages/ListDetail';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff',
                  color: '#363636',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              {/* Public landing page */}
              <Route
                path="/"
                element={
                  <Suspense fallback={<Loading />}>
                    <LandingPage />
                  </Suspense>
                }
              />

              {/* Public auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Protected routes with dashboard layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Prospects routes */}
                <Route path="/prospects" element={<Prospects />} />
                <Route path="/prospects/new" element={<NewProspect />} />
                <Route path="/prospects/:id" element={<ProspectDetail />} />

                {/* Lists routes */}
                <Route path="/lists" element={<Lists />} />
                <Route path="/lists/new" element={<NewList />} />
                <Route path="/lists/:id" element={<ListDetail />} />
              </Route>

              {/* Catch all - redirect to landing page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
