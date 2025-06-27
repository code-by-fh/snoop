import { AlertCircle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../types';
import BlacklistSection from './BlacklistSection';
import NotificationAdapterSection from './NotificationAdapterSection';
import ProviderSection from './ProviderSection';

interface JobFormProps {
  onSubmit: (data: Job) => void;
  isLoading: boolean;
  error: string | null;
  initialData?: Job;
}

const JobForm: React.FC<JobFormProps> = ({ onSubmit, isLoading, error, initialData }) => {
  const [blacklistTerms, setBlacklistTerms] = useState(initialData?.blacklistTerms || []);
  const navigate = useNavigate();

  console.log('JobForm initialData:', initialData);

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
    onSubmit({ ...data, blacklistTerms });
  };

  useEffect(() => {
    setValue('providers', initialData?.providers || []);
  }, [initialData, setValue]);

  console.log('JobForm notificationAdapters:', notificationAdapters);
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10 p-8 bg-white rounded-2xl shadow-xl max-w-4xl mx-auto dark:bg-gray-800">
      {error && (
        <div className="flex items-center space-x-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-md">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-4 p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
        <label htmlFor="name" className="text-2xl font-bold text-gray-900 pb-3 mb-4">Job Name</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Job name is required', maxLength: { value: 100, message: 'Max 100 chars' } })}
          className={`mt-1 block w-full rounded-md p-3 border dark:bg-gray-800 ${errors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-blue-200 sm:text-sm`}
          placeholder="e.g., Daily News Scrape"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <ProviderSection
        providers={providers}
        onAddProvider={(provider) => appendProvider(provider)}
        onRemoveProvider={(index) => removeProvider(index)}
      />
      <NotificationAdapterSection
        preDefinedNotificationAdapters={notificationAdapters}
        appendNotificationAdpater={appendNotificationAdapter}
        removeNotificationAdpater={removeNotificationAdapter}
        updateNotificationAdapter={updateNotificationAdapter}
      />

      <BlacklistSection blacklistTerms={blacklistTerms} onUpdateBlacklist={setBlacklistTerms} />


      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-lg dark:bg-gray-700">
        <Controller
          name="isActive"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => onChange(!value)}
                className={`relative inline-flex h-7 w-12 rounded-full border-2 transition  ${value ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow  ${value ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className="ml-3 text-base font-medium text-gray-900">{value ? 'Job Active' : 'Job Inactive'}</span>
            </div>
          )}
        />
      </div>

      <div className="flex justify-end space-x-4 border-t pt-6">
        <button type="button" className="btn-cancel"
          onClick={() => navigate(-1)}>
          <X className="h-4 w-4 mr-2" /> Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !isValid || providers.length === 0 || notificationAdapters.length === 0}
          className={`inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-md text-white ${isLoading || !isValid || providers.length === 0 || notificationAdapters.length === 0 ? 'bg-blue-400 cursor-not-allowed' : 'btn-primary'}`}
        >
          {isLoading ? 'Saving...' : 'Save Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
