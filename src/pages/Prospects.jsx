import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getAllProspects,
  deleteProspect,
  enrichProspect,
  exportProspectsToCSV,
} from '../api/prospects.api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import ProspectCard from '../components/prospects/ProspectCard';
import ProspectRow from '../components/prospects/ProspectRow';
import { useDebounce } from '../hooks/useDebounce';

/**
 * Prospects page
 * Lists all prospects with search, filter, and view options
 */
const Prospects = () => {
  const [prospects, setProspects] = useState([]);
  const [filteredProspects, setFilteredProspects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [prospectToDelete, setProspectToDelete] = useState(null);
  const [selectedProspects, setSelectedProspects] = useState([]);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

  // Debounced search term (updates after 300ms of no typing)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  /**
   * Fetch all prospects
   */
  const fetchProspects = async () => {
    try {
      setIsLoading(true);
      const response = await getAllProspects();
      setProspects(response.data.prospects || []);
      setFilteredProspects(response.data.prospects || []);
    } catch (err) {
      console.error('Error fetching prospects:', err);
      setError('Failed to load prospects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, []);

  /**
   * Filter prospects based on search and status
   * Uses debounced search term to avoid excessive filtering
   */
  useEffect(() => {
    let filtered = [...prospects];

    // Apply search filter (debounced)
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.firstName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          p.lastName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          p.companyName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          p.jobTitle?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.enrichmentStatus === statusFilter);
    }

    setFilteredProspects(filtered);
  }, [debouncedSearchTerm, statusFilter, prospects]);

  /**
   * Handle enrich prospect
   */
  const handleEnrich = async (prospectId) => {
    try {
      await enrichProspect(prospectId);
      toast.success('Enrichment started! Check back in a few moments.');
      // Refresh prospects to show updated status
      fetchProspects();
    } catch (err) {
      console.error('Error enriching prospect:', err);
      toast.error('Failed to trigger enrichment. Please try again.');
    }
  };

  /**
   * Handle delete prospect
   */
  const handleDelete = async () => {
    if (!prospectToDelete) return;

    try {
      await deleteProspect(prospectToDelete._id);
      setProspects((prev) => prev.filter((p) => p._id !== prospectToDelete._id));
      toast.success(`${prospectToDelete.firstName} ${prospectToDelete.lastName} deleted successfully.`);
      setDeleteModalOpen(false);
      setProspectToDelete(null);
    } catch (err) {
      console.error('Error deleting prospect:', err);
      toast.error('Failed to delete prospect. Please try again.');
    }
  };

  /**
   * Open delete confirmation modal
   */
  const confirmDelete = (prospect) => {
    setProspectToDelete(prospect);
    setDeleteModalOpen(true);
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

  /**
   * Toggle select all prospects
   */
  const toggleSelectAll = () => {
    if (selectedProspects.length === filteredProspects.length) {
      setSelectedProspects([]);
    } else {
      setSelectedProspects(filteredProspects.map((p) => p._id));
    }
  };

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = async () => {
    if (selectedProspects.length === 0) return;

    try {
      // Delete all selected prospects
      await Promise.all(
        selectedProspects.map((id) => deleteProspect(id))
      );

      // Update state
      setProspects((prev) => prev.filter((p) => !selectedProspects.includes(p._id)));
      toast.success(`${selectedProspects.length} ${selectedProspects.length === 1 ? 'prospect' : 'prospects'} deleted successfully.`);
      setBulkDeleteModalOpen(false);
      setSelectedProspects([]);
    } catch (err) {
      console.error('Error deleting prospects:', err);
      toast.error('Failed to delete prospects. Please try again.');
    }
  };

  /**
   * Handle CSV export
   */
  const handleExport = async () => {
    try {
      const response = await exportProspectsToCSV();

      // Create a blob from the response
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prospects_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Prospects exported successfully!');
    } catch (err) {
      console.error('Error exporting prospects:', err);
      toast.error('Failed to export prospects. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading text="Loading prospects..." />
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
          <h1 className="text-3xl font-bold text-gray-900">Prospects</h1>
          <p className="mt-2 text-gray-600">
            Manage your LinkedIn prospects and enrichment
          </p>
        </div>
        <div className="flex gap-3">
          {selectedProspects.length > 0 && (
            <Button
              variant="danger"
              onClick={() => setBulkDeleteModalOpen(true)}
            >
              Delete Selected ({selectedProspects.length})
            </Button>
          )}
          <Button variant="secondary" onClick={handleExport}>
            Export CSV
          </Button>
          <Link to="/prospects/new">
            <Button variant="primary">Add Prospect</Button>
          </Link>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white p-4 rounded-lg shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search prospects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="enriched">Enriched</option>
            <option value="failed">Failed</option>
          </select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'card' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('card')}
              fullWidth
            >
              Card View
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('table')}
              fullWidth
            >
              Table View
            </Button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredProspects.length} of {prospects.length} prospects
      </div>

      {/* Prospects List */}
      {filteredProspects.length === 0 ? (
        <EmptyState
          icon={searchTerm || statusFilter !== 'all' ? 'search' : 'prospects'}
          title={searchTerm || statusFilter !== 'all' ? 'No Results Found' : 'No Prospects Yet'}
          message={
            searchTerm || statusFilter !== 'all'
              ? 'No prospects match your current filters. Try adjusting your search or filter criteria.'
              : 'Start building your prospect list by adding your first LinkedIn prospect.'
          }
          action={
            !searchTerm && statusFilter === 'all' ? (
              <Link to="/prospects/new">
                <Button variant="primary">Add Your First Prospect</Button>
              </Link>
            ) : null
          }
        />
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProspects.map((prospect) => (
            <ProspectCard
              key={prospect._id}
              prospect={prospect}
              onEnrich={handleEnrich}
              onDelete={confirmDelete}
              isSelected={selectedProspects.includes(prospect._id)}
              onToggleSelect={toggleProspectSelection}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProspects.length === filteredProspects.length && filteredProspects.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-linkedin-500 focus:ring-linkedin-500 border-gray-300 rounded"
                    aria-label="Select all prospects"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LinkedIn
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProspects.map((prospect) => (
                <ProspectRow
                  key={prospect._id}
                  prospect={prospect}
                  onEnrich={handleEnrich}
                  onDelete={confirmDelete}
                  isSelected={selectedProspects.includes(prospect._id)}
                  onToggleSelect={toggleProspectSelection}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Prospect"
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
          Are you sure you want to delete{' '}
          <strong>
            {prospectToDelete?.firstName} {prospectToDelete?.lastName}
          </strong>
          ? This action cannot be undone.
        </p>
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        title="Delete Multiple Prospects"
        footer={
          <>
            <Button variant="secondary" onClick={() => setBulkDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleBulkDelete}>
              Delete {selectedProspects.length} {selectedProspects.length === 1 ? 'Prospect' : 'Prospects'}
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete{' '}
          <strong>{selectedProspects.length} {selectedProspects.length === 1 ? 'prospect' : 'prospects'}</strong>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default Prospects;
