import { useEffect, useState } from 'react';
import { ViewMode } from '../components/jobs/ViewToggle';

const VIEW_PREFERENCE_KEY = 'jobs-view-preference';

export const useViewPreference = (defaultView: ViewMode = 'grid') => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(VIEW_PREFERENCE_KEY);
      return (saved as ViewMode) || defaultView;
    } catch {
      return defaultView;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_PREFERENCE_KEY, viewMode);
    } catch (error) {
      console.warn('Failed to save view preference to localStorage:', error);
    }
  }, [viewMode]);

  return [viewMode, setViewMode] as const;
};
