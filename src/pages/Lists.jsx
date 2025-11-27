import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllLists, deleteList } from '../api/lists.api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import ListCard from '../components/lists/ListCard';
import { useDebounce } from '../hooks/useDebounce';

/**
 * Lists page
 * Displays all prospect lists with search functionality
 */
const Lists = () => {
  const [lists, setLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  // Debounced search term (updates after 300ms of no typing)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  /**
   * Fetch all lists
   */
  const fetchLists = async () => {
    try {
      setIsLoading(true);
      const response = await getAllLists();
      setLists(response.data.lists || []);
      setFilteredLists(response.data.lists || []);
    } catch (err) {
      console.error('Error fetching lists:', err);
      setError('Failed to load lists');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  /**
   * Filter lists based on search
   * Uses debounced search term to avoid excessive filtering
   */
  useEffect(() => {
    if (debouncedSearchTerm) {
      const filtered = lists.filter(
        (list) =>
          list.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          list.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredLists(filtered);
    } else {
      setFilteredLists(lists);
    }
  }, [debouncedSearchTerm, lists]);

  /**
   * Handle delete list
   */
  const handleDelete = async () => {
    if (!listToDelete) return;

    try {
      await deleteList(listToDelete._id);
      setLists((prev) => prev.filter((l) => l._id !== listToDelete._id));
      toast.success(`${listToDelete.name} deleted successfully.`);
      setDeleteModalOpen(false);
      setListToDelete(null);
    } catch (err) {
      console.error('Error deleting list:', err);
      toast.error('Failed to delete list. Please try again.');
    }
  };

  /**
   * Open delete confirmation modal
   */
  const confirmDelete = (list) => {
    setListToDelete(list);
    setDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading text="Loading lists..." />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lists</h1>
          <p className="mt-2 text-gray-600">
            Organize your prospects into lists for better management
          </p>
        </div>
        <Link to="/lists/new">
          <Button variant="primary">Create List</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-card">
        <Input
          placeholder="Search lists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredLists.length} of {lists.length} lists
      </div>

      {/* Lists Grid */}
      {filteredLists.length === 0 ? (
        <EmptyState
          icon={searchTerm ? 'search' : 'lists'}
          title={searchTerm ? 'No Results Found' : 'No Lists Yet'}
          message={
            searchTerm
              ? 'No lists match your search. Try a different search term.'
              : 'Organize your prospects by creating your first list. Lists help you group and manage prospects efficiently.'
          }
          action={
            !searchTerm ? (
              <Link to="/lists/new">
                <Button variant="primary">Create Your First List</Button>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.map((list) => (
            <ListCard
              key={list._id}
              list={list}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete List"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete <strong>{listToDelete?.name}</strong>? The prospects in this list will not be deleted, only the list itself.
        </p>
      </Modal>
    </div>
  );
};

export default Lists;
