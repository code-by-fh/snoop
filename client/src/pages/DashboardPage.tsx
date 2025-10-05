import { BarChart3, Clock, Globe, Plus, TrendingUp } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'price' | 'source' | 'time'>('price');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await getdStats();
        const stats = response.data;
        setStats(stats);
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
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const tabs = [
    {
      id: 'price',
      label: 'Price Analysis',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'source',
      label: 'Source Analysis',
      icon: <Globe className="w-4 h-4" />
    },
    {
      id: 'time',
      label: 'Time Trends',
      icon: <Clock className="w-4 h-4" />
    }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'price':
        return <PriceAnalysis listingsByPrice={stats.listingsByPrice} />;
      case 'source':
        return <SourceAnalysis listingsBySource={stats.listingsBySource} />;
      case 'time':
        return <TimeTrends listingsByDate={stats.listingsByDate} />;
      default:
        return <PriceAnalysis listingsByPrice={stats.listingsByPrice} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights into your job listings and performance
          </p>
        </div>
        <Link
          to="/jobs/new"
          className="btn-primary w-full sm:w-auto flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Crawl Job
        </Link>
      </div>

      <Overview stats={stats} />

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto" aria-label="Analytics Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Active Component */}
      <div className="min-h-[600px]">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default DashboardPage;
