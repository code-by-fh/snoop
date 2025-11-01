import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAppMeta } from '@/api';
import { AppMeta } from '../types/common';

export interface AppMetaContextType {
  config: AppMeta | null;
  loading: boolean;
  error: string | null;
}

const AppMetaContext = createContext<AppMetaContextType>({
  config: null,
  loading: true,
  error: null
});

export const AppMetaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppMeta = async () => {
      try {
        const { data } = await getAppMeta();
        setConfig(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load configuration.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppMeta();
  }, []);

  return (
    <AppMetaContext.Provider value={{ config, loading, error }}>
      {children}
    </AppMetaContext.Provider>
  );
};

export const useAppMeta = () => useContext(AppMetaContext);
