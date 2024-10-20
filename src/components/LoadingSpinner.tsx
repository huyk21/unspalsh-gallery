import React from 'react';

/**
 * Loading Spinner Component
 */
export const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
    <p className="text-center text-lg text-gray-600 mt-4">Loading...</p>
  </div>
);
