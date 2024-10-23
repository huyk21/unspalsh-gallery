import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Component to display individual photo card
 * @param {object} photo - The photo object to display
 */
export const PhotoCard = ({ photo }: any) => (
  <Link to={`/photo/${photo.id}`}>
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 hover:bg-gray-100 mb-4 p-2"> {/* Added mb-4 for bottom margin and p-2 for padding */}
      <img
        className="w-full h-56 object-cover"
        src={photo.urls.small}
        alt={photo.alt_description || 'Unsplash Photo'}
      />
      <div className="p-4">
        <h2 className="text-lg font-medium text-gray-900">Author: {photo.user.name}</h2>
      </div>
    </div>
  </Link>
);

PhotoCard.propTypes = {
  photo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    urls: PropTypes.shape({
      small: PropTypes.string.isRequired,
    }).isRequired,
    alt_description: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
