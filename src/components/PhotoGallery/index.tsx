import { useNavigate, useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { useInfiniteQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '../LoadingSpinner'; // Import spinner component


// Fetch function for photos with axios
const fetchPhotos = async ({ pageParam = 1 }: { pageParam: number }) => {
  const response = await axios.get('https://api.unsplash.com/photos', {
    params: { page: pageParam, per_page: 12 },
    headers: {
      Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
    },
  });

  return response.data;
};

export default function PhotoGallery() {
  const navigate = useNavigate();
  const location = useLocation();

  // React Query's useInfiniteQuery with correct configuration
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['photos'],
    queryFn: fetchPhotos,
    initialPageParam: 1, // Add initialPageParam to indicate the starting page
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length < 12 ? undefined : pages.length + 1;
    },
  });

  // Flatten the pages of data into a single array of photos
  const photos = data?.pages.flat() || [];

  const openModal = (id: string) => {
    navigate(`/photo/${id}`, { state: { backgroundLocation: location } });
  };

  const masonryBreakpoints = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <section className="mx-auto max-w-7xl p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Unsplash Photo Gallery</h1>

      {error && <p className="text-center text-red-500">Error fetching photos.</p>}

      {isLoading && photos.length === 0 ? (
        // Spinner during the initial load
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <InfiniteScroll
          dataLength={photos.length}
          next={fetchNextPage} // Fetch next page on scroll
          hasMore={hasNextPage || false} // Check if more pages are available
          loader={
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          }
          endMessage={<p className="text-center">No more photos to load.</p>}
        >
          <Masonry
            breakpointCols={masonryBreakpoints}
            className="flex gap-6" // Adds space between columns
            columnClassName="my-masonry-grid_column"
          >
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group cursor-pointer overflow-hidden mb-6"
                onClick={() => openModal(photo.id)}
              >
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description}
                  className="w-full block transition-transform duration-300 group-hover:scale-105 rounded-md shadow-md"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-lg font-semibold">
                  Author: {photo.user.name || 'Untitled Photo'}
                </div>
              </div>
            ))}
          </Masonry>
        </InfiniteScroll>
      )}

      {isFetching && !isLoading && (
        <div className="flex justify-center mt-4">
          <LoadingSpinner />
        </div>
      )}
    </section>
  );
}
