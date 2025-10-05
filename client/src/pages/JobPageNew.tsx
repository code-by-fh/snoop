import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../api';
import JobForm from '../components/jobs/JobForm';
import { Job } from '../types';

const NewJobPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: Job) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Submitting job data:', data);
      await createJob(data);
      navigate('/jobs');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-1 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-400">Create New Crawl Job</h1>
      </div>

      <JobForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default NewJobPage;
