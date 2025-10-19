import {
  BarChart3,
  TrendingUp,
  Globe2,
  Clock4,
  Plus,
  LayoutDashboard,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getdStats } from '../api';
import Overview from '../components/dashboard/Overview';
import PriceAnalysis from '../components/dashboard/PriceAnalysis';
import SourceAnalysis from '../components/dashboard/SourceAnalysis';
import TimeTrends from '../components/dashboard/TimeTrends';
import { Statistics } from '../types/statistic';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await getdStats();
        setStats(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch statistics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 mt-4 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!stats || stats.totalJobs === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        <BarChart3 className="w-12 h-12 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          No statistics available yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          You haven’t run any crawl jobs yet. Start by creating a new one to collect listings and see your analytics here.
        </p>
        <Link
          to="/jobs/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Crawl Job
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analytics Dashboard
          </h1>
        </div>
        <Link
          to="/jobs/new"
          className="btn-primary w-full sm:w-auto flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Crawl Job
        </Link>
      </div>

      {/* Overview */}
      <section>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Overview
            </h2>
          </div>
          <Overview stats={stats} />
        </div>
      </section>

      <div className="space-y-12">
        {/* Price Analysis */}
        <section>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Price Analysis
              </h2>
            </div>
            <PriceAnalysis listingsByPrice={stats.listingsByPrice} />
          </div>
        </section>

        {/* Source Analysis */}
        <section>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Source Analysis
              </h2>
            </div>
            <SourceAnalysis listingsBySource={stats.listingsBySource} />
          </div>
        </section>

        {/* Time Trends */}
        <section>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock4 className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Time Trends
              </h2>
            </div>
            <TimeTrends listingsByDate={stats.listingsByDate} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
