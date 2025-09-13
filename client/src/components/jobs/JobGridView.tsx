import { format, formatDistanceToNow } from 'date-fns';
import { BarChart2, Edit, Play, Trash2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../types';
import JobToggleSwitch from './JobToggleSwitch';
import NotificationIndicators from './NotificationIndicators';
import JobCard from './JobCard';

interface JobGridViewProps {
  jobs: Job[];
  onDelete: (id: string) => void;
  onJobRun: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const JobGridView: React.FC<JobGridViewProps> = ({ jobs, onDelete, onJobRun, onToggleActive }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
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
