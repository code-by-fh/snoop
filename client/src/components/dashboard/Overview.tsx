import { Activity, Hammer, House, MapPinPlus, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { Statistics } from '../../types/statistic';

interface OverviewProps {
  stats: Statistics
}

const Overview: React.FC<OverviewProps> = ({ stats }) => {
  const metrics = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      change: stats.meta.totalJobsChange,
      trend: stats.meta.totalJobsChange.startsWith('-') ? 'down' : 'up',
      icon: <Hammer className="w-5 h-5" />,
      color: 'blue'
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      change: stats.meta.activeJobsChange,
      trend: stats.meta.activeJobsChange.startsWith('-') ? 'down' : 'up',
      icon: <Activity className="w-5 h-5" />,
      color: 'green'
    },
    {
      title: 'Total Listings',
      value: stats.totalListings.toLocaleString(),
      change: stats.meta.totalListingsChange,
      trend: stats.meta.totalListingsChange.startsWith('-') ? 'down' : 'up',
      icon: <House className="w-5 h-5" />,
      color: 'purple'
    },
    {
      title: 'New Today',
      value: stats.newListingsToday,
      change: stats.meta.newListingsTodayChange,
      trend: stats.meta.newListingsTodayChange.startsWith('-') ? 'down' : 'up',
      icon: <MapPinPlus className="w-5 h-5" />,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconBgClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      purple: 'bg-purple-100',
      orange: 'bg-orange-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getColorClasses(metric.color)} dark:bg-gray-700 dark:border-gray-600`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{metric.value}</p>
                <div className="flex items-center mt-2">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${getIconBgClass(metric.color)}`}>
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
