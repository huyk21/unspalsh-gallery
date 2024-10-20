import React from 'react';

/**
 * Error Message Component
 * @param {string} message - The error message to display
 */
export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-center text-red-600 text-xl font-semibold bg-red-100 p-4 rounded-md shadow-md">
      {message}
    </p>
  </div>
);
