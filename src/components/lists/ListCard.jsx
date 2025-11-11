import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * ListCard component
 * Displays list information in a card view
 */
const ListCard = ({ list, onDelete }) => {
  const prospectCount = list.prospects?.length || 0;

  return (
    <Card hover>
      <div className="space-y-3">
        {/* Header with name and prospect count */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link
              to={`/lists/${list._id}`}
              className="text-lg font-semibold text-gray-900 hover:text-linkedin-500"
            >
              {list.name}
            </Link>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <svg
                className="h-4 w-4 mr-1"
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
              {prospectCount} {prospectCount === 1 ? 'prospect' : 'prospects'}
            </div>
          </div>
        </div>

        {/* Description */}
        {list.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {list.description}
          </p>
        )}

        {/* Metadata */}
        <div className="text-xs text-gray-500">
          Created {new Date(list.createdAt).toLocaleDateString()}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link to={`/lists/${list._id}`} className="flex-1">
            <Button variant="primary" size="small" fullWidth>
              View List
            </Button>
          </Link>
          <Button
            variant="danger"
            size="small"
            onClick={() => onDelete(list._id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ListCard;
