import React from 'react';

interface LoadingPlaceholderProps {
  title?: string;
  description?: string;
}

const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({
  title = 'Loading...',
  description = 'Please wait while we fetch the latest data.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-4">
      <div className="flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">{description}</p>
    </div>
  );
};

export default LoadingPlaceholder;
