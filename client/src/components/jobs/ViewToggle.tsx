import { Grid, List } from 'lucide-react';
import React from 'react';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange,
  className = ''
}) => {
  return (
    <div className={`inline-flex rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-1 ${className}`}>
      <button
        onClick={() => onViewChange('grid')}
        className={`inline-flex items-center px-2 md:px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-all duration-200 ${currentView === 'grid'
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        aria-label="Switch to grid view"
        aria-pressed={currentView === 'grid'}
        title="Grid View"
      >
        <Grid className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
        <span className="hidden sm:inline">Grid</span>
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`inline-flex items-center px-2 md:px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-all duration-200 ${currentView === 'list'
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        aria-label="Switch to list view"
        aria-pressed={currentView === 'list'}
        title="List View"
      >
        <List className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
        <span className="hidden sm:inline">List</span>
      </button>
    </div>
  );
};

export default ViewToggle;
