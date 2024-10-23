import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, MouseEvent } from 'react';
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
  const navigate = useNavigate(); // To close the modal

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

  const closeModal = () => navigate(-1); // Close the modal and return to previous route
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // Close the modal only if the user clicks outside the content area
      closeModal();
    }
  };
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Error fetching photo details" />;
  if (!photo) return <ErrorMessage message="Photo not found" />;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
          onClick={closeModal}
        >
          ✕
        </button>
        <h1 className="text-2xl font-bold mb-6 text-center">
          {photo.alt_description || 'Untitled Photo'}
        </h1>
        <div className="flex justify-center">
          <img
            className="max-h-[75vh] max-w-full object-contain rounded-md shadow-lg"
            src={photo.urls.regular}
            alt={photo.alt_description || 'Unsplash Photo'}
          />
        </div>
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold">Author: {photo.user.name}</h2>
          <a
            href={photo.links.html}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mt-4 block"
          >
            View on Unsplash
          </a>
        </div>
      </div>
    </div>
  );
}
