import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProspect } from '../api/prospects.api';
import Card from '../components/common/Card';
import ProspectForm from '../components/prospects/ProspectForm';

/**
 * NewProspect page
 * Form for adding a new prospect
 */
const NewProspect = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle form submission
   */
  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');

      await createProspect(data);

      // Redirect to prospects list
      navigate('/prospects');
    } catch (err) {
      console.error('Error creating prospect:', err);
      setError(err.message || 'Failed to create prospect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Prospect</h1>
        <p className="mt-2 text-gray-600">
          Enter the LinkedIn profile URL and any additional information you have
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <Card>
        <ProspectForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Pro Tip: Chrome Extension
        </h3>
        <p className="text-sm text-blue-700">
          Install our Chrome extension to automatically capture LinkedIn profiles
          with a single click while browsing!
        </p>
      </div>
    </div>
  );
};

export default NewProspect;
