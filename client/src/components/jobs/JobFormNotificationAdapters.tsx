import { AlertCircle, Edit, Info, Plus, Trash2, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getAvailableNotificationAdapters, sendTestNotification } from '../../api';
import { NotificationAdapter } from '../../types';
import toast from 'react-hot-toast';

interface NotificationAdapterSectionProps {
  preDefinedNotificationAdapters: NotificationAdapter[];
  appendNotificationAdpater: (adapter: NotificationAdapter) => void;
  removeNotificationAdpater: (index: number) => void;
  updateNotificationAdapter: (index: number, adapter: NotificationAdapter) => void;
}

const NotificationAdapterSection: React.FC<NotificationAdapterSectionProps> = ({
  preDefinedNotificationAdapters,
  appendNotificationAdpater,
  removeNotificationAdpater,
  updateNotificationAdapter,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [notificationAdapters, setNotificationAdapters] = useState<NotificationAdapter[]>([]);
  const [selectedAdapter, setSelectedAdapter] = useState<NotificationAdapter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [testingAdapterId, setTestingAdapterId] = useState<string | null>(null);

  useEffect(() => {
    getAvailableNotificationAdapters()
      .then((res) => setNotificationAdapters(res.data || []))
      .catch(() => {
        setError('Failed to load available notification adapters. Please try again later.');
        setNotificationAdapters([]);
      });
  }, []);


  const handleTestAdapter = async (adapter: NotificationAdapter) => {
    if (!adapter) return;
    setTestingAdapterId(adapter.id);

    try {
      const fields: Record<string, any> = {};
      Object.entries(adapter.fields || {}).forEach(([key, field]) => {
        fields[key] = { value: field.value || '' };
      });

      await sendTestNotification(adapter.id, { fields });
      toast.success(`Test notification sent via ${adapter.name}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send test notification');
    } finally {
      setTestingAdapterId(null);
    }
  };

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedAdapter) {
      setError('Please select a notification adapter.');
      return;
    }

    const isAlreadyAdded = preDefinedNotificationAdapters.some(a => a.id === selectedAdapter.id);
    if (isAlreadyAdded && !editMode) {
      setError('Adapter already added.');
      return;
    }

    if (editMode) {
      const index = preDefinedNotificationAdapters.findIndex(a => a.id === selectedAdapter.id);
      if (index !== -1) updateNotificationAdapter(index, selectedAdapter);
    } else {
      appendNotificationAdpater(selectedAdapter);
    }

    setSelectedAdapter(null);
    setShowModal(false);
    setEditMode(false);
    setError(null);
  };

  const handleFieldChange = (key: string, value: string) => {
    if (!selectedAdapter || !selectedAdapter.fields || !selectedAdapter.fields[key]) return;

    setSelectedAdapter({
      ...selectedAdapter,
      fields: {
        ...selectedAdapter.fields,
        [key]: { ...selectedAdapter.fields[key], value },
      },
    });
  };

  const handleEdit = (adapter: NotificationAdapter) => {
    setSelectedAdapter(adapter);
    setEditMode(true);
    setShowModal(true);
  };

  const handleAdapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const adapter = notificationAdapters.find(a => a.id === e.target.value);
    setSelectedAdapter(adapter || null);
    setError(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedAdapter(null);
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 space-y-4">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-3 mb-4">
        Notification Adapters
      </h3>

      <div className="flex items-center space-x-2 text-gray-600 bg-blue-50 dark:bg-gray-800 p-3 rounded-md border border-blue-200 dark:border-gray-600">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <p className="text-sm dark:text-gray-300">
          Notification adapters let you receive updates about job status and results.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Plus className="h-5 w-5" />
        Add Notification Adapter
      </button>

      {preDefinedNotificationAdapters.length === 0 ? (
        <div className="text-gray-500 italic p-4 border border-dashed rounded-md text-center dark:border-gray-600">
          No Notification Adapters configured yet.
        </div>
      ) : (
        <div className="space-y-3">
          {preDefinedNotificationAdapters.map((adapter, index) => {
            const adapterInfo = notificationAdapters.find(a => a.id === adapter.id);
            return (
              <div
                key={index}
                className="flex justify-between items-center dark:text-gray-100 bg-gray-200 dark:bg-gray-800 p-4 rounded-lg border hover:shadow-sm"
              >
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {adapterInfo?.name || adapter.id}
                </span>
                <div className="flex items-center gap-2">
                  {adapterInfo?.fields && (
                    <>
                      {/* Test-Button nutzt dieselbe Logik */}
                      <button
                        type="button"
                        onClick={() => handleTestAdapter(adapter)}
                        disabled={testingAdapterId === adapter.id}
                        className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 transition-colors"
                      >
                        {testingAdapterId === adapter.id ? (
                          <span className="animate-pulse">...</span>
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(adapter)}
                        className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => removeNotificationAdpater(index)}
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
              {editMode ? 'Edit' : 'Add'} Notification Adapter
            </h3>

            <select
              disabled={editMode}
              value={selectedAdapter?.id || ''}
              onChange={handleAdapterChange}
              className="w-full p-2.5 border rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 transition-colors"
            >
              <option value="">-- Select Adapter --</option>
              {notificationAdapters.map(a => {
                const alreadyAdded = preDefinedNotificationAdapters.some(pa => pa.id === a.id);
                return (
                  <option key={a.id} value={a.id} disabled={alreadyAdded && !editMode}>
                    {a.name} {alreadyAdded && !editMode ? '(already added)' : ''}
                  </option>
                );
              })}
            </select>

            {selectedAdapter?.fields &&
              Object.entries(selectedAdapter.fields).map(([key, field]) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label || key}
                  </label>
                  <input
                    type={field.type || 'text'}
                    value={field.value || ''}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    placeholder={field.description}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 p-2.5 transition-colors"
                  />
                </div>
              ))}

            {error && (
              <div className="flex items-center space-x-2 bg-blue-50 dark:bg-gray-800 p-3 rounded-md border border-blue-200 dark:border-gray-600">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>

              {selectedAdapter && (
                <button
                  onClick={() => handleTestAdapter(selectedAdapter)}
                  disabled={testingAdapterId === selectedAdapter.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${
                    testingAdapterId === selectedAdapter.id
                      ? 'bg-green-400 cursor-wait'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <Send className="h-4 w-4" />
                  {testingAdapterId === selectedAdapter.id ? 'Testing...' : 'Test Notification'}
                </button>
              )}

              <button
                onClick={handleAdd}
                disabled={!selectedAdapter}
                className={`px-4 py-2 rounded-md text-white ${
                  !selectedAdapter
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {editMode ? 'Save Changes' : 'Add Adapter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationAdapterSection;
