import { addFavorite, removeFavorite } from '@/api';
import { formatDate, formatPrice } from '@/utils/formatters';
import { Calendar, Home, MapPin, Star, StarOff } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Listing } from '../../types';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const [favorited, setFavorited] = useState(listing.isFavorite || false);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (favorited) {
        await removeFavorite(listing.id);
        toast.success('Removed from favorites');
      } else {
        await addFavorite(listing.id);
        toast.success('Added to favorites');
      }
      setFavorited(!favorited);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update favorite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-lg transition-transform hover:scale-[1.02]">

      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={`
            absolute top-2 right-2 p-2 rounded-full shadow-md z-10 transition
            ${favorited
            ? 'bg-yellow-400 text-black hover:bg-yellow-500 dark:bg-yellow-400 dark:hover:bg-yellow-500'
            : 'bg-white text-gray-400 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
          `}
      >
        {favorited ? <Star className="w-5 h-5" /> : <StarOff className="w-5 h-5" />}
      </button>

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
