import { Power } from 'lucide-react';
import React from 'react';

interface JobToggleSwitchProps {
  jobId: string;
  isActive: boolean;
  onToggleActive: (id: string, isActive: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  jobStatus?: string;
}

const JobToggleSwitch: React.FC<JobToggleSwitchProps> = ({
  jobId,
  isActive,
  onToggleActive,
  disabled = false,
  size = 'md',
  jobStatus
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { container: 'h-5 w-10', toggle: 'h-3 w-3', translate: 'translate-x-5' };
      case 'lg':
        return { container: 'h-8 w-16', toggle: 'h-6 w-6', translate: 'translate-x-8' };
      default:
        return { container: 'h-7 w-14', toggle: 'h-6 w-6', translate: 'translate-x-7' };
    }
  };

  const sizeClasses = getSizeClasses();

  const getStatusColor = () => {
    switch (jobStatus) {
      case 'running':
        return 'bg-green-500';
      case 'pending':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return isActive ? 'bg-blue-500' : 'bg-gray-300';
    }
  };

  return (
    <div className="flex mt-1">
      <button
        type="button"
        onClick={() => onToggleActive(jobId, !isActive)}
        disabled={disabled}
        className={`relative inline-flex items-center ${sizeClasses.container} rounded-full border-2 transition-colors duration-200 ${
          getStatusColor()
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block ${sizeClasses.toggle} transform rounded-full bg-white shadow transition-transform duration-200 ${
            isActive ? sizeClasses.translate : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default JobToggleSwitch;
