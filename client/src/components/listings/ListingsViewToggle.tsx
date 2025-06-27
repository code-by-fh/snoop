import { Grid3X3, List, Map } from 'lucide-react';
import React from 'react';

export type ListingsViewMode = 'grid' | 'list';

interface ListingsViewToggleProps {
  currentView: ListingsViewMode;
  onViewChange: (view: ListingsViewMode) => void;
  onMapView: () => void;
  className?: string;
}

const ListingsViewToggle: React.FC<ListingsViewToggleProps> = ({
  currentView,
  onViewChange,
  onMapView,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto ${className}`}
    >
      {/* View Toggle (Grid/List) */}
      <div className="flex w-full sm:w-auto justify-between sm:justify-start rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-1">
        <button
          onClick={() => onViewChange('grid')}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all ${currentView === 'grid'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          aria-label="Grid view"
          aria-pressed={currentView === 'grid'}
        >
          <Grid3X3 className="h-4 w-4 mr-1 sm:mr-2" />
          <span>Grid</span>
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all ${currentView === 'list'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          aria-label="List view"
          aria-pressed={currentView === 'list'}
        >
          <List className="h-4 w-4 mr-1 sm:mr-2" />
          <span>List</span>
        </button>
      </div>

      {/* Map View Button */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-1">
        <button
          onClick={onMapView}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          aria-label="View on map"
        >
          <Map className="h-4 w-4 mr-1 sm:mr-2" />
          <span>View on Map</span>
        </button>
      </div>
    </div>
  );
};

export default ListingsViewToggle;
