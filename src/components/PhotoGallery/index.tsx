import { useNavigate, useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { useInfiniteQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '../LoadingSpinner';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Fetch function for photos with axios
const fetchPhotos = async ({ pageParam = 1 }) => {
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for token in cookies and set login status on component mount
  useEffect(() => {
    const token = Cookies.get('token'); // Retrieve token from cookies
    setIsLoggedIn(!!token); // Set isLoggedIn based on token presence
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/login');
  };

  const handleRegister = () => navigate('/register');

  const handleLogout = () => {
    Cookies.remove('token'); // Clear token from cookies
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home or another route after logout
  };

  const goToProfile = () => navigate('/profile');

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
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length < 12 ? undefined : pages.length + 1;
    },
  });

  // Flatten the pages of data into a single array of photos
  const photos = data?.pages.flat() || [];

  const openModal = (id: String) => {
    navigate(`/photos/${id}`, { state: { backgroundLocation: location } });
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
      
      <div className="flex justify-center space-x-4 mb-6">
        {isLoggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
            <button
              onClick={goToProfile}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Profile
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Register
            </button>
          </>
        )}
      </div>

      {error && <p className="text-center text-red-500">Error fetching photos.</p>}

      {isLoading && photos.length === 0 ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <InfiniteScroll
          dataLength={photos.length}
          next={fetchNextPage}
          hasMore={hasNextPage || false}
          loader={
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          }
          endMessage={<p className="text-center">No more photos to load.</p>}
        >
          <Masonry
            breakpointCols={masonryBreakpoints}
            className="flex gap-6"
            columnClassName="my-masonry-grid_column"
          >
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group cursor-zoom-in overflow-hidden mb-6"
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
