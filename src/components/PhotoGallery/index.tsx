import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import Masonry from 'react-masonry-css';

interface Photo {
  id: string;
  description: string;
  urls: { regular: string; small: string };
  alt_description: string;
  user: { name: string };
  links: { html: string };
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchPhotos(page);
  }, [page]);

  const fetchPhotos = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.unsplash.com/photos', {
        params: { page, per_page: 12 },
        headers: {
          Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
        },
      });

      const newPhotos: Photo[] = response.data;
      setPhotos((prev) => [...prev, ...newPhotos]);

      if (newPhotos.length < 12) setHasMore(false);
      setLoading(false);
    } catch (error) {
      setError('Error fetching photos');
      setLoading(false);
    }
  };

  const fetchMore = () => setPage((prev) => prev + 1);

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

      {error && <p className="text-center text-red-500">{error}</p>}

      <InfiniteScroll
        dataLength={photos.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4 className="text-center">Loading more photos...</h4>}
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
              className="relative group cursor-pointer overflow-hidden mb-6" // Adds space between items
              onClick={() => openModal(photo.id)}
            >
              <img
                src={photo.urls.small}
                alt={photo.alt_description}
                className="w-full block transition-transform duration-300 group-hover:scale-105 rounded-md shadow-md" // Adds some styling to images
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-lg font-semibold">
                {photo.user.name}
              </div>
            </div>
          ))}
        </Masonry>
      </InfiniteScroll>
    </section>
  );
}
