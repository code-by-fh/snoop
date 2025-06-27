import { format } from 'date-fns';
import { Calendar, DollarSign, ExternalLink, Home, MapPin } from 'lucide-react';
import React from 'react';
import { Listing } from '../../types';

interface ListingsListViewProps {
  listings: Listing[];
}

const ListingsListView: React.FC<ListingsListViewProps> = ({ listings }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow dark:bg-gray-700 dark:border-gray-700 dark:hover:shadow-lg dark:text-light-text"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="flex-shrink-0 w-full sm:w-60 sm:h-50 h-50">
              {listing.imageUrl ? (
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-t-lg sm:rounded-l-lg sm:rounded-t-none">
                  <Home className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>


            <div className="flex-1 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 pr-4">
                      {listing.title}
                    </h3>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="text-sm">
                      {[listing.location?.street, listing.location?.city].filter(Boolean).join(', ') || 'No location'}
                    </span>                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {listing.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Home className="w-4 h-4 mr-1" />
                      <span>{listing.size} m²</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-1 text-center">🛏️</span>
                      <span>{listing.rooms} rooms</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Added {formatDate(listing.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start sm:ml-6">
                  <div className="flex items-center mb-0 sm:mb-4">
                    <span className="text-xl font-bold text-green-600">
                      {typeof listing.price === 'number' ? formatPrice(listing.price) : 'Price on request'}
                    </span>
                  </div>

                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingsListView;
