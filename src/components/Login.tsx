import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from './AuthContext'; // Import auth context if using

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
  const { login } = useAuth(); // Assuming you use AuthContext to manage auth globally

  const loginMutation = useMutation<LoginResponse, Error, LoginFormInputs>({
    mutationFn: async (data: LoginFormInputs) => {
      const response = await axios.post('https://user-registration-be.vercel.app/user/login', {
        usernameOrEmail: data.username,
        password: data.password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Store token in localStorage and update global auth state
      localStorage.setItem('token', data.access_token);
      login(data.access_token); // Update context state
      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    },
    onError: (error: any) => {
      setMessage(`Login failed: ${error.response?.data?.message || error.message}`);
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    setMessage(null); // Clear previous messages
    loginMutation.mutate(data);
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
          {...register('username', { required: 'Username or email is required' })}
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: 'Password is required' })}
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
