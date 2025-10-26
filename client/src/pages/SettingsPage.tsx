import ErrorInfo from '@/components/common/ErrorInfo';
import HeaderWithAction from '@/components/common/HeaderWithAction';
import { Edit } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getSettings, putSettings } from '../api';

const SettingsPage: React.FC = () => {
  const [queryInterval, setQueryInterval] = useState<number>(60);
  const [port, setPort] = useState<number>(3000);
  const [workingHoursFrom, setWorkingHoursFrom] = useState<string>('09:00');
  const [workingHoursTo, setWorkingHoursTo] = useState<string>('17:00');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

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
    try {
      setIsLoading(true);
      await putSettings({
        queryInterval,
        port,
        workingHoursFrom,
        workingHoursTo,
      });
      toast.success('Settings saved successfully!');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <ErrorInfo error={error} />
  };

  return (
    <div className="space-y-6">

      <HeaderWithAction
        title="Application Settings"
        description="Manage and customize your application configuration"
        actionElement=
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary block w-full sm:w-auto text-center items-center justify-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
        ) : null}
      />

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-8 space-y-6"
      >
        {/* Query Interval */}
        <div>
          <label
            htmlFor="queryInterval"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Query Interval (minutes)
          </label>
          <input
            type="number"
            id="queryInterval"
            value={queryInterval}
            onChange={(e) => setQueryInterval(parseInt(e.target.value, 10) || 0)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
            min="1"
            disabled={!isEditing}
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Set how often to query external services.
          </p>
        </div>

        {/* Port */}
        <div>
          <label
            htmlFor="port"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Application Port
          </label>
          <input
            type="number"
            id="port"
            value={port}
            onChange={(e) => setPort(parseInt(e.target.value, 10) || 0)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
            min="1024"
            max="65535"
            disabled={!isEditing}
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            The port the backend runs on.
          </p>
        </div>

        {/* Working Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Working Hours
          </label>
          <div className="flex space-x-4">
            <div className="flex-1"><label htmlFor="workingHoursFrom" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1" > From </label>
              <input
                id="workingHoursFrom"
                type="time"
                value={workingHoursFrom}
                onChange={(e) => setWorkingHoursFrom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!isEditing}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="workingHoursTo" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1" > To </label>
              <input
                id="workingHoursTo"
                type="time"
                value={workingHoursTo}
                onChange={(e) => setWorkingHoursTo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        {isEditing && (
          <div className="flex justify-end space-x-4 border-t pt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn-primary block w-full sm:w-auto text-center items-center justify-center`}
              disabled={isLoading}
            >
              Save Settings
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SettingsPage;