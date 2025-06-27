import { useEffect, useState } from 'react';
import { ListingsViewMode } from '../components/listings/ListingsViewToggle';

export const useListingsViewPreference = (defaultView: ListingsViewMode = 'grid') => {
  const [viewMode, setViewMode] = useState<ListingsViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('listingsViewPreference');
      return (saved as ListingsViewMode) || defaultView;
    }
    return defaultView;
  });

  useEffect(() => {
    localStorage.setItem('listingsViewPreference', viewMode);
  }, [viewMode]);

  return [viewMode, setViewMode] as const;
};
