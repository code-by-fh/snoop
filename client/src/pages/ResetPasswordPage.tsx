import { resetPassword } from '@/api';
import { CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorInfo from '../components/common/ErrorInfo';
import ThemeSwitcher from '../components/ThemeSwitcher';

const useQuery = () => new URLSearchParams(useLocation().search);

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword(token, password);
      setMessage(response.data.message || 'Password has been reset successfully!');
      toast.success(response.data.message || 'Password has been reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to reset password';
      toast.error(msg);
      setError(err.response?.data?.errors || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Reset Password</h2>

        {message && (
          <div className="flex items-center bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-lg shadow-sm mb-4">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700 dark:text-green-300">{message}</p>
          </div>
        )}

        {error && <ErrorInfo error={error} />}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              className="block w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              className="block w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-all duration-300 ${isLoading
              ? 'bg-blue-600 cursor-not-allowed dark:bg-blue-500'
              : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Remembered your password?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">Login</button>
        </p>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeSwitcher collapsed />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
