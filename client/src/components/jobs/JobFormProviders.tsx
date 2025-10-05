import { Globe, Plus, Trash2,Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getProviders } from '../../api';
import { Provider } from '../../types';

interface ProviderSectionProps {
  providers: Provider[];
  onAddProvider: (provider: Provider) => void;
  onRemoveProvider: (index: number) => void;
}

const ProviderSection: React.FC<ProviderSectionProps> = ({
  providers,
  onAddProvider,
  onRemoveProvider,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [availableProviders, setAvailableProviders] = useState<Provider[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProviders()
      .then((res) => setAvailableProviders(res.data || []))
      .catch(() => {
        setError('Failed to load available providers. Please try again later.');
        setAvailableProviders([]);
      });
  }, []);

  const handleAddProvider = () => {
    if (!selectedProvider || !selectedProvider.url) {
      setError('Please select a provider and enter a valid URL.');
      return;
    }
    onAddProvider(selectedProvider);
    setError(null);
    setShowModal(false);
  };

  const handleProviderOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setError(null);
    const selected = availableProviders.find(p => p.id === e.target.value);
    setSelectedProvider(selected || null);
  };

  const handleProviderUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!selectedProvider) {
      setError(`Please select a provider first.`);
      return;
    }

    setSelectedProvider({ ...selectedProvider, url: e.target.value });

    if (!e.target.value || !e.target.value.startsWith(selectedProvider.baseUrl)) {
      setError(`The URL must start with the provider base URL: ${selectedProvider.baseUrl}`);
      return;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 space-y-4">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-3 mb-4">Provider Configuration</h3>
      <div className="flex items-center space-x-2 text-gray-600 bg-blue-50 dark:bg-gray-800 p-3 rounded-md border border-blue-200 dark:border-gray-600">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <p className="text-sm dark:text-gray-300">
          You can add multiple providers to diversify your data sources. Make sure to configure each provider with a valid URL.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="btn-primary w-full"
      >
        <Plus className="mr-3 h-5 w-5" />
        Add Provider
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {providers.length === 0 ? (
        <div className="text-gray-500 italic p-4 border border-dashed rounded-md text-center">
          No Providers configured yet.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Configured Providers</h4>
          {providers.map((provider, index) => (
            <div
              key={index}
              className="flex justify-between items-center dark:text-gray-100 bg-gray-200 dark:bg-gray-800 p-4 rounded-lg border hover:shadow-sm"
            >
              <div className="flex-grow">
                <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">{availableProviders.find(p => p.id === provider.id)?.name}</span>
              </div>
              <a
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors"
                title="Visit Provider"
              >
                <Globe className="h-5 w-5" />
              </a>
              <button
                type="button"
                onClick={() => onRemoveProvider(index)}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 dark:bg-gray-700 ">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Configure Provider</h3>
            <div className="space-y-5">
              <div>
                <label htmlFor="modalProviderName" className="block text-sm font-medium text-gray-700 mb-1 dark:text-dark-text">
                  Select Provider
                </label>
                <select
                  id="modalProviderName"
                  value={selectedProvider?.id}
                  onChange={handleProviderOnChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5 dark:text-dark-input"
                >
                  <option value="">-- Select a provider --</option>
                  {availableProviders.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {selectedProvider?.name && (
                  <a
                    href={selectedProvider?.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center mt-4 px-6 py-3 text-base font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    🌐 Open Webseite
                  </a>
                )}
              </div>

              <div>
                <label htmlFor="modalProviderUrl" className="block text-sm font-medium text-gray-700 mb-1 dark:text-dark-text">
                  Provider URL
                </label>
                <input
                  id="modalProviderUrl"
                  value={selectedProvider?.url || ''}
                  disabled={!selectedProvider}
                  type="url"
                  onChange={handleProviderUrlChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5"
                  placeholder="https://example.com"
                />
                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="py-2.5 px-5 border border-gray-300 text-base rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddProvider}
                disabled={!selectedProvider || !selectedProvider?.url || error !== null}
                className={`px-4 py-2 text-base rounded-md text-white ${!selectedProvider?.name || !selectedProvider?.url || error !== null
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'btn-primary'
                  }`}
              >
                Add Provider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderSection;
