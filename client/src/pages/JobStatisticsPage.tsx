import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { getJobStats } from '../api';
import { JobStatistics } from '../types/statistic';
import { format, formatDistanceToNow } from 'date-fns';
import JobErrorPanel from '@/components/jobs/JobErrorPanel';

const JobStatisticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [stats, setStats] = useState<JobStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobStats = async () => {
      setIsLoading(true);
      if (!id) {
        setError('Job ID is missing.');
        setIsLoading(false);
        return;
      }
      getJobStats(id)
        .then(response => setStats(response.data || null))
        .then(() => setIsLoading(false))
        .catch(() => {
          setError('Failed to load job statistics. Please try again later.');
          setStats(null);
          setIsLoading(false);
        });
    };

    fetchJobStats();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const COLORS = ['#1E40AF', '#0D9488', '#F97316', '#8B5CF6', '#EF4444', '#3B82F6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-1 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-400">Statistics for {stats.jobName}</h1>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 2xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Job ID</h2>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 break-all">{stats.jobId}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Total Listings</h2>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.totalListings}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">New Listings Today</h2>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">{stats.newListingsToday}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Providers</h2>
          <p className="text-xl font-medium text-blue-600 dark:text-blue-400 break-all">{stats.providerCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Created</h2>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 break-all">{formatDistanceToNow(new Date(stats.createdAt), { addSuffix: true })}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Last Run</h2>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 break-all">{stats.lastRun ? format(new Date(stats.lastRun), "MMM dd, yyyy HH:mm") : "–"}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Listings by Source</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.listingsBySource || []}
                  cx="50%" cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {(stats.listingsBySource || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--tw-prose-bg)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Average Processing Time (ms)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.processingTime || []}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip formatter={(value: number) => `${value} ms`} contentStyle={{ backgroundColor: 'var(--tw-prose-bg)' }} />
                <Legend />
                <Bar dataKey="avgTimeMs" fill="#3B82F6" name="Avg. Time" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Listings Over Time</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.listingsOverTime || []}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="date" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--tw-prose-bg)' }} />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#0D9488" activeDot={{ r: 8 }} name="Listings" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Error Infos</h2>
        <JobErrorPanel stats={stats} />
      </div>
    </div>
  );
};

export default JobStatisticsPage;