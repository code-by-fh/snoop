import React, { useEffect, useState } from 'react';
import { getSettings, putSettings } from '../api';

const SettingsPage: React.FC = () => {
  const [queryInterval, setQueryInterval] = useState<number>(60);
  const [port, setPort] = useState<number>(3000);
  const [workingHoursFrom, setWorkingHoursFrom] = useState<string>('09:00');
  const [workingHoursTo, setWorkingHoursTo] = useState<string>('17:00');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await getSettings();
        const settings = response.data;
        setQueryInterval(settings.queryInterval || 60);
        setPort(settings.port || 3000);
        setWorkingHoursFrom(settings.workingHoursFrom || '09:00');
        setWorkingHoursTo(settings.workingHoursTo || '17:00');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await putSettings({
        queryInterval,
        port,
        workingHoursFrom,
        workingHoursTo,
      });
      setSaveStatus('saved');
    } catch (err: any) {
      setSaveStatus('error');
    } finally {
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 mt-4 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and customize your application settings
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-8 space-y-6">

        {/* Query Interval */}
        <div>
          <label htmlFor="queryInterval" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Query Interval (minutes)
          </label>
          <input
            type="number"
            id="queryInterval"
            value={queryInterval}
            onChange={(e) => setQueryInterval(parseInt(e.target.value, 10) || 0)}
            className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text"
            min="1"
          />
          <p className="mt-2 text-sm text-gray-500">Set how often to query external services.</p>
        </div>

        {/* Port */}
        <div>
          <label htmlFor="port" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Application Port
          </label>
          <input
            type="number"
            id="port"
            value={port}
            onChange={(e) => setPort(parseInt(e.target.value, 10) || 0)}
            className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text"
            min="1024"
            max="65535"
          />
          <p className="mt-2 text-sm text-gray-500">The port the backend runs on.</p>
        </div>

        {/* Working Hours */}
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Working Hours</label>
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="time"
                value={workingHoursFrom}
                onChange={(e) => setWorkingHoursFrom(e.target.value)}
                className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text"
              />
              <p className="mt-2 text-sm text-gray-500">From</p>
            </div>
            <div className="flex-1">
              <input
                type="time"
                value={workingHoursTo}
                onChange={(e) => setWorkingHoursTo(e.target.value)}
                className="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text"
              />
              <p className="mt-2 text-sm text-gray-500">To</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4 border-t pt-6">
          {saveStatus === 'saving' && <span className="text-light-primary dark:text-dark-primary text-sm">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-green-500 text-sm">Settings saved!</span>}
          {saveStatus === 'error' && <span className="text-red-500 text-sm">Error saving settings.</span>}
          <button
            onClick={handleSave}
            className={`inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-md text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}`}
            disabled={saveStatus === 'saving'}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
