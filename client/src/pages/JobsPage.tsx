import SearchInput from '@/components/common/SearchInput';
import ListingsViewToggle from '@/components/common/ViewToggle';
import JobToggleSwitch from '@/components/jobs/JobToggleSwitch';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { Grid3X3, List, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { deleteJob, getJobs, getUserProfile, runJob, updateJob } from '../api';
import JobGridView from '../components/jobs/JobGridView';
import JobListView from '../components/jobs/JobListView';
import { useViewPreference } from '../hooks/useViewPreference';
import { Job } from '../types';

const socket = io('http://localhost:8888');

const getToastIcon = (status: string) => {
  switch (status) {
    case 'running':
      return '🏃‍♂️';
    case 'success':
      return '✅';
    case 'finished':
      return '🎉';
    case "failed":
      return '❌';
    default:
      return 'ℹ️';
  }
};

const JobsPage: React.FC = () => {
  const [jobsStatus, setJobsStatus] = useState<Job[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
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



  useEffect(() => {
    socket.emit('get-all-jobs-status');

    socket.on('all-jobs-status', (jobs) => {
      setJobsStatus(jobs);
    });

    socket.on('job-status', (job) => {
      toast(`Job ${job.name} is ${job.status}`, { icon: getToastIcon(job.status) });
      setJobsStatus((prev) => ({ ...prev, [job.id]: { ...prev[job.id], status: job.status } }));
    });

    return () => {
      socket.off('all-jobs-status');
      socket.off('job-status');
    };
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await getUserProfile();
      setIsAdmin(response.data.role.includes('admin'));
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await getJobs();
      setJobs(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJobClick = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (job) {
      setJobToDelete(job);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      toast('Job deleted successfully!', { icon: '🗑️' });
      await deleteJob(jobToDelete.id);
      setJobs(jobs.filter((job) => job.id !== jobToDelete.id));
      setIsDeleteModalOpen(false);
      setJobToDelete(null);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete job');
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
      setJobs(
        jobs.map((job) => (job.id === id ? { ...job, isActive } : job))
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update job status');
    }
  };

  const handleIsActiveFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, isActive: value === '' ? null : value === 'true' }));
  };

  const handleOnlyMyJobsFilterChange = (id: string, isActive: boolean) => {
    setFilters(prev => ({ ...prev, onlyMyJobs: isActive }));
  };

  const filteredJobs = jobs
    .filter((job) =>
      job.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((job) =>
      filters.isActive === null ? true : job.isActive === filters.isActive
    )
    .filter((job) =>
      filters.onlyMyJobs ? job.owner : true
    )  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 mt-4 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section with View Toggle */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Crawl Jobs - Showing {filteredJobs.length} Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage, search, and filter your job listings with ease.
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Active Filter */}
      <div className="sticky top-0 z-20 py-2 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-2 items-center">
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
          className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-dark-input text-gray-900 dark:text-dark-text placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {isAdmin && (
          <div className="flex items-center justify-between w-full sm:w-auto border border-gray-300 rounded-md bg-white dark:bg-dark-input text-gray-900 dark:text-dark-text px-3 py-2">
            <span className="text-gray-700 dark:text-gray-300 mr-3">
              Show Only My Jobs
            </span>
            <JobToggleSwitch
              jobId="admin-filter"
              isActive={filters.onlyMyJobs || false}
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

      {/* Jobs Content */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No jobs found. Adjust your search or filter criteria.
        </div>
      ) : (
        <div className="transition-all duration-300 ease-in-out">
          {viewMode === 'grid' ? (
            <JobGridView
              jobsStatus={jobsStatus}
              jobs={filteredJobs}
              onDelete={handleDeleteJobClick}
              onJobRun={onJobRun}
              onToggleActive={handleToggleActive}
            />
          ) : (
            <JobListView
              jobsStatus={jobsStatus}
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
        message={`Are you sure you want to delete this Job? This action cannot be undone and ${jobToDelete?.totalListings} Listings will be removed.`}
        confirmText="Delete"
        variant="alert"
      />
    </div>
  );
};

export default JobsPage;
