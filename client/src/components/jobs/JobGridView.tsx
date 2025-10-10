import React from 'react';
import { Job } from '../../types';
import JobCard from './JobCard';

interface JobGridViewProps {
  jobs: Job[];
  onDelete: (id: string) => void;
  onJobRun: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const JobGridView: React.FC<JobGridViewProps> = ({ jobs, onDelete, onJobRun, onToggleActive }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onDelete={onDelete}
          onJobRun={onJobRun}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};

export default JobGridView;
