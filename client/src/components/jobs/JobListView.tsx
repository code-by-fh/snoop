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

  const handleEditClick = (jobId: string) => navigate(`/jobs/${jobId}`);
  const handleViewStatisticsClick = (jobId: string) => navigate(`/jobs/${jobId}/statistics`);

  const SortButton: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
    >
      <span>{children}</span>
      {sortField === field ? (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      ) : (
        <ArrowUpDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      )}
    </button>
  );

  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="table-head">
            <tr>
              <th className="table-head-cell"><SortButton field="isActive">Status</SortButton></th>
              <th className="table-head-cell"><SortButton field="name">Job Name</SortButton></th>
              <th className="table-head-cell">Notifications</th>
              <th className="table-head-cell"><SortButton field="createdAt">Created</SortButton></th>
              <th className="table-head-cell"><SortButton field="updatedAt">Last Run</SortButton></th>
              <th className="table-head-cell"><SortButton field="progress">Progress</SortButton></th>
              <th className="table-head-cell">Results</th>
              <th className="table-head-cell text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedJobs.map((job) => (
              <tr
                key={job.id}
                className={`table-row ${!job.isActive ? 'bg-gray-100 dark:bg-gray-800/40' : ''} 
                            ${!job.owner ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}
              >
                <td className="table-cell">
                  <JobToggleSwitch
                    jobId={job.id}
                    isActive={job.isActive}
                    onToggleActive={onToggleActive}
                    jobStatus={job.status}
                    size="sm"
                  />
                </td>
                <td className="table-cell">
                  <span
                    className={`text-sm font-medium truncate block ${job.isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-500'}`}
                    title={job.name}
                  >
                    {job.name}
                  </span>
                </td>
                <td className="table-cell">
                  <NotificationIndicators adapters={job.notificationAdapters || []} size="sm" maxDisplay={2} />
                </td>
                <td className="table-cell">
                  <div>{format(new Date(job.createdAt), 'MMM dd, yyyy')}</div>
                  <div className="text-xs text-gray-400">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</div>
                </td>
                <td className="table-cell">
                  <div>{format(new Date(job.updatedAt), 'MMM dd, yyyy')}</div>
                  <div className="text-xs text-gray-400">{formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true })}</div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${job.isActive ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-400 dark:bg-gray-500'}`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <span className="text-sm">{job.progress}%</span>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex space-x-4">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{job.totalListings}</span>
                      <span className="text-gray-500 dark:text-gray-400"> total</span>
                    </div>
                    <div>
                      <span className="font-medium text-green-600 dark:text-green-400">{job.newListings}</span>
                      <span className="text-gray-500 dark:text-gray-400"> new</span>
                    </div>
                  </div>
                </td>
                <td className="table-cell text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleEditClick(job.id)}
                      className="btn-icon bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                      title="Edit job configuration"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onJobRun(job.id)}
                      className="btn-icon bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                      title="Run job now"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleViewStatisticsClick(job.id)}
                      className="btn-icon bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
                      title="View job statistics"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDelete(job.id)}
                      className="btn-icon bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
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
