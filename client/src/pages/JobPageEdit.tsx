import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getJobById, updateJob } from '../api';
import JobForm from '../components/jobs/JobForm';
import { Job } from '../types';

const EditJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setError('Job ID is missing.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await getJobById(id);
        const fetchedJob = response.data as Job;
        if (fetchedJob) {
          setJob(fetchedJob);
        } else {
          setError('Job not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch job details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleSubmit = async (data: Job) => {
    if (!id) return;
    try {
      console.log('Submitting job data:', data);
      setIsSaving(true);
      setError(null);
      await updateJob(id, data);
      navigate('/jobs');
    } catch (err: any) {
      setError(err.message || 'Failed to update job');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded max-w-4xl mx-auto mt-8">
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
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12 max-w-4xl mx-auto">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Job not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The job you are trying to edit does not exist.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Jobs List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div >
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-1 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-400">Edit Crawl Job</h1>
      </div>

      <JobForm
        initialData={job}
        onSubmit={handleSubmit}
        isLoading={isSaving}
        error={error}
      />
    </div>
  );
};

export default EditJobPage;
