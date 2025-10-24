import { useFavorite } from '@/hooks/useFavorite';
import { formatDate, formatPrice } from '@/utils/formatters';
import { Calendar, Home, MapPin, Star, StarOff } from 'lucide-react';
import React from 'react';
import { Listing } from '../../types';

interface ListingsListViewProps {
  listings: Listing[];
}

const ListingsListView: React.FC<ListingsListViewProps> = ({ listings }) => {
  return (
    <div className="space-y-4">
      {listings.map((listing) => {
        const { favorited, toggleFavorite, loading } = useFavorite(listing.isFavorite || false);

        return (
          <div
            key={listing.id}
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
          >
            <button
              onClick={() => toggleFavorite(listing.id)}
              disabled={loading}
              className={`absolute top-2 left-2 p-2 rounded-full shadow-md z-10 transition
                ${favorited
                  ? 'bg-yellow-400 text-black hover:bg-yellow-500 dark:bg-yellow-400 dark:hover:bg-yellow-500'
                  : 'bg-white text-gray-400 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
              `}
            >
              {favorited ? <Star className="w-5 h-5" /> : <StarOff className="w-5 h-5" />}
            </button>

            <div className="flex flex-col sm:flex-row">
              <div className="flex-shrink-0 w-full sm:w-60 h-48 sm:h-auto">
                {listing.imageUrl ? (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-t-none"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-t-xl sm:rounded-l-xl sm:rounded-t-none">
                    <Home className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
                      {listing.title}
                    </h3>

                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="text-sm truncate">
                        {[listing.location?.street, listing.location?.city].filter(Boolean).join(', ') || 'No location'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {listing.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Home className="w-4 h-4 mr-1" />
                        <span>{listing.size} m²</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">🛏️</span>
                        <span>{listing.rooms} rooms</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Added {formatDate(listing.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start sm:ml-6 mt-4 sm:mt-0">
                    <div className="mb-2 sm:mb-4">
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        {typeof listing.price === 'number'
                          ? formatPrice(listing.price)
                          : 'Price on request'}
                      </span>
                    </div>

                    <a
                      href={listing.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListingsListView;
