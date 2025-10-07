import { AlertCircle, Info, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../types';
import BlacklistSection from './JobFormBlacklist';
import NotificationAdapterSection from './JobFormNotificationAdapters';
import ProviderSection from './JobFormProviders';
import JobToggleSwitch from './JobToggleSwitch';

interface JobFormProps {
  onSubmit: (data: Job) => void;
  isLoading: boolean;
  error: string | null;
  initialData?: Job;
}

const JobForm: React.FC<JobFormProps> = ({ onSubmit, isLoading, error, initialData }) => {
  const [blacklistTerms, setBlacklistTerms] = useState(initialData?.blacklistTerms || []);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<Job>({
    mode: 'onChange',
    defaultValues: initialData || {
      name: '',
      blacklistTerms: [],
      providers: [],
      notificationAdapters: [],
      isActive: false,
    },
  });

  const { fields: providers, append: appendProvider, remove: removeProvider } = useFieldArray({
    control,
    name: 'providers',
    keyName: 'uuid'
  });

  const {
    fields: notificationAdapters,
    append: appendNotificationAdapter,
    remove: removeNotificationAdapter,
    update: updateNotificationAdapter,
  } = useFieldArray({
    control,
    name: 'notificationAdapters',
    keyName: 'uuid'
  });

  const handleFormSubmit = (data: Job) => {
    toast('Job saved...Let\'s go!', { icon: '💾' });
    onSubmit({ ...data, blacklistTerms });
  };

  useEffect(() => {
    setValue('providers', initialData?.providers || []);
  }, [initialData, setValue]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Error Banner */}
        {error && (
          <div className="flex items-center space-x-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Job Name */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-3 mb-4">Job Name</h3>
          <div className="flex items-center space-x-2 text-gray-600 bg-blue-50 dark:bg-gray-800 p-3 rounded-md border border-blue-200 dark:border-gray-600">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm dark:text-gray-300">
              Provide a descriptive name for your job to easily identify it later.
            </p>
          </div>
          <input
            id="name"
            type="text"
            {...register('name', {
              required: 'Job name is required',
              maxLength: { value: 100, message: 'Max 100 characters' },
            })}
            placeholder="e.g., Daily Job Scrape"
            className={`flex justify-between w-full items-center font-bold dark:text-gray-100 bg-white dark:bg-gray-800 p-4 rounded-lg border hover:shadow-sm`}
          />
          {errors.name && (
            <p className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>


        {/* Providers Section */}
        <ProviderSection
          providers={providers}
          onAddProvider={appendProvider}
          onRemoveProvider={removeProvider}
        />

        {/* Notification Adapters */}
        <NotificationAdapterSection
          preDefinedNotificationAdapters={notificationAdapters}
          appendNotificationAdpater={appendNotificationAdapter}
          removeNotificationAdpater={removeNotificationAdapter}
          updateNotificationAdapter={updateNotificationAdapter}
        />

        {/* Blacklist Section */}
        <BlacklistSection blacklistTerms={blacklistTerms} onUpdateBlacklist={setBlacklistTerms} />

        {/* Active Toggle */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200 space-y-4">
          <Controller
            name="isActive"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex items-center">
                <JobToggleSwitch
                  jobId="new-job-toggle"
                  isActive={value}
                  onToggleActive={(_, newValue) => onChange(newValue)}
                  size="md"
                />
                <span className="ml-3 font-medium text-gray-900 dark:text-gray-100">
                  {value ? 'Job Active' : 'Job Inactive'}
                </span>
              </div>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 dark:bg-gray-400 dark:text-gray-900 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => navigate(-1)}
          >
            <X className="h-4 w-4 mr-2" /> Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading || !isValid || providers.length === 0 || notificationAdapters.length === 0}
            className={`inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-md text-white shadow ${isLoading || !isValid || providers.length === 0 || notificationAdapters.length === 0
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
              }`}
          >
            {isLoading ? 'Saving...' : 'Save Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
