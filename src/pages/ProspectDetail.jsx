import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getProspectById,
  updateProspect,
  deleteProspect,
  enrichProspect,
} from '../api/prospects.api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import ProspectForm from '../components/prospects/ProspectForm';

/**
 * ProspectDetail page
 * Shows detailed information about a single prospect
 */
const ProspectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prospect, setProspect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  /**
   * Fetch prospect data
   */
  const fetchProspect = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getProspectById(id);
      setProspect(response.data.prospect);
    } catch (err) {
      console.error('Error fetching prospect:', err);
      setError('Failed to load prospect');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProspect();
  }, [fetchProspect]);

  /**
   * Handle update prospect
   */
  const handleUpdate = async (data) => {
    try {
      setIsUpdating(true);
      await updateProspect(id, data);
      await fetchProspect(); // Refresh data
      setIsEditMode(false);
    } catch (err) {
      console.error('Error updating prospect:', err);
      alert('Failed to update prospect');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle enrich prospect
   */
  const handleEnrich = async () => {
    try {
      await enrichProspect(id);
      await fetchProspect(); // Refresh to show updated status
    } catch (err) {
      console.error('Error enriching prospect:', err);
      alert('Failed to trigger enrichment');
    }
  };

  /**
   * Handle delete prospect
   */
  const handleDelete = async () => {
    try {
      await deleteProspect(id);
      navigate('/prospects');
    } catch (err) {
      console.error('Error deleting prospect:', err);
      alert('Failed to delete prospect');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'enriched':
        return 'badge-enriched';
      case 'processing':
        return 'badge-processing';
      case 'failed':
        return 'badge-failed';
      default:
        return 'badge-pending';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading text="Loading prospect..." />
      </div>
    );
  }

  if (error || !prospect) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-error">{error || 'Prospect not found'}</p>
        </div>
        <Link to="/prospects">
          <Button variant="secondary">Back to Prospects</Button>
        </Link>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Edit Prospect</h1>
          <Button
            variant="secondary"
            onClick={() => setIsEditMode(false)}
          >
            Cancel
          </Button>
        </div>
        <Card>
          <ProspectForm
            initialData={prospect}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {prospect.firstName} {prospect.lastName}
          </h1>
          {prospect.jobTitle && (
            <p className="mt-1 text-lg text-gray-600">{prospect.jobTitle}</p>
          )}
          {prospect.companyName && (
            <p className="text-gray-500">{prospect.companyName}</p>
          )}
        </div>
        <span className={`badge ${getStatusColor(prospect.enrichmentStatus)}`}>
          {prospect.enrichmentStatus}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="primary" onClick={() => setIsEditMode(true)}>
          Edit
        </Button>
        {prospect.enrichmentStatus === 'pending' && (
          <Button variant="outline" onClick={handleEnrich}>
            Trigger Enrichment
          </Button>
        )}
        <a
          href={prospect.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary">View LinkedIn</Button>
        </a>
        <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
          Delete
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Basic Information
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">First Name</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {prospect.firstName || '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Last Name</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {prospect.lastName || '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Job Title</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {prospect.jobTitle || '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Company</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {prospect.companyName || '-'}
            </dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-sm font-medium text-gray-500">LinkedIn URL</dt>
            <dd className="mt-1 text-sm text-linkedin-500">
              <a
                href={prospect.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-linkedin-600"
              >
                {prospect.linkedinUrl}
              </a>
            </dd>
          </div>
        </dl>
      </Card>

      {/* Bio */}
      {prospect.bio && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{prospect.bio}</p>
        </Card>
      )}

      {/* Enrichment Status */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Enrichment Status
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <span className={`badge ${getStatusColor(prospect.enrichmentStatus)}`}>
                {prospect.enrichmentStatus}
              </span>
            </dd>
          </div>
          {prospect.enrichmentInitiatedAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Initiated At
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(prospect.enrichmentInitiatedAt).toLocaleString()}
              </dd>
            </div>
          )}
          {prospect.enrichmentCompletedAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Completed At
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(prospect.enrichmentCompletedAt).toLocaleString()}
              </dd>
            </div>
          )}
        </dl>
      </Card>

      {/* Clay Data */}
      {prospect.clayData && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Clay Enrichment Data
          </h2>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(prospect.clayData, null, 2)}
          </pre>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Metadata</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(prospect.createdAt).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Updated At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(prospect.updatedAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </Card>

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
            {prospect.firstName} {prospect.lastName}
          </strong>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ProspectDetail;
