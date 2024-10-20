import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';
interface Photo {
  id: string;
  description: string;
  urls: { regular: string };
  alt_description: string;
  user: { name: string };
  links: { html: string };
}
export default function PhotoDetails() {
  const { id } = useParams<{ id: string }>(); // Get the photo ID from the URL
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotoDetails = async () => {
      try {
        const response = await axios.get(`https://api.unsplash.com/photos/${id}`, {
          headers: {
            Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
          },
        });
        setPhoto(response.data);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching photo details:', err);
          setError(err.message);
        }
        setLoading(false);
      }
    };
  
    fetchPhotoDetails();
  }, [id]);
  

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Error fetching photo details" />;
  if (!photo) return <ErrorMessage message="Photo not found" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{photo.description || 'Untitled Photo'}</h1>
      <div className="flex justify-center">
        <img
          className="w-full max-w-4xl object-cover rounded-md shadow-lg"
          src={photo.urls.regular}
          alt={photo.alt_description || 'Unsplash Photo'}
        />
      </div>
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-semibold">Author: {photo.user.name}</h2>
        <p className="mt-4 text-gray-600">{photo.description|| 'No description available for this photo.'}</p>
      </div>
      <div className="mt-6 text-center">
        <a
          href={photo.links.html}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View on Unsplash
        </a>
      </div>
    </div>
  );
}
