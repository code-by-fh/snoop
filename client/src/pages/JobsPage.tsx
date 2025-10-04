import { Plus, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteJob, getJobs, updateJob, runJob } from '../api';
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

  useEffect(() => {
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
    fetchJobs();
  }, []);

  const handleDeleteJobClick = (id: string) => {
    const job = jobs.find(j => j.id === id);
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
      setJobs(jobs.filter(job => job.id !== jobToDelete.id));
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
      setJobs(jobs.map(job =>
        job.id === id ? { ...job, status: 'running' } : job
      ));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to run job');
    }

  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateJob(id, { isActive });
      setJobs(jobs.map(job =>
        job.id === id ? { ...job, isActive } : job
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update job status');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-400">Crawl Jobs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage, search, and filter your job listings with ease, and choose between grid or list view.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Toggle Component - Key Feature */}
          <ViewToggle
            currentView={viewMode}
            onViewChange={setViewMode}
            className="shadow-sm"
          />
          <Link
            to="/jobs/new"
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Job
          </Link>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-dark-input text-light-text dark:text-dark-text"
          placeholder="Search jobs by name or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content Area - Switchable Views */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-blue-300 opacity-30"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-blue-600 animate-spin"></div>
            <div className="absolute inset-1 flex items-center justify-center">
              <span className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></span>
            </div>
          </div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating a new job'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Link
                to="/jobs/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Job
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="transition-all duration-300 ease-in-out">
          {/* Conditional Rendering Based on View Mode */}
          {viewMode === 'grid' ? (
            <div>
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredJobs.length} jobs
              </div>
              <JobGridView
                jobs={filteredJobs}
                onDelete={handleDeleteJobClick}
                onJobRun={onJobRun}
                onToggleActive={handleToggleActive}
              />
            </div>
          ) : (
            <div>
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredJobs.length} jobs
              </div>
              <JobListView
                jobs={filteredJobs}
                onDelete={handleDeleteJobClick}
                onJobRun={onJobRun}
                onToggleActive={handleToggleActive}
              />
            </div>
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
