import {
  Binoculars,
  CloudAlert,
  SquareChevronRight
} from 'lucide-react';
import React from 'react';
import { NotificationAdapter } from '../../types';

interface NotificationIndicatorsProps {
  adapters: NotificationAdapter[];
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  maxDisplay?: number;
  isJobInactive?: boolean;
}

const NotificationIndicators: React.FC<NotificationIndicatorsProps> = ({
  adapters,
  size = 'sm',
  showLabels = true,
  maxDisplay = 3,
  isJobInactive = false
}) => {
  const activeAdapters = adapters.filter(adapter => adapter);

  const getAdapterIcon = (type: string) => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
    switch (type) {
      case 'console':
        return <SquareChevronRight className={iconSize} />;
      case 'pushover':
        return <Binoculars className={iconSize} />;
      default:
        return <CloudAlert className={iconSize} />;
    }
  };

  const getAdapterColor = (type: string) => {
    if(isJobInactive) {
      return 'bg-gray-200 text-gray-500 border-gray-300';
    }
    switch (type) {
      case 'console':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pushover':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const displayAdapters = activeAdapters.slice(0, maxDisplay);
  const remainingCount = activeAdapters.length - maxDisplay;

  return (
    <div className="flex items-center space-x-1">
      {displayAdapters.map((adapter, index) => (
        <div
          key={adapter.id}
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getAdapterColor(adapter.id)}`}
          title={adapter.id}
        >
          {getAdapterIcon(adapter.id)}
          {showLabels && (
            <span className="ml-1 capitalize">{adapter.id}</span>
          )}
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default NotificationIndicators;
