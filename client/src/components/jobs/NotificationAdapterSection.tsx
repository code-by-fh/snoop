import { AlertCircle, Edit, Info, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getAvailableNotificationAdapters } from '../../api';
import { NotificationAdapter } from '../../types';

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
  updateNotificationAdapter
}) => {
  const [showModal, setShowModal] = useState(false);
  const [notificationAdapters, setNotificationAdapters] = useState<NotificationAdapter[]>([]);
  const [selectedAdapter, setSelectedAdapter] = useState<NotificationAdapter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getAvailableNotificationAdapters()
      .then((res) => setNotificationAdapters(res.data || []))
      .catch(() => {
        setError('Failed to load available notification adapters. Please try again later.');
        setNotificationAdapters([]);
      });
  }, []);


  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdapter) {
      setError('Please select a notification adapter to add.');
      return;
    }

    const isAlreadyAdded = preDefinedNotificationAdapters.some((a) => a.id === selectedAdapter?.id);
    if (isAlreadyAdded && !editMode) {
      setError('Notification adapter is already added.');
      return;
    }

    const fields = selectedAdapter.fields;
    if (fields && Object.values(fields).some(field => !field.value || field.value.trim() === '')) {
      setError('All required fields must be filled before adding the adapter.');
      return;
    }

    if (editMode) {
      const index = preDefinedNotificationAdapters.findIndex(a => a.id === selectedAdapter.id);
      if (index !== -1) {
        updateNotificationAdapter(index, selectedAdapter);
        setSelectedAdapter(null);
        setShowModal(false);
        setEditMode(false);
      }
    } else {
      appendNotificationAdpater(selectedAdapter);
    }

    setSelectedAdapter(null);
    setShowModal(false);
    setEditMode(false);
  };

  const handleFieldChange = (key: string, value: string) => {
    console.log(`Field changed: ${key} = ${value}`);
    setError(null);

    if (!selectedAdapter) {
      setError('Please select an adapter first.');
      return;
    }
    if (!selectedAdapter.fields || !selectedAdapter.fields[key]) {
      setError(`Field "${key}" does not exist in the selected adapter.`);
      return;
    }

    setSelectedAdapter((prev) => {
      if (!prev) return null;

      const existingField = prev.fields?.[key];
      if (!existingField) return prev;

      return {
        ...prev,
        fields: {
          ...prev.fields,
          [key]: {
            ...existingField,
            value,
          },
        },
      };
    });
  };


  const handleEdit = (selectedAdapter: NotificationAdapter) => {
    setSelectedAdapter(selectedAdapter);
    setEditMode(true);
    setShowModal(true);
  };

  const handleAdapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const adapterId = e.target.value;
    console.log('Selected adapter ID:', adapterId);
    const adapter = notificationAdapters.find((a) => a.id === adapterId);
    console.log('Selected adapter:', adapter);
    setSelectedAdapter(adapter || null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditMode(false);
  };


  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">Notification Adapters</h3>

      <div className="flex items-center space-x-2 text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200 dark:bg-gray-300">
        <Info className="h-5 w-5 text-blue-600 " />
        <p className="text-sm">Notification adapters help you receive updates about job status and results.</p>
      </div>

      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="btn-primary w-full"
      >
        <Plus className="mr-3 h-5 w-5" />
        Add Notification Adapter
      </button>

      {preDefinedNotificationAdapters.length === 0 ? (
        <div className="text-gray-500 italic p-4 border border-dashed rounded-md text-center">
          No Notification Adapters configured yet.
        </div>
      ) : (
        <div className="space-y-3">
          {
            preDefinedNotificationAdapters.map((adapter, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border hover:shadow-sm">
                <span className="font-bold text-lg text-gray-900">{notificationAdapters.find(a => a.id === adapter.id)?.name}</span>
                <div className="flex space-x-2">
                  {notificationAdapters.find(a => a.id === adapter.id)?.fields && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(adapter);
                      }}
                      className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeNotificationAdpater(index);
                    }}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative p-6 bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto dark:bg-gray-700">
            <h3 className="text-2xl font-bold text-center mb-4">{editMode ? 'Edit' : 'Add'} Notification Adapter</h3>

            <div className="space-y-4">
              <select
                disabled={editMode}
                className="w-full p-2.5 border rounded-md text-sm dark:text-dark-input"
                value={selectedAdapter?.id}
                onChange={handleAdapterChange}
              >
                <option value="">-- Select Adapter Type --</option>
                {notificationAdapters.map((a) => {
                  const isAlreadyAdded = preDefinedNotificationAdapters.some((added) => added.id === a.id);
                  return (
                    <option key={a.id} value={a.id} disabled={isAlreadyAdded}>
                      {a.name} {isAlreadyAdded ? '(already added)' : ''}
                    </option>
                  );
                })}
              </select>

              {selectedAdapter?.readme && (
                <div className="flex items-center space-x-2 text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">
                  <div
                    className="mt-2 p-4 text-black dark:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: selectedAdapter.readme }}
                  />
                </div>
              )}

              {selectedAdapter?.fields &&
                <>
                  {Object.entries(selectedAdapter.fields).map(([key, field]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label || key}
                      </label>
                      <input
                        type={field.type || 'text'}
                        value={field.value || ''}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        placeholder={field.description}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
                      />
                    </div>
                  ))}
                </>

              }
            </div>


            {error &&
              <div className="flex items-center space-x-2 text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            }
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={handleModalClose} className="py-2 px-4 border border-gray-300 rounded-md">
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!selectedAdapter || (!editMode && preDefinedNotificationAdapters.some((a) => a.id === selectedAdapter.id))}
                className={`py-2 px-4 rounded-md text-white ${!selectedAdapter || (!editMode && preDefinedNotificationAdapters.some((a) => a.id === selectedAdapter.id))
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
