import { useAppMeta } from '@/context/AppMetaContext';
import { AlertCircle, ArrowRightToLine, Eye, EyeOff, Lock, User } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/logo.png';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from '../components/ThemeSwitcher';

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const { config } = useAppMeta();
  const navigate = useNavigate();

  if (user) {
    navigate('/dashboard', { replace: true });
  }

  const validateForm = (): boolean => {
    if (!identifier.trim()) { setError('Username or email is required'); return false; }
    if (!password.trim()) { setError('Password is required'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await login(identifier, password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {config?.isDemoModeEnabled && (
        <div className="w-full max-w-md mb-6 p-4 rounded-xl bg-yellow-200 dark:bg-yellow-600 text-gray-900 dark:text-gray-100 border border-yellow-400 dark:border-yellow-500 shadow-md text-center">
          <p className="font-semibold mb-2">⚠️ Demo Mode Active</p>
          <ul className="text-sm space-y-2">
            {[{ user: 'admin', pass: 'Password123!' }, { user: 'user', pass: 'Password123!' }].map(account => (
              <li key={account.user} className="flex justify-between items-center">
                <span className="font-bold text-xl">{account.user} : {account.pass}</span>
                <button
                  type="button"
                  onClick={() => { setIdentifier(account.user); setPassword(account.pass); }}
                  className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-blue-500 dark:bg-blue-700 text-white font-medium hover:bg-blue-600 dark:hover:bg-blue-800 transition-all shadow-md"
                >
                  <ArrowRightToLine />
                  <span>Autofill</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img src={Logo} alt="SNOOP Logo" className="h-12 w-auto transition-all duration-300" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in with your username or email</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg shadow-sm animate-shake">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="relative">
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username or Email
              </label>
              <div className="relative w-full">
                <input
                  id="identifier"
                  name="identifier"
                  autoFocus
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                  placeholder="Enter your username or email"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setError(null); }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative w-full">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg shadow-md text-white transition-all duration-300 ease-in-out ${isLoading
                ? 'bg-blue-600 cursor-not-allowed dark:bg-blue-500'
                : 'bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Register & Forgot Password */}
        {config?.isSelfRegistrationEnabled && (
          <div className="flex justify-between mt-4 text-sm">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </div>
        )}
      </div>

      {config?.isTrackingEnabled && (
        <div className="w-full max-w-md p-4 mt-10 rounded-xl opacity-15 dark:opacity-10 bg-yellow-200 dark:bg-yellow-600 text-gray-900 dark:text-gray-100 border border-yellow-400 dark:border-yellow-500 shadow-md text-center">
          <p className="font-semibold mb-2">Tracking Enabled</p>
          <p className="text-sm">
            We will record <strong>which pages you visit</strong> and <strong>which buttons or features you interact with</strong>.
            <br /><strong>No</strong> personal data is collected.
          </p>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeSwitcher collapsed />
      </div>
    </div>

  );
};

export default LoginPage;
