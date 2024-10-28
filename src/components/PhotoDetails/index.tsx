import { useParams, useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';

// Fetch function for photo details
const fetchPhotoDetails = async (id: string) => {
  const isDevelopment = import.meta.env.MODE === 'production'; // Check environment

  const apiUrl = isDevelopment
    ? `https://api.unsplash.com/photos/${id}` // Direct Unsplash API in development
    : `/api/unsplash/${id}`; // Use serverless function in production

  const headers = isDevelopment
    ? {
        Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
      }
    : {};

  try {
    const response = await axios.get(apiUrl, { headers });
   
    return response.data;
  } catch (error:any) {
    console.error('Error fetching photo details:', error.message);
    throw new Error('Failed to fetch photo details');
  }
};

export default function PhotoDetails() {
  const { id } = useParams<{ id: string }>(); // Extract photo ID from the URL
  const navigate = useNavigate(); // For closing the modal

  const { data: photo, error, isLoading } = useQuery({
    queryKey: ['photo', id],
    queryFn: () => fetchPhotoDetails(id as string),
    enabled: !!id, // Only fetch if ID exists
  });

  const closeModal = () => navigate(-1); // Close modal and go back

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !photo) return <ErrorMessage message="Error fetching photo details" />;

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-3xl w-full relative overflow-y-auto">
        <button
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-900 p-1 rounded-full border border-gray-300"
          style={{ width: '32px', height: '32px', fontSize: '18px' }}
          onClick={closeModal}
        >
          ✕
        </button>
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center px-8">
          {photo.alt_description || 'Untitled Photo'}
        </h1>
        <div className="flex justify-center mb-4">
          <img
            className="max-h-[50vh] sm:max-h-[75vh] max-w-full object-contain rounded-md shadow-lg"
            src={photo.urls.regular}
            alt={photo.alt_description || 'Unsplash Photo'}
          />
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-lg sm:text-xl font-semibold">
            Author: {photo.user.name}
          </h2>
          <a
            href={photo.links.html}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mt-2 sm:mt-4 block"
          >
            View on Unsplash
          </a>
        </div>
      </div>
    </div>
  );
}
