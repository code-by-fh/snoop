import { format, formatDistanceToNow } from 'date-fns';
import { ArrowUpDown, BarChart2, ChevronDown, ChevronUp, Edit, Play, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../types';
import JobToggleSwitch from './JobToggleSwitch';
import NotificationIndicators from './NotificationIndicators';
import { isFailed, isRunning, isFinished } from "../../utils/job";
import JobStatusBadge from './JobStatusBadge';
import { JobStatus } from '@/utils/jobStatusStyles';

interface JobListViewProps {
  jobs: Job[];
  jobsStatus: any;
  onDelete: (id: string) => void;
  onJobRun: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

type SortField = 'name' | 'status' | 'createdAt' | 'updatedAt' | 'progress' | 'isActive';
type SortDirection = 'asc' | 'desc';

const JobListView: React.FC<JobListViewProps> = ({ jobs, jobsStatus, onDelete, onJobRun, onToggleActive }) => {
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

    return sortDirection === 'asc' ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) : (aValue > bValue ? -1 : aValue < bValue ? 1 : 0);
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/40">
          <tr>
            <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200"><SortButton field="isActive">Active / Inactive</SortButton></th>
            <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200"><SortButton field="name">Job Name</SortButton></th>
            <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Notifications</th>
            <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200"><SortButton field="createdAt">Created</SortButton></th>
            <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200"><SortButton field="updatedAt">Last Run</SortButton></th>
            <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Results</th>
            <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Actions</th>
            <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedJobs.map((job) => {
            const isInactive = !job.isActive;
            const ownerClass = !job.owner ? "bg-yellow-50 dark:bg-yellow-900/20" : "";
            const failedClass = job.status === "failed" ? "ring-2 ring-red-200 dark:ring-red-400" : "";

            return (
              <tr
                key={job.id}
                className={`transition-shadow duration-300 hover:shadow-md rounded-xl border 
                  ${isInactive ? "bg-gray-100 dark:bg-gray-800/40 border-gray-300 dark:border-gray-700" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"} 
                  ${ownerClass} 
                  ${failedClass}`}
              >
                <td className='px-6 py-4'>
                  <JobToggleSwitch
                    jobId={job.id}
                    isActive={job.isActive}
                    onToggleActive={onToggleActive}
                    jobStatus={jobsStatus[job.id]}
                    size="sm"
                  />
                </td>
                <td className='px-2 py-4'>
                  <span
                    className={`text-sm font-medium truncate block 
                      ${isInactive ? "text-gray-400 line-through" : "text-gray-900 dark:text-gray-100"}`}
                    title={job.name}
                  >
                    {job.name}
                  </span>
                </td>
                <td className={`px-2 py-4`}>
                  <NotificationIndicators adapters={job.notificationAdapters || []} size="sm" maxDisplay={3} isJobInactive={isInactive} />
                </td>
                <td className={`px-2 py-4 text-sm ${isInactive ? "text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
                  <div>{format(new Date(job.createdAt), 'MMM dd, yyyy')}</div>
                  <div className="text-xs text-gray-400">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</div>
                </td>
                <td className={`px-2 py-4 text-sm ${isInactive ? "text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
                  <div>{format(new Date(job.updatedAt), 'MMM dd, yyyy')}</div>
                  <div className="text-xs text-gray-400">{formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true })}</div>
                </td>
                <td className={`px-2 py-4 text-sm`}>
                  <div className="flex space-x-4">
                    <div>
                      <span className={`font-medium ${isInactive ? "text-gray-400" : "text-gray-900 dark:text-gray-100"}`}>{job.totalListings}</span>
                      <span className={`text-gray-500 dark:text-gray-400 ml-1`}>total</span>
                    </div>
                    <div>
                      <span className={`font-medium ${isInactive ? "text-gray-400" : "text-green-600 dark:text-green-400"}`}>{job.newListings}</span>
                      <span className={`text-gray-500 dark:text-gray-400 ml-1`}>new</span>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(job.id)}
                      className={`btn-icon bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800`}
                      title="Edit job configuration"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onJobRun(job.id)}
                      className={`btn-icon bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800`}
                      title="Run job now"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleViewStatisticsClick(job.id)}
                      className={`btn-icon bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800`}
                      title="View job statistics"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(job.id)}
                      className={`btn-icon bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800`}
                      title="Delete job permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
                <td className="px-2 py-4">
                  <JobStatusBadge status={(jobsStatus[job.id] || "waiting") as JobStatus} isJobActive={job.isActive} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default JobListView;
