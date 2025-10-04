import SearchInput from '@/components/common/SearchInput';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteJob, getJobs, runJob, updateJob } from '../api';
import JobGridView from '../components/jobs/JobGridView';
import JobListView from '../components/jobs/JobListView';
import ViewToggle from '../components/jobs/ViewToggle';
import DeleteJobModal from '../components/modals/DeleteJobModal';
import { useViewPreference } from '../hooks/useViewPreference';
import { Job } from '../types';

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useViewPreference('grid');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState<{ isActive: boolean | null }>({
    isActive: null,
  });

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

    setIsDeleting(true);
    try {
      await deleteJob(jobToDelete.id);
      setJobs(jobs.filter((job) => job.id !== jobToDelete.id));
      setIsDeleteModalOpen(false);
      setJobToDelete(null);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
    setIsDeleting(false);
  };

  const onJobRun = async (id: string) => {
    try {
      await runJob(id);
      setJobs(
        jobs.map((job) =>
          job.id === id ? { ...job, status: 'running' } : job
        )
      );
      setError(null);
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
    setFilters({ isActive: value === '' ? null : value === 'true' });
  };

  const filteredJobs = jobs
    .filter((job) =>
      job.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((job) =>
      filters.isActive === null ? true : job.isActive === filters.isActive
    );

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-400">
            Crawl Jobs - Showing {filteredJobs.length} Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage, search, and filter your job listings with ease, and choose
            between grid or list view.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
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
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by job title..."
        />
        <select
          value={filters.isActive === null ? '' : filters.isActive.toString()}
          onChange={handleIsActiveFilterChange}
          className="block w-48 px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-dark-input text-gray-900 dark:text-dark-text placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <Link to="/jobs/new" className="btn-primary">
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

      {/* Delete Confirmation Modal */}
      <DeleteJobModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteJob}
        job={jobToDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default JobsPage;
