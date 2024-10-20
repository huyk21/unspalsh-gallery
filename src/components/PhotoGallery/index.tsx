
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useFetchPhotos } from '../hooks/useFetchPhotos';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';

export default function PhotoGallery() {
  const { data: photos, hasMore, fetchMore, loading, error } = useFetchPhotos('https://api.unsplash.com/photos', {
    client_id: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
  });

  if (loading && photos.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Error fetching photos" />;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Unsplash Gallery</h1>
      <InfiniteScroll
        dataLength={photos.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4 className="text-center">Loading more photos...</h4>}
        endMessage={<p className="text-center">No more photos to load.</p>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <Link key={photo.id} to={`/photo/${photo.id}`}>
              <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  className="w-full h-48 object-cover"
                  src={photo.urls.small}
                  alt={photo.alt_description || 'Unsplash Photo'}
                />
                <div className="p-4">
                  <h2 className="text-lg font-medium text-black">Author: {photo.user.name}</h2>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <p className="p-4">{photo.description || 'No description available for this photo.'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
