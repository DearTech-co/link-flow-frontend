import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProspects } from '../api/prospects.api';
import { getAllLists } from '../api/lists.api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

/**
 * Dashboard page
 * Shows statistics and recent activity
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProspects: 0,
    enriched: 0,
    pending: 0,
    processing: 0,
    totalLists: 0,
  });
  const [recentProspects, setRecentProspects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetch dashboard data
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [prospectsResponse, listsResponse] = await Promise.all([
          getAllProspects(),
          getAllLists(),
        ]);

        const prospects = prospectsResponse.data.prospects || [];
        const lists = listsResponse.data.lists || [];

        // Calculate statistics
        const enriched = prospects.filter(
          (p) => p.enrichmentStatus === 'enriched'
        ).length;
        const pending = prospects.filter(
          (p) => p.enrichmentStatus === 'pending'
        ).length;
        const processing = prospects.filter(
          (p) => p.enrichmentStatus === 'processing'
        ).length;

        setStats({
          totalProspects: prospects.length,
          enriched,
          pending,
          processing,
          totalLists: lists.length,
        });

        // Get 5 most recent prospects
        const sorted = [...prospects].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentProspects(sorted.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your prospects today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-linkedin-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Prospects
                </dt>
                <dd className="text-3xl font-semibold text-gray-900">
                  {stats.totalProspects}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Enriched
                </dt>
                <dd className="text-3xl font-semibold text-gray-900">
                  {stats.enriched}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Processing
                </dt>
                <dd className="text-3xl font-semibold text-gray-900">
                  {stats.processing}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Lists
                </dt>
                <dd className="text-3xl font-semibold text-gray-900">
                  {stats.totalLists}
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/prospects/new">
            <Button variant="primary" fullWidth>
              Add New Prospect
            </Button>
          </Link>
          <Link to="/prospects">
            <Button variant="outline" fullWidth>
              View All Prospects
            </Button>
          </Link>
          <Link to="/lists/new">
            <Button variant="secondary" fullWidth>
              Create New List
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Prospects */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Prospects
          </h2>
          <Link
            to="/prospects"
            className="text-sm font-medium text-linkedin-500 hover:text-linkedin-600"
          >
            View all
          </Link>
        </div>

        {recentProspects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No prospects yet. Add your first prospect to get started!
          </p>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentProspects.map((prospect) => (
              <Link
                key={prospect._id}
                to={`/prospects/${prospect._id}`}
                className="block py-4 hover:bg-gray-50 transition-colors -mx-6 px-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {prospect.firstName} {prospect.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {prospect.jobTitle} {prospect.companyName && `at ${prospect.companyName}`}
                    </p>
                  </div>
                  <span
                    className={`badge badge-${prospect.enrichmentStatus}`}
                  >
                    {prospect.enrichmentStatus}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
