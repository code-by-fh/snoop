import SearchInput from '@/components/common/SearchInput';
import ListingsViewToggle from '@/components/common/ViewToggle';
import JobToggleSwitch from '@/components/jobs/JobToggleSwitch';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { useAuth } from '@/context/AuthContext';
import { BarChart3, Grid3X3, List, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { deleteJob, getJobs, runJob, updateJob } from '../api';
import JobGridView from '../components/jobs/JobGridView';
import JobListView from '../components/jobs/JobListView';
import { useViewPreference } from '../hooks/useViewPreference';
import { Job } from '../types';

const socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:8888', {
  transports: ['websocket'],
  autoConnect: true,
});

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useViewPreference('grid', 'jobs-view-preference');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [filters, setFilters] = useState<{ isActive: boolean | null; onlyMyJobs: boolean }>({
    isActive: null,
    onlyMyJobs: true,
  });

  const { user } = useAuth();
  const isAdmin = user?.role.includes('admin');
  const userId = user?.id;

  const mergeJobs = (existingJobs: Job[], incomingJobs: Job[]): Job[] => {
    const jobsMap = new Map<string, Job>();

    existingJobs.forEach(job => jobsMap.set(job.id, job));

    incomingJobs.forEach(job => {
      const existing = jobsMap.get(job.id);
      jobsMap.set(job.id, existing ? { ...existing, ...job } : job);
    });

    return Array.from(jobsMap.values());
  }

  useEffect(() => {
    socket.emit('get-all-jobs-status');

    socket.on('all-jobs-status', (jobs: Job[]) => {
      setJobs(prevJobs => mergeJobs(prevJobs, jobs));
    });

    socket.on('job-status', (updatedJob: Job) => {
      setJobs(prev =>
        prev.map(job => (job.id === updatedJob.id ? { ...job, ...updatedJob } : job))
      );
    });

    return () => {
      socket.off('all-jobs-status');
      socket.off('job-status');
    };
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await getJobs();
      setJobs(prevJobs => mergeJobs(prevJobs, response.data));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJobClick = (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (job) {
      setJobToDelete(job);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      await deleteJob(jobToDelete.id);
      setJobs(jobs.filter(job => job.id !== jobToDelete.id));
      toast.success(`Job "${jobToDelete.name}" deleted successfully!`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setIsDeleteModalOpen(false);
      setJobToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const onJobRun = async (id: string) => {
    try {
      setError(null);
      await runJob(id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to run job');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateJob(id, { isActive });
      setJobs(prev => prev.map(job => (job.id === id ? { ...job, isActive } : job)));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update job status');
    }
  };

  const handleIsActiveFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, isActive: value === '' ? null : value === 'true' }));
  };

  const handleOnlyMyJobsFilterChange = (_: string, isActive: boolean) => {
    setFilters(prev => ({ ...prev, onlyMyJobs: isActive }));
  };

  const filteredJobs = jobs
    .filter(job =>
      job.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(job =>
      filters.isActive === null ? true : job.isActive === filters.isActive
    )
    .filter(job =>
      filters.onlyMyJobs ? job.user === userId : true
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 mt-4 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Crawl Jobs – Showing {filteredJobs.length} Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage, search, and filter your job listings with ease.
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Search & Filter */}
      <div className="sticky top-0 z-20 py-2 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-2 items-center bg-white dark:bg-gray-900">
        <ListingsViewToggle
          currentView={viewMode}
          localStorageKey="jobs-view-preference"
          onViewChange={setViewMode}
          viewConfigs={[
            { mode: 'grid', label: 'Grid', icon: Grid3X3, ariaLabel: 'Grid view' },
            { mode: 'list', label: 'List', icon: List, ariaLabel: 'List view' },
          ]}
        />

        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by job title..."
        />

        <select
          value={filters.isActive === null ? '' : filters.isActive.toString()}
          onChange={handleIsActiveFilterChange}
          className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {isAdmin && (
          <div className="flex items-center justify-between w-full sm:w-auto border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2">
            <span className="text-gray-700 dark:text-gray-300 mr-3">
              Show Only My Jobs
            </span>
            <JobToggleSwitch
              jobId="admin-filter"
              isActive={filters.onlyMyJobs}
              onToggleActive={handleOnlyMyJobsFilterChange}
              size="sm"
            />
          </div>
        )}

        <Link
          to="/jobs/new"
          className="btn-primary block w-full sm:w-auto text-center items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Job
        </Link>
      </div>

      {/* Job Content */}
      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
          <BarChart3 className="w-12 h-12 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            No Jobs available yet
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
      ) : (
        <div className="transition-all duration-300 ease-in-out">
          {viewMode === 'grid' ? (
            <JobGridView
              jobs={filteredJobs}
              onDelete={handleDeleteJobClick}
              onJobRun={onJobRun}
              onToggleActive={handleToggleActive}
            />
          ) : (
            <JobListView
              jobs={filteredJobs}
              onDelete={handleDeleteJobClick}
              onJobRun={onJobRun}
              onToggleActive={handleToggleActive}
            />
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteJob}
        title={`Delete "${jobToDelete?.name}" ?`}
        message={`Are you sure you want to delete this job? This action cannot be undone and ${jobToDelete?.totalListings ?? 0} listings will be removed.`}
        confirmText="Delete"
        variant="alert"
      />
    </div>
  );
};

export default JobsPage;
