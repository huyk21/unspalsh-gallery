import { useParams, useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
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

// Fetch function for the photo details
const fetchPhotoDetails = async (id: string) => {
  const response = await axios.get(`https://api.unsplash.com/photos/${id}`, {
    headers: {
      Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
    },
  });
  return response.data;
};

export default function PhotoDetails() {
  const { id } = useParams<{ id: string }>(); // Extract the photo ID from the URL
  const navigate = useNavigate(); // To close the modal

  // Use React Query to fetch the photo details
  const {
    data: photo,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['photo', id], // Unique key for this query
    queryFn: () => fetchPhotoDetails(id as string), // Ensure id is passed correctly
    enabled: !!id, // Only run the query if id is available
  });

  const closeModal = () => navigate(-1); // Close the modal and return to the previous route

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal(); // Close the modal if the user clicks outside the content area
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !photo) return <ErrorMessage message="Error fetching photo details" />;

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
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
