import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createList } from '../api/lists.api';
import Card from '../components/common/Card';
import ListForm from '../components/lists/ListForm';

/**
 * NewList page
 * Form for creating a new list
 */
const NewList = () => {
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

      const response = await createList(data);

      // Redirect to the newly created list
      navigate(`/lists/${response.data.list._id}`);
    } catch (err) {
      console.error('Error creating list:', err);
      setError(err.message || 'Failed to create list');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New List</h1>
        <p className="mt-2 text-gray-600">
          Create a list to organize and group your prospects
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <Card>
        <ListForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </div>
  );
};

export default NewList;
