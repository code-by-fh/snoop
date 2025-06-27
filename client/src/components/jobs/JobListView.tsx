import { format, formatDistanceToNow } from 'date-fns';
import {
  ArrowUpDown,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Edit,
  Play,
  Trash2
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../types';
import JobToggleSwitch from './JobToggleSwitch';
import NotificationIndicators from './NotificationIndicators';

interface JobListViewProps {
  jobs: Job[];
  onDelete: (id: string) => void;
  onJobRun: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

type SortField = 'name' | 'status' | 'createdAt' | 'updatedAt' | 'progress' | 'isActive';
type SortDirection = 'asc' | 'desc';

const JobListView: React.FC<JobListViewProps> = ({ jobs, onDelete, onJobRun, onToggleActive }) => {

  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleEditClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleViewStatisticsClick = (jobId: string) => {
    navigate(`/jobs/${jobId}/statistics`);
  };

  const SortButton: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-900 hover:text-gray-700 focus:outline-none focus:text-gray-700"
    >
      <span>{children}</span>
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )
      ) : (
        <ArrowUpDown className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 ">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="isActive">Status</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="name">Job Name</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notifications
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="createdAt">Created</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="updatedAt">Last Run</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="progress">Progress</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Results
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedJobs.map((job) => (
              <tr
                key={job.id}
                className={`hover:bg-gray-50 transition-colors duration-150 dark:bg-dark-input
                  ${!job.isActive ? 'bg-gray-100' : ''} 
                  ${!job.owner ? 'bg-yellow-50 dark:bg-yellow-50 ' : ''}
                  `}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <JobToggleSwitch
                    jobId={job.id}
                    isActive={job.isActive}
                    onToggleActive={onToggleActive}
                    jobStatus={job.status}
                    size="sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`text-sm font-medium max-w-xs truncate 
                    ${job.isActive ? 'text-gray-900 ' : 'text-gray-500'}
                    ${!job.owner ? '' : 'dark:text-dark-text'}`
                    }
                      title={job.name}>

                      {job.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NotificationIndicators
                    adapters={job.notificationAdapters || []}
                    size="sm"
                    maxDisplay={2}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{format(new Date(job.createdAt), 'MMM dd, yyyy')}</div>
                  <div className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{format(new Date(job.updatedAt), 'MMM dd, yyyy')}</div>
                  <div className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${job.isActive ? 'bg-blue-600' : 'bg-gray-400'
                          }`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900">{job.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-4">
                    <div>
                      <span className="font-medium text-gray-900">{job.totalListings}</span>
                      <span className="text-gray-500"> total</span>
                    </div>
                    <div>
                      <span className="font-medium text-green-600">{job.newListings}</span>
                      <span className="text-gray-500"> new</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-1.5">

                    {/* 1. EDIT BUTTON - Primary Action (Left Position) */}
                    <button
                      onClick={() => handleEditClick(job.id)}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      title="Edit job configuration"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                    </button>

                    {/* 3. PLAY/PAUSE BUTTON - Tertiary Action (Center Position) */}
                    {
                      <button
                        onClick={() => onJobRun(job.id)}
                        className="inline-flex items-center p-1.5 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1"
                        style={{
                          backgroundColor: '#caffcc',
                          color: '#137f2a'
                        }}
                        title={"Run job now"}
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    }

                    {/* 4. VIEW STATISTICS BUTTON - New Addition */}
                    <button
                      onClick={() => handleViewStatisticsClick(job.id)}
                      className="inline-flex items-center p-1.5 text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
                      title="View job statistics"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                    </button>

                    {/* 5. DELETE BUTTON - Destructive Action (Right Position) */}
                    <button
                      onClick={() => onDelete(job.id)}
                      className="inline-flex items-center p-1.5 text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      title="Delete job permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobListView;
