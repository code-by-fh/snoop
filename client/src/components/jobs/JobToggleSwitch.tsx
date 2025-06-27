import { Power } from 'lucide-react';
import React from 'react';

interface JobToggleSwitchProps {
  jobId: string;
  isActive: boolean;
  onToggleActive: (id: string, isActive: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  jobStatus?: string;
}

const JobToggleSwitch: React.FC<JobToggleSwitchProps> = ({
  jobId,
  isActive,
  onToggleActive,
  disabled = false,
  size = 'md',
  showLabel = false,
  jobStatus
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-8 h-4',
          toggle: 'w-3 h-3',
          translate: 'translate-x-4'
        };
      case 'lg':
        return {
          container: 'w-12 h-6',
          toggle: 'w-5 h-5',
          translate: 'translate-x-6'
        };
      default:
        return {
          container: 'w-10 h-5',
          toggle: 'w-4 h-4',
          translate: 'translate-x-5'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const getStatusColor = () => {
    if (disabled) return 'bg-gray-300';
    if (!isActive) return 'bg-gray-300';

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
        return 'bg-blue-500';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {showLabel && (
        <div className="flex items-center space-x-1">
          <Power className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
          <span className={`font-medium ${size === 'sm' ? 'text-xs' : 'text-sm'} ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          onToggleActive(jobId, !isActive);
          console.log(`Toggled job ${jobId} to ${!isActive}`);
        }}
        disabled={disabled}
        className={`
          relative inline-flex items-center ${sizeClasses.container} rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${getStatusColor()}
        `}
        role="switch"
        aria-checked={isActive}
        aria-label={`${isActive ? 'Disable' : 'Enable'} job`}
        title={`${isActive ? 'Disable' : 'Enable'} job`}
      >
        <span
          className={`
            ${sizeClasses.toggle} inline-block rounded-full bg-white shadow-lg transform ring-0 transition duration-200 ease-in-out
            ${isActive ? sizeClasses.translate : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
};

export default JobToggleSwitch;
