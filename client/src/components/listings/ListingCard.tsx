import { useFavorite } from '@/hooks/useFavorite';
import { formatDate, formatPrice } from '@/utils/formatters';
import { Calendar, Home, MapPin } from 'lucide-react';
import React from 'react';
import { Listing } from '../../types';
import FavoriteButton from '../common/FavoriteButton';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { favorited, toggleFavorite, loading } = useFavorite(listing.isFavorite || false);

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-lg transition-transform hover:scale-[1.02]">

      <FavoriteButton
        isFavorite={favorited}
        onToggle={() => toggleFavorite(listing.id)}
        loading={loading}
        className="absolute top-2 right-2"
      />

      {/* Image / Placeholder */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-600">
            <Home className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
          {listing.title}
        </h3>

        <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm truncate">
            {[listing.location?.street, listing.location?.city].filter(Boolean).join(', ') || listing.address || 'No location'}
          </span>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {typeof listing.price === 'number' ? formatPrice(listing.price) : 'Price on request'}
          </span>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Home className="w-4 h-4 mr-1" />
            <span>{listing.size} m² • {listing.rooms} rooms</span>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {listing.description}
        </p>

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Added {formatDate(listing.createdAt)}</span>
          </div>

          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
