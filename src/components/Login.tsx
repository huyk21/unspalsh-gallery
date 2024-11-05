import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

type LoginResponse = {
  access_token: string;
};

type LoginFormInputs = {
  username: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const loginMutation = useMutation<LoginResponse, Error, LoginFormInputs>({
    mutationFn: async (data: LoginFormInputs) => {
      const response = await axios.post('https://user-registration-be.vercel.app/user/login', {
        usernameOrEmail: data.username,
        password: data.password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      Cookies.set('token', data.access_token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      });
      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    },
    onError: (error: any) => {
      setMessage(`Login failed: ${error.response?.data?.message || error.message}`);
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    setMessage(null); // Clear previous messages
    loginMutation.mutate(data, {
      onError: (error) => {
        console.error('Custom onError:', error);
        setMessage('Login failed: Please check your credentials and try again.');
      },
      onSuccess: (data) => {
        console.log('Custom onSuccess:', data);
        setMessage('Custom Success: Redirecting...');
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

      {message && (
        <p className={`text-center mb-4 ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block mb-2 text-sm font-medium text-gray-600">Sample Credentials: maria / password123</label>
        
        <input
          type="text"
          placeholder="Username or Email"
          defaultValue="maria" // Pre-fill with sample data
          {...register('username', {
            required: 'Username or email is required',
           
          })}
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

        <input
          type="password"
          placeholder="Password"
          defaultValue="password123" // Pre-fill with sample data
          {...register('password', { required: 'Password is required' })}
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loginMutation.isPending} // Disable button while loading
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
