import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';

interface Photo {
  id: string;
  description: string;
  urls: { regular: string; small: string; }; // Add 'small' to the urls object
  alt_description: string;
  user: { name: string; };
  links: { html: string };
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos(page);
  }, [page]);

  const fetchPhotos = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.unsplash.com/photos', {
        params: {
          page: page,
          per_page: 12, // Number of photos to fetch per page
        },
        headers: {
          Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
        },
      });

      const newPhotos: Photo[] = response.data;
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);

      if (newPhotos.length === 0 || newPhotos.length < 12) {
        setHasMore(false);
      }
      setLoading(false);
    } catch (error) {
      setError('Error fetching photos');
      setLoading(false);
    }
  };

  const fetchMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading && photos.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // Breakpoints for the masonry layout (adjust the number of columns for different screen sizes)
  const masonryBreakpoints = {
    default: 3, // Default to 3 columns
    1100: 3, // 3 columns at screen width 1100px and above
    700: 2, // 2 columns at screen width 700px and above
    500: 1, // 1 column at screen width 500px and above
  };

  return (
    <section className="mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-8">Unsplash Photo Gallery</h1>
      <InfiniteScroll
        dataLength={photos.length} // Number of photos already loaded
        next={fetchMore} // Function to fetch more photos
        hasMore={hasMore} // Boolean to determine if more photos are available
        loader={<h4 className="text-center">Loading more photos...</h4>}
        endMessage={<p className="text-center">No more photos to load.</p>}
      >
        {/* Masonry Layout */}
        <Masonry
          breakpointCols={masonryBreakpoints}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
          style={{
            display: 'flex',
            marginLeft: '-30px',
          }}
        >
          {photos.map((photo) => (
            <Link key={photo.id} to={`/photo/${photo.id}`}>
              <div
                style={{
                  paddingLeft: '30px',
                  marginBottom: '30px',
                }}
              >
                <img src={photo.urls.small} alt={photo.alt_description} />
              </div>
            </Link>
          ))}
        </Masonry>
      </InfiniteScroll>
    </section>
  );
}
