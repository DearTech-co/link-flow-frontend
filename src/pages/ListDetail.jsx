import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getListById,
  updateList,
  deleteList,
  addProspectsToList,
  removeProspectsFromList,
} from '../api/lists.api';
import { getAllProspects } from '../api/prospects.api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import ListForm from '../components/lists/ListForm';
import Input from '../components/common/Input';

/**
 * ListDetail page
 * Shows detailed information about a list and manages prospects
 */
const ListDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addProspectModalOpen, setAddProspectModalOpen] = useState(false);
  const [availableProspects, setAvailableProspects] = useState([]);
  const [selectedProspects, setSelectedProspects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Fetch list data
   */
  const fetchList = async () => {
    try {
      setIsLoading(true);
      const response = await getListById(id);
      setList(response.data.list);
    } catch (err) {
      console.error('Error fetching list:', err);
      setError('Failed to load list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [id]);

  /**
   * Fetch available prospects when add modal opens
   */
  const handleOpenAddModal = async () => {
    try {
      const response = await getAllProspects();
      const allProspects = response.data.prospects || [];

      // Filter out prospects already in the list
      const currentProspectIds = list.prospects.map((p) => p._id);
      const available = allProspects.filter(
        (p) => !currentProspectIds.includes(p._id)
      );

      setAvailableProspects(available);
      setAddProspectModalOpen(true);
    } catch (err) {
      console.error('Error fetching prospects:', err);
      alert('Failed to load prospects');
    }
  };

  /**
   * Handle update list
   */
  const handleUpdate = async (data) => {
    try {
      setIsUpdating(true);
      await updateList(id, data);
      await fetchList();
      setIsEditMode(false);
    } catch (err) {
      console.error('Error updating list:', err);
      alert('Failed to update list');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle delete list
   */
  const handleDelete = async () => {
    try {
      await deleteList(id);
      navigate('/lists');
    } catch (err) {
      console.error('Error deleting list:', err);
      alert('Failed to delete list');
    }
  };

  /**
   * Handle add prospects to list
   */
  const handleAddProspects = async () => {
    if (selectedProspects.length === 0) return;

    try {
      await addProspectsToList(id, selectedProspects);
      await fetchList();
      setAddProspectModalOpen(false);
      setSelectedProspects([]);
      setSearchTerm('');
    } catch (err) {
      console.error('Error adding prospects:', err);
      alert('Failed to add prospects');
    }
  };

  /**
   * Handle remove prospect from list
   */
  const handleRemoveProspect = async (prospectId) => {
    try {
      await removeProspectsFromList(id, [prospectId]);
      await fetchList();
    } catch (err) {
      console.error('Error removing prospect:', err);
      alert('Failed to remove prospect');
    }
  };

  /**
   * Toggle prospect selection
   */
  const toggleProspectSelection = (prospectId) => {
    setSelectedProspects((prev) =>
      prev.includes(prospectId)
        ? prev.filter((id) => id !== prospectId)
        : [...prev, prospectId]
    );
  };

  // Filter available prospects by search term
  const filteredAvailableProspects = availableProspects.filter(
    (p) =>
      p.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading text="Loading list..." />
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-error">{error || 'List not found'}</p>
        </div>
        <Link to="/lists">
          <Button variant="secondary">Back to Lists</Button>
        </Link>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Edit List</h1>
          <Button variant="secondary" onClick={() => setIsEditMode(false)}>
            Cancel
          </Button>
        </div>
        <Card>
          <ListForm
            initialData={list}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{list.name}</h1>
          {list.description && (
            <p className="mt-2 text-gray-600">{list.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {list.prospects.length} {list.prospects.length === 1 ? 'prospect' : 'prospects'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="primary" onClick={() => setIsEditMode(true)}>
          Edit List
        </Button>
        <Button variant="outline" onClick={handleOpenAddModal}>
          Add Prospects
        </Button>
        <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
          Delete List
        </Button>
      </div>

      {/* Prospects */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Prospects</h2>

        {list.prospects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              No prospects in this list yet
            </p>
            <Button variant="primary" onClick={handleOpenAddModal}>
              Add Your First Prospect
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {list.prospects.map((prospect) => (
              <div
                key={prospect._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <Link
                    to={`/prospects/${prospect._id}`}
                    className="text-sm font-medium text-gray-900 hover:text-linkedin-500"
                  >
                    {prospect.firstName} {prospect.lastName}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {prospect.jobTitle} {prospect.companyName && `at ${prospect.companyName}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`badge badge-${prospect.enrichmentStatus}`}
                  >
                    {prospect.enrichmentStatus}
                  </span>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleRemoveProspect(prospect._id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

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
          Are you sure you want to delete <strong>{list.name}</strong>?
          The prospects will not be deleted, only the list itself.
        </p>
      </Modal>

      {/* Add Prospects Modal */}
      <Modal
        isOpen={addProspectModalOpen}
        onClose={() => {
          setAddProspectModalOpen(false);
          setSelectedProspects([]);
          setSearchTerm('');
        }}
        title="Add Prospects to List"
        size="large"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setAddProspectModalOpen(false);
                setSelectedProspects([]);
                setSearchTerm('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddProspects}
              disabled={selectedProspects.length === 0}
            >
              Add {selectedProspects.length > 0 && `(${selectedProspects.length})`}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            placeholder="Search prospects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {filteredAvailableProspects.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              {searchTerm ? 'No prospects match your search' : 'No available prospects'}
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredAvailableProspects.map((prospect) => (
                <label
                  key={prospect._id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedProspects.includes(prospect._id)}
                    onChange={() => toggleProspectSelection(prospect._id)}
                    className="mr-3 h-4 w-4 text-linkedin-500 focus:ring-linkedin-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {prospect.firstName} {prospect.lastName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {prospect.jobTitle} {prospect.companyName && `at ${prospect.companyName}`}
                    </p>
                  </div>
                  <span
                    className={`badge badge-${prospect.enrichmentStatus}`}
                  >
                    {prospect.enrichmentStatus}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ListDetail;
