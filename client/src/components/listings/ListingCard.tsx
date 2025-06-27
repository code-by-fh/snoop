import { format } from 'date-fns';
import { Calendar, Home, MapPin } from 'lucide-react';
import React from 'react';
import { Listing } from '../../types';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform hover:scale-[1.02] hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <div className="relative h-48 bg-gray-200">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Home className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{listing.title}</h3>

        <div className="mt-2 flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {[listing.location?.street, listing.location?.city].filter(Boolean).join(', ') || listing.address || 'No location'}
          </span>
        </div>

        <div className="mt-4 flex justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold text-green-600">
              {typeof listing.price === 'number' ? formatPrice(listing.price) : 'Price on request'}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Home className="w-4 h-4 mr-1" />
            <span>{listing.size} m² • {listing.rooms} rooms</span>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{listing.description}</p>

        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Added {formatDate(listing.createdAt)}</span>
          </div>

          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
