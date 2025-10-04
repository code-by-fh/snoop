import { Grid3X3, List, Map } from 'lucide-react';
import React from 'react';

export type ListingsViewMode = 'grid' | 'list' | 'map';

interface ListingsViewToggleProps {
  currentView: ListingsViewMode;
  onViewChange: (view: ListingsViewMode) => void;
}

const viewConfigs: {
  mode: ListingsViewMode;
  label: string;
  icon: React.ElementType;
  ariaLabel: string;
}[] = [
  { mode: 'grid', label: 'Grid', icon: Grid3X3, ariaLabel: 'Grid view' },
  { mode: 'list', label: 'List', icon: List, ariaLabel: 'List view' },
  { mode: 'map', label: 'View on Map', icon: Map, ariaLabel: 'View on map' },
];

const ListingsViewToggle: React.FC<ListingsViewToggleProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full sm:w-auto">
      <div className="flex w-full sm:w-auto justify-between sm:justify-start rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-1">
        {viewConfigs.map(({ mode, label, icon: Icon, ariaLabel }) => (
          <button
            key={mode}
            onClick={() => onViewChange(mode)}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
              currentView === mode
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            aria-label={ariaLabel}
            aria-pressed={currentView === mode}
          >
            <Icon className="h-4 w-4 mr-1 sm:mr-2" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListingsViewToggle;
