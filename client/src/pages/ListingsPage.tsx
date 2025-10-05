import SearchInput from '@/components/common/SearchInput';
import ListingsViewToggle from '@/components/common/ViewToggle';
import ListingsGridView from '@/components/listings/ListingsGridView';
import ListingsListView from '@/components/listings/ListingsListView';
import ListingsMapView from '@/components/listings/ListingsMapView';
import { Filter, Grid3X3, List, Map, SortAsc, SortDesc, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getListings } from '../api';
import { useViewPreference } from '../hooks/useViewPreference';
import { Listing } from '../types';

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
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalListings, setTotalListings] = useState(0);
  const [viewMode, setViewMode] = useViewPreference('grid', 'listings-view-preference');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const response = await getListings({
          page,
          limit: 12,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          minRooms: filters.minRooms,
          minArea: filters.minArea,
          location: filters.location,
          sortBy,
          sortOrder,
          searchTerm: searchTerm,
        });
        setListings(response.data.listings);
        setTotalPages(response.data.totalPages);
        setTotalListings(response.data.total);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [filters, sortBy, sortOrder, page, searchTerm]);

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
      {/* Header + Search + Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Property Listings - Showing {totalListings} Results</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Explore and filter property listings, with the option to view them on the map.
          </p>
        </div>
      </div>

      {/* Search + Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 items-center">

        <ListingsViewToggle
          localStorageKey="listings-view-preference"
          currentView={viewMode}
          onViewChange={setViewMode}
          viewConfigs={[
            { mode: 'grid', label: 'Grid', icon: Grid3X3, ariaLabel: 'Grid view' },
            { mode: 'list', label: 'List', icon: List, ariaLabel: 'List view' },
            { mode: 'map', label: 'View on Map', icon: Map, ariaLabel: 'View on map' },
          ]}
        />

        <SearchInput
          value={searchTerm}
          onChange={(val) => { setSearchTerm(val); setPage(1); }}
          placeholder="Search listings..."
        />

        {/* Filter/Sort Buttons */}
        <div className="w-full grid grid-cols-2 gap-2 sm:flex sm:space-x-2 sm:w-auto">
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-2 text-sm rounded-md border text-center 
      flex-1 sm:flex-none
      ${sortBy === 'date'
                ? 'bg-blue-100 border-blue-300 text-blue-800'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            Date
          </button>

          <button
            onClick={() => setSortBy('price')}
            className={`px-3 py-2 text-sm rounded-md border text-center 
      flex-1 sm:flex-none
      ${sortBy === 'price'
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
            className={`px-3 py-2 text-sm rounded-md border text-center 
      flex-1 sm:flex-none
      ${filterOpen
                ? 'bg-blue-100 border-blue-300 text-blue-800'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            title="Filter"
          >
            <Filter className="w-4 h-4 inline" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {filterOpen && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
              placeholder="Min €"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
              placeholder="Max €"
            />
            <input
              type="number"
              name="minRooms"
              value={filters.minRooms}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
              placeholder="Min rooms"
            />
            <input
              type="number"
              name="minArea"
              value={filters.minArea}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
              placeholder="Min m²"
            />
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
              placeholder="City, district..."
            />
            <button
              onClick={() =>
                setFilters({ minPrice: '', maxPrice: '', minRooms: '', minArea: '', location: '' })
              }
              className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-600 focus:outline-none transition"
              title="Reset Filters"
            >
              <X className="w-4 h-4 mr-1" />
              Reset
            </button>
          </div>
        </div>

      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Listings */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
          <span className="px-4 py-2 text-gray-700 dark:text-gray-200">Page {page} of {totalPages}</span>
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
