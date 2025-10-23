import SearchInput from '@/components/common/SearchInput';
import ListingsViewToggle from '@/components/common/ViewToggle';
import ListingsGridView from '@/components/listings/ListingsGridView';
import ListingsListView from '@/components/listings/ListingsListView';
import ListingsMapView from '@/components/listings/ListingsMapView';
import { BarChart3, Filter, Grid3X3, List, Map, Plus, SortAsc, SortDesc, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import { Link } from 'react-router-dom';
import { getListings } from '../api';
import { useViewPreference } from '../hooks/useViewPreference';
import { Listing } from '../types';
import { isAppDarkMode, onAppDarkModeChange } from '@/utils/theme';
import { is } from 'date-fns/locale';

const ListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minRooms: '',
    minArea: '',
    location: '',
    selectedProviders: [],
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalListings, setTotalListings] = useState(0);
  const [viewMode, setViewMode] = useViewPreference('grid', 'listings-view-preference');
  const [providers, setProviders] = useState<{ label: string; value: string }[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<{ label: string; value: string }[]>([]);
  const [multiSelectTheme, setMultiSelectTheme] = useState(isAppDarkMode() ? "dark" : "light");

  useEffect(() => {
    const cleanup = onAppDarkModeChange((dark) => {
      setMultiSelectTheme(dark ? "dark" : "light");
    });
    return cleanup;
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const providerIds = selectedProviders.map((p) => p.value);
        const response = await getListings({
          page,
          limit: 50,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          minRooms: filters.minRooms,
          minArea: filters.minArea,
          location: filters.location,
          sortBy,
          sortOrder,
          searchTerm,
          providerIds: providerIds,
        });
        setListings(response.data.listings);
        setTotalPages(response.data.totalPages);
        setTotalListings(response.data.total);
        if (response.data.providers) {
          const options = response.data.providers.map((p: any) => ({
            label: p.providerName,
            value: p.providerId,
          }));
          setProviders(options);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch listings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, [filters, sortBy, sortOrder, page, searchTerm, selectedProviders]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Property Listings – Showing {totalListings} Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Explore and filter property listings.</p>
        </div>
      </div>

      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 py-2 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-2 items-center">
        <ListingsViewToggle
          localStorageKey="listings-view-preference"
          currentView={viewMode}
          onViewChange={setViewMode}
          viewConfigs={[
            { mode: 'grid', label: 'Grid', icon: Grid3X3, ariaLabel: 'Grid view' },
            { mode: 'list', label: 'List', icon: List, ariaLabel: 'List view' },
            { mode: 'map', label: 'Map', icon: Map, ariaLabel: 'Map view' },
          ]}
        />

        <SearchInput
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setPage(1);
          }}
          placeholder="Search listings..."
        />

        <div className="w-full grid grid-cols-2 gap-2 sm:flex sm:space-x-2 sm:w-auto">
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-2 text-sm rounded-md border text-center flex-1 sm:flex-none ${sortBy === 'date'
              ? 'bg-blue-100 border-blue-300 text-blue-800'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            Date
          </button>

          <button
            onClick={() => setSortBy('price')}
            className={`px-3 py-2 text-sm rounded-md border text-center flex-1 sm:flex-none ${sortBy === 'price'
              ? 'bg-blue-100 border-blue-300 text-blue-800'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            Price
          </button>

          <button
            onClick={toggleSortOrder}
            className="px-3 py-2 text-sm rounded-md border text-center flex-1 sm:flex-none bg-white border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4 inline" /> : <SortDesc className="w-4 h-4 inline" />}
          </button>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`px-3 py-2 text-sm rounded-md border text-center flex-1 sm:flex-none ${filterOpen
              ? 'bg-blue-100 border-blue-300 text-blue-800'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            title="Filter"
          >
            <Filter className="w-4 h-4 inline" />
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min €"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max €"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
            />
            <input
              type="number"
              name="minRooms"
              value={filters.minRooms}
              onChange={handleFilterChange}
              placeholder="Min rooms"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
            />
            <input
              type="number"
              name="minArea"
              value={filters.minArea}
              onChange={handleFilterChange}
              placeholder="Min m²"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
            />
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="City, district..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
            />
            <MultiSelect
              options={providers}
              value={selectedProviders}
              onChange={setSelectedProviders}
              labelledBy="Select Providers"
              hasSelectAll={true}
              className={`${multiSelectTheme} block w-full px-3 mr-0 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm dark:bg-gray-700 dark:text-gray-200`}
              overrideStrings={{
                selectSomeItems: "Select Providers...",
                allItemsAreSelected: "All selected",
                selectAll: "Select All",
                search: "Search",
                clearSelected: "Clear All",
                noOptions: "No options"
              }}
            />
            <button
              onClick={() => setFilters({ minPrice: '', maxPrice: '', minRooms: '', minArea: '', location: '', selectedProviders: [] })}
              className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-600"
              title="Reset Filters"
            >
              <X className="w-4 h-4 mr-1" /> Reset
            </button>
          </div>

        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Listings */}
      {isLoading || listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
          <BarChart3 className="w-12 h-12 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">No Listings available yet</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            You haven’t run any crawl jobs yet. Start by creating a new one to collect listings and see your analytics here.
          </p>
          <Link
            to="/jobs/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Crawl Job
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {viewMode === 'grid' && <ListingsGridView listings={listings} />}
          {viewMode === 'list' && <ListingsListView listings={listings} />}
          {viewMode === 'map' && <ListingsMapView listings={listings} />}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 disabled:invisible"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700 dark:text-gray-200">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 disabled:invisible"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
