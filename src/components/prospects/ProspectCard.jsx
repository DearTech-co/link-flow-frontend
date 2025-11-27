import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * ProspectCard component
 * Displays prospect information in a card view
 */
const ProspectCard = ({ prospect, onEnrich, onDelete, isSelected, onToggleSelect }) => {
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

  return (
    <Card hover>
      <div className="space-y-3">
        {/* Checkbox for bulk selection */}
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(prospect._id)}
            className="h-4 w-4 text-linkedin-500 focus:ring-linkedin-500 border-gray-300 rounded"
            aria-label={`Select ${prospect.firstName} ${prospect.lastName}`}
          />
        </div>

        {/* Header with name and status */}
        <div className="flex items-start justify-between">
          <div>
            <Link
              to={`/prospects/${prospect._id}`}
              className="text-lg font-semibold text-gray-900 hover:text-linkedin-500"
            >
              {prospect.firstName} {prospect.lastName}
            </Link>
            {prospect.jobTitle && (
              <p className="text-sm text-gray-600">{prospect.jobTitle}</p>
            )}
          </div>
          <span className={`badge ${getStatusColor(prospect.enrichmentStatus)}`}>
            {prospect.enrichmentStatus}
          </span>
        </div>

        {/* Company */}
        {prospect.companyName && (
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            {prospect.companyName}
          </div>
        )}

        {/* LinkedIn URL */}
        <a
          href={prospect.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-linkedin-500 hover:text-linkedin-600"
        >
          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          View LinkedIn Profile
        </a>

        {/* Bio preview */}
        {prospect.bio && (
          <p className="text-sm text-gray-600 line-clamp-2">{prospect.bio}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link to={`/prospects/${prospect._id}`} className="flex-1">
            <Button variant="outline" size="small" fullWidth>
              View Details
            </Button>
          </Link>
          {prospect.enrichmentStatus === 'pending' && (
            <Button
              variant="primary"
              size="small"
              onClick={() => onEnrich(prospect._id)}
            >
              Enrich
            </Button>
          )}
          <Button
            variant="danger"
            size="small"
            onClick={() => onDelete(prospect)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProspectCard;
