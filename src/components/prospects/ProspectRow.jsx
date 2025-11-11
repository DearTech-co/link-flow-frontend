import { Link } from 'react-router-dom';
import Button from '../common/Button';

/**
 * ProspectRow component
 * Displays prospect information in a table row view
 */
const ProspectRow = ({ prospect, onEnrich, onDelete }) => {
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
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          to={`/prospects/${prospect._id}`}
          className="text-sm font-medium text-gray-900 hover:text-linkedin-500"
        >
          {prospect.firstName} {prospect.lastName}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{prospect.jobTitle || '-'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{prospect.companyName || '-'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`badge ${getStatusColor(prospect.enrichmentStatus)}`}>
          {prospect.enrichmentStatus}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <a
          href={prospect.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-linkedin-500 hover:text-linkedin-600"
        >
          View Profile
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex gap-2 justify-end">
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
            onClick={() => onDelete(prospect._id)}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ProspectRow;
