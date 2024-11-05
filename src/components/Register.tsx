// src/components/Register.tsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

type RegisterFormInputs = {
  username: string;
  email: string;
  password: string;
};

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Define the mutation for registration
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormInputs) => {
      const response = await axios.post('https://user-registration-be.vercel.appuser/register', data);
      return response.data;
    },
    onSuccess: () => {
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500); // Redirect to login page
    },
    onError: (error: any) => {
      setMessage(`Registration failed: ${error.response?.data?.message || error.message}`);
    },
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    setMessage(null); // Clear previous messages
    registerMutation.mutate(data); // Trigger the mutation
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

      {message && (
        <p className={`text-center mb-4 ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Username"
          {...register('username', { required: 'Username is required' })}
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

        <input
          type="email"
          placeholder="Email"
          {...register('email', { 
            required: 'Email is required', 
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            }
          })}
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register('password', { 
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters long' }
          })}
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button
          type="submit"
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={registerMutation.isPending} // Disable button while loading
        >
          {registerMutation.isPending ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
