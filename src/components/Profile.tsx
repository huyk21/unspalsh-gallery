import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from './LoadingSpinner';

interface UserProfile {
  id: string;
  username: string;
  email: string;
}

// Fetch function to get the user's profile data
const fetchProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem('token'); // Use localStorage if storing token there
  
  if (!token) throw new Error('Unauthorized'); // Handle missing token

  const response = await axios.get('https://user-registration-be.vercel.app/user/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // Return data from the response
};

export default function Profile() {
  const navigate = useNavigate();

  // Use React Query's useQuery to manage profile data fetching
  const { data: profile, isLoading, error } = useQuery<UserProfile, Error>({
    queryKey: ['userProfile'],
    queryFn: fetchProfile,
    retry: false,
    
    
  });
  
  // Handle Unauthorized error by redirecting to login
  if (error && error.message === 'Unauthorized') {
    navigate('/login');
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    navigate('/login');
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {profile ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p><strong>Username:</strong> {profile.username}</p>
          
          {/* Display any other profile information here */}
        </div>
      ) : (
        <p className="text-center text-gray-500">No profile data available.</p>
      )}
    </div>
  );
}
