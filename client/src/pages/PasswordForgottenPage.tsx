import { requestPasswordReset } from '@/api';
import { CheckCircle, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';
import ErrorInfo from '../components/common/ErrorInfo';

const PasswordForgottenPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email) {
      setError('Email is required.');
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      setMessage('If this email exists, a password reset link has been sent.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send password reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Forgot Password
        </h2>

        {message && (
          <div className="flex items-start space-x-3 p-4 mb-4 rounded-lg shadow-sm bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <p className="text-sm text-green-700 dark:text-green-300">{message}</p>
          </div>
        )}

        {error && <ErrorInfo error={error} />}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <div className="relative w-full">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoFocus
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-all duration-300 ${isLoading
                ? 'bg-blue-600 cursor-not-allowed dark:bg-blue-500'
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Remembered your password?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeSwitcher collapsed />
      </div>
    </div>
  );
};

export default PasswordForgottenPage;
