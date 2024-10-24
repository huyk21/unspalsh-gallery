import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Interface for Photo object
 */
interface Photo {
  id: string;
  description: string;
  urls: { regular: string; small: string; }; // Add 'small' to the urls object
  alt_description: string;
  user: { name: string; };
  links: { html: string };
}

/**
 * Custom hook for fetching photos from Unsplash API
 * @param {string} endpoint - The API endpoint
 * @param {object} params - Query parameters
 */
export const useFetchPhotos = (endpoint: string, params: any = {}) => {
  const [data, setData] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get(endpoint, {
        params: { ...params, page: pageNumber, per_page: 12 },
      });
      const fetchedPhotos: Photo[] = response.data;
      if (fetchedPhotos.length === 0) {
        setHasMore(false);
      } else {
        // Check and append unique photos only
        setData((prevData) => {
          const newPhotos = fetchedPhotos.filter(
            (photo) => !prevData.some((existingPhoto) => existingPhoto.id === photo.id)
          );
          return [...prevData, ...newPhotos];
        });
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchMore = () => setPage((prevPage) => prevPage + 1);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return { data, loading, error, hasMore, fetchMore };
};
