import React from 'react';
import { Job } from '../../types';
import JobCard from './JobCard';

interface JobGridViewProps {
  jobs: Job[];
  jobsStatus: any
  onDelete: (id: string) => void;
  onJobRun: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const JobGridView: React.FC<JobGridViewProps> = ({ jobs, jobsStatus, onDelete, onJobRun, onToggleActive }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onDelete={onDelete}
          onJobRun={onJobRun}
          onToggleActive={onToggleActive}
          jobStatus={jobsStatus[job.id]?.status || "waiting"}
        />
      ))}
    </div>
  );
};

export default JobGridView;
