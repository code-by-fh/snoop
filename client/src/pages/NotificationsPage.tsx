import React, { useEffect, useState } from 'react';
import { getAvailableNotificationAdapters, sendTestNotification } from '../api';
import { NotificationAdapter, AdapterFieldConfig } from '../types';
import { AlertCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationsPage: React.FC = () => {
  const [notificationAdapters, setNotificationAdapters] = useState<NotificationAdapter[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingAdapterId, setLoadingAdapterId] = useState<string | null>(null);

  useEffect(() => {
    getAvailableNotificationAdapters()
      .then(res => setNotificationAdapters(res.data || []))
      .catch(() => setError('Failed to load notification adapters.'));
  }, []);

  const handleFieldChange = (adapterId: string, fieldKey: string, value: string) => {
    setNotificationAdapters(prev =>
      prev.map(adapter => {
        if (adapter.id !== adapterId || !adapter.fields) return adapter;

        const updatedField: AdapterFieldConfig = {
          ...adapter.fields[fieldKey],
          value,
        };

        return {
          ...adapter,
          fields: {
            ...adapter.fields,
            [fieldKey]: updatedField,
          },
        };
      })
    );
  };

  const handleSendTest = async (adapter: NotificationAdapter) => {
    setLoadingAdapterId(adapter.id);
    try {
      const fields: Record<string, string> = {};
      if (adapter.fields) {
        Object.entries(adapter.fields).forEach(([key, field]) => {
          fields[key] = field.value || '';
        });
      }

      await sendTestNotification(adapter.id, fields);
      toast.success(`Test notification sent via ${adapter.name}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send test notification');
    } finally {
      setLoadingAdapterId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Notification Adapters
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and test your notification channels.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/30 p-3 rounded-md border border-red-300 dark:border-red-700">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notificationAdapters.map(adapter => (
          <div
            key={adapter.id}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm flex flex-col gap-3"
          >
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{adapter.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{adapter.description}</p>

            {adapter.fields &&
              Object.entries(adapter.fields).map(([key, field]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {field.label || key}
                  </span>
                  <input
                    type={field.type || 'text'}
                    value={field.value || ''}
                    placeholder={field.description || ''}
                    onChange={(e) => handleFieldChange(adapter.id, key, e.target.value)}
                    className="mt-1 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              ))}

            <button
              onClick={() => handleSendTest(adapter)}
              disabled={loadingAdapterId === adapter.id}
              className="mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-70"
            >
              <Send className="h-4 w-4" />
              {loadingAdapterId === adapter.id ? 'Sending...' : 'Send Test Notification'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
