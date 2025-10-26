import ErrorInfo from '@/components/common/ErrorInfo';
import HeaderWithAction from '@/components/common/HeaderWithAction';
import LoadingPlaceholder from '@/components/common/LoadingPlaceholder';
import NoContentInfo from '@/components/common/NoContentInfo';
import SearchInput from '@/components/common/SearchInput';
import ListingsViewToggle from '@/components/common/ViewToggle';
import ListingsGridView from '@/components/listings/ListingsGridView';
import ListingsListView from '@/components/listings/ListingsListView';
import ListingsMapView from '@/components/listings/ListingsMapView';
import { isAppDarkMode, onAppDarkModeChange } from '@/utils/theme';
import { Eye, EyeOff, Filter, Grid3X3, List, Map, SortAsc, SortDesc, Star, StarOff, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import { getListings } from '../api';
import { useViewPreference } from '../hooks/useViewPreference';
import { Listing } from '../types';

const ListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minRooms: '',
    minArea: '',
    location: '',
    showFavorites: 'all' as 'all' | 'favorites' | 'nonfavorites',
    sortBy: 'date',
    sortOrder: 'desc',
    searchTerm: '',
    viewState: 'all'
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
        const response = await getListings({
          page,
          limit: 50,
          ...filters,
          providerIds: selectedProviders.map(p => p.value),
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
  }, [filters, page, selectedProviders]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1);
  };

  if (error) {
    return <ErrorInfo error={error} />
  }

  if (isLoading) {
    return <LoadingPlaceholder title='Loading Listings...' />
  }

  if (listings.length === 0) {
    return <NoContentInfo />
  }

  return (
    <div className="space-y-6">

      <HeaderWithAction title={`Property Listings – Showing ${totalListings} Results`} description="Explore and filter property listings." />

      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 py-2 border-b border-gray-200 dark:border-gray-700 flex flex-col xl:flex-row gap-2 items-center">
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
          value={filters.searchTerm}
          onChange={(val) => setFilters({ ...filters, searchTerm: val })}
          placeholder="Search listings..."
        />

        <div className="grid grid-cols-2 xl:flex xl:flex-row gap-2 w-full xl:w-auto rounded-md border border-gray-300  bg-white dark:bg-gray-800 p-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  viewState: prev.viewState === 'viewed' ? 'all' : 'viewed',
                }))
              }
              className={`flex-1 xl:flex-none inline-flex items-center justify-center gap-2 rounded-md px-2 xl:px-3 sm:py-1 py-2 text-xs sm:text-sm font-medium transition-all
    ${filters.viewState === 'viewed'
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              title={filters.viewState === 'viewed' ? 'Showing viewed listings' : 'Show only viewed listings'}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  viewState: prev.viewState === 'unviewed' ? 'all' : 'unviewed',
                }))
              }
              className={`flex-1 xl:flex-none inline-flex items-center justify-center gap-2 rounded-md px-2 xl:px-3 sm:py-1 py-2 text-xs sm:text-sm font-medium transition-all
    ${filters.viewState === 'unviewed'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              title="Show only unviewed listings"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  showFavorites: prev.showFavorites === 'favorites' ? 'all' : 'favorites',
                }))
              }
              className={`flex-1 xl:flex-none inline-flex items-center justify-center gap-2 rounded-md px-2 xl:px-3 sm:py-1 py-2 text-xs sm:text-sm font-medium transition-all
      ${filters.showFavorites === 'favorites'
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              title={filters.showFavorites === 'favorites' ? 'Showing favorites' : 'Show only favorites'}
            >
              <Star className="w-4 h-4" />
            </button>

            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  showFavorites: prev.showFavorites === 'nonfavorites' ? 'all' : 'nonfavorites',
                }))
              }
              className={`flex-1 xl:flex-none inline-flex items-center justify-center gap-2 rounded-md px-2 xl:px-3 sm:py-1 py-2 text-xs sm:text-sm font-medium transition-all
      ${filters.showFavorites === 'nonfavorites'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              title={filters.showFavorites === 'nonfavorites' ? 'Showing non-favorites' : 'Show only non-favorites'}
            >
              <StarOff className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setFilters({ ...filters, sortBy: 'date' })}
            className={`flex-1 xl:flex-none inline-flex items-center justify-center rounded-md px-2 xl:px-3 sm:py-1 py-2 text-xs sm:text-sm font-medium transition-all
      ${filters.sortBy === 'date'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            Date
          </button>

          <button
            onClick={() => setFilters({ ...filters, sortBy: 'price' })}
            className={`flex-1 xl:flex-none inline-flex items-center justify-center rounded-md px-2 xl:px-3 sm:py-1 py-2 text-xs sm:text-sm font-medium transition-all
      ${filters.sortBy === 'price'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            Price
          </button>

          <button
            onClick={() =>
              setFilters({ ...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })
            }
            className="flex-1 xl:flex-none inline-flex items-center justify-center rounded-md px-2 xl:px-3 sm:py-1 py-2 text-xs sm:text-sm font-medium transition-all
      text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {filters.sortOrder === 'asc' ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex-1 xl:flex-none inline-flex items-center justify-center rounded-md px-2 xl:px-3 sm:py-1 py-2 text-xs sm:text-sm font-medium transition-all
      ${filterOpen
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            title="Filter"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {filterOpen && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700 space-y-4">
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
                className={`${multiSelectTheme} block w-full px-3 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm dark:bg-gray-700 dark:text-gray-200`}
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
                onClick={() => {
                  setFilters({
                    minPrice: '',
                    maxPrice: '',
                    minRooms: '',
                    minArea: '',
                    location: '',
                    showFavorites: 'all',
                    sortBy: 'date',
                    sortOrder: 'desc',
                    searchTerm: '',
                    viewState: 'all'
                  });
                  setSelectedProviders([]);
                  setPage(1);
                }}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900
             dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white
             transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Reset Filters"
              >
                <X className="w-4 h-4 mr-2" />
                Reset
              </button>

            </div>

          </div>
        )}
      </div>


      <div className="space-y-6">
        {viewMode === 'grid' && <ListingsGridView listings={listings} />}
        {viewMode === 'list' && <ListingsListView listings={listings} />}
        {viewMode === 'map' && <ListingsMapView listings={listings} />}
      </div>


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
