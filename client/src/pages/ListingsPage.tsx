import { Filter, MapPin, Search, SortAsc, SortDesc } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getListings } from '../api';
import ListingsView from '../components/listings/ListingsView';
import MapModal from '../components/listings/MapModal';
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
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalListings, setTotalListings] = useState(0);

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

  const handleMapView = () => {
    setIsMapModalOpen(true);
  };

  return (
    <div className="space-y-6">
<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-400">Property Listings</h1>
    <p className="text-gray-600 dark:text-gray-400 mt-1">
      Explore and filter property listings, with the option to view them on the map.
    </p>
  </div>
  <div className="flex gap-2">  
    <button
      onClick={() => setSortBy('date')}
      className={`px-3 py-1 text-sm rounded-md ${sortBy === 'date' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
    >
      Date
    </button>
    <button
      onClick={() => setSortBy('price')}
      className={`px-3 py-1 text-sm rounded-md ${sortBy === 'price' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
    >
      Price
    </button>
    <button
      onClick={toggleSortOrder}
      className="p-1 bg-gray-100 rounded-md hover:bg-gray-200"
      title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
    >
      {sortOrder === 'asc' ? (
        <SortAsc className="w-5 h-5 text-gray-700" />
      ) : (
        <SortDesc className="w-5 h-5 text-gray-700" />
      )}
    </button>
    <button
      onClick={() => setFilterOpen(!filterOpen)}
      className={`p-1 rounded-md ${filterOpen ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
      title="Filter"
    >
      <Filter className="w-5 h-5" />
    </button>
  </div>
</div>


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

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-dark-input text-light-text dark:text-dark-text"
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {filterOpen && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Min €"
            />
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Max €"
            />
            <input
              type="number"
              id="minRooms"
              name="minRooms"
              value={filters.minRooms}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Min rooms"
            />
            <input
              type="number"
              id="minArea"
              name="minArea"
              value={filters.minArea}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Min m²"
            />
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="City, district..."
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setFilters({
                  minPrice: '',
                  maxPrice: '',
                  minRooms: '',
                  minArea: '',
                  location: '',
                });
                setPage(1);
              }}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ListingsView listings={listings} onMapView={handleMapView} totalListings={totalListings} />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 disabled:invisible"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 disabled:invisible"
          >
            Next
          </button>
        </div>
      )}

      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        listings={listings}
      />
    </div>
  );
};

export default ListingsPage;
