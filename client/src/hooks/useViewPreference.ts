import { useEffect, useState } from 'react';
import { ViewMode } from '../components/common/ViewToggle';

export const useViewPreference = (defaultView: ViewMode = 'grid', localStorageKey: string) => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(localStorageKey);
      return (saved as ViewMode) || defaultView;
    }
    return defaultView;
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, viewMode);
  }, [viewMode]);

  return [viewMode, setViewMode] as const;
};
