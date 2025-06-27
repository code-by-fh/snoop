import { format, formatDistanceToNow } from 'date-fns';
import { BarChart2, Edit, Play, Trash2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../types';
import JobToggleSwitch from './JobToggleSwitch';
import NotificationIndicators from './NotificationIndicators';

interface JobGridViewProps {
  jobs: Job[];
  onDelete: (id: string) => void;
  onJobRun: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const JobGridView: React.FC<JobGridViewProps> = ({ jobs, onDelete, onJobRun, onToggleActive }) => {
  const navigate = useNavigate();

  const handleEditClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleViewStatisticsClick = (jobId: string) => {
    navigate(`/jobs/${jobId}/statistics`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {jobs.map((job) => (
        <div
          key={job.id}
          className={`bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col
                  ${job.status === 'failed' ? 'ring-2 ring-red-200 bg-red-50' : ''}
                  ${job.owner === false ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''}
                  `}
        >
          {/* Card Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="shrink-0">
                  <JobToggleSwitch
                    jobId={job.id}
                    isActive={job.isActive}
                    onToggleActive={onToggleActive}
                    jobStatus={job.status}
                    size="sm"
                  />
                </div>

                <div className="min-w-0">
                  <h3
                    className={`text-base font-semibold transition-colors duration-300 
                      ${job.isActive ? 'text-gray-900 dark:text-dark-text' : 'text-gray-400 italic line-through'}`
                    }
                    title={job.name}
                  >
                    {job.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {job.isActive ? 'Job is active' : 'Paused ⏸️'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body - Flexible Content Area */}
          <div className={`p-4 space-y-4 flex-1 ${!job.isActive ? 'bg-gray-300' : ''}`}>
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{job.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${job.isActive ? 'bg-blue-600' : 'bg-gray-400'
                    }`}
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Total</p>
                <p className={`text-lg font-semibold ${job.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                  {job.totalListings}
                </p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">New</p>
                <p className={`text-lg font-semibold ${job.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {job.newListings}
                </p>
              </div>
            </div>

            {/* Notification Adapters */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Notifications</p>
              <NotificationIndicators
                adapters={job.notificationAdapters || []}
                size="sm"
                maxDisplay={2}
              />
            </div>

            {/* Last Run */}
            <div className="text-xs text-gray-500">
              <p>Created {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
              <p>Last Run: {format(new Date(job.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
            </div>
          </div>

          {/* Card Footer*/}
          <div className="mt-auto px-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-center items-center">

              <div className="flex items-center space-x-1.5">
                {/* 1. EDIT BUTTON - Primary Action (Left Position) */}
                <button
                  onClick={() => handleEditClick(job.id)}
                  className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  title="Edit job configuration"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </button>

                {/* 3. PLAY/PAUSE BUTTON - Tertiary Action (Center Position) */}
                <button
                  onClick={() => onJobRun(job.id)}
                  className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1"
                  style={{
                    backgroundColor: '#caffcc',
                    color: '#137f2a'
                  }}
                  title={"Run job now"}
                >
                  <Play className="w-3 h-3 mr-1" />
                  Run
                </button>

                {/* 4. VIEW STATISTICS BUTTON - New Addition */}
                <button
                  onClick={() => handleViewStatisticsClick(job.id)}
                  className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
                  title="View job statistics"
                >
                  <BarChart2 className="w-3 h-3 mr-1" />
                  Stats
                </button>

                {/* 5. DELETE BUTTON - Destructive Action (Right Position) */}
                <button
                  onClick={() => onDelete(job.id)}
                  className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                  title="Delete job permanently"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobGridView;
