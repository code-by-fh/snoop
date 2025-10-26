import { useFavorite } from '@/hooks/useFavorite';
import { formatDate, formatPrice } from '@/utils/formatters';
import { Calendar, Home, MapPin, X } from 'lucide-react';
import React from 'react';
import { Listing } from '../../types';
import FavoriteButton from '../common/FavoriteButton';
import ViewDetailsButton from '../common/ViewDetailsButton';
import ViewedButton from '../common/ViewedButton';
import DeleteButton from '../common/DeleteButton';

interface ListingsListViewProps {
  listings: Listing[];
  openActionModal: (listing: Listing) => void;
}

const ListingsListView: React.FC<ListingsListViewProps> = ({ listings, openActionModal }) => {
  return (
    <div className="space-y-6">
      {listings.map((listing) => {
        const { favorited, toggleFavorite, loading } = useFavorite(listing.isFavorite || false);

        return (
          <div
            key={listing.id}
            className="relative flex flex-col sm:flex-row bg-white dark:bg-gray-800 rounded-xl shadow-md border overflow-hidden transition-transform hover:scale-[1.01]"
          >
            <FavoriteButton
              isFavorite={favorited}
              onToggle={() => toggleFavorite(listing.id)}
              loading={loading}
              className="absolute top-2 left-2"
            />

            <ViewedButton viewed={listing.viewed || false} listingId={listing.id} className="absolute top-2 left-[200px]" />

            {/* Image */}
            <div className="flex-shrink-0 w-full sm:w-64 h-48 sm:h-auto">
              {listing.imageUrl ? (
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-t-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-t-xl sm:rounded-l-xl sm:rounded-t-none">
                  <Home className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
              {/* Title & Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
                  {listing.title}
                </h3>

                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm truncate">{listing.location?.fullAddress || 'No location'}</span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                  {listing.description}
                </p>

                {/* Info Row */}
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span>{listing.size} m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🛏️</span>
                    <span>{listing.rooms} rooms</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Added {formatDate(listing.createdAt)}</span>
                  </div>
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 text-center sm:text-left">
                  {typeof listing.price === 'number' ? formatPrice(listing.price) : 'Price on request'}
                </div>
              </div>

              {/* Action Row */}
              <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3">
                <DeleteButton onDelete={() => openActionModal(listing)} />
                <ViewDetailsButton url={listing.trackingUrl} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListingsListView;
