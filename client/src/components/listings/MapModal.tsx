import { ExternalLink, MapPin, X } from 'lucide-react';
import React from 'react';
import { Listing } from '../../types';
import Map from '../map/Map';



interface MapModalProps {
  listings: Listing[];
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, listings }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(price);
    }
    return 'Price on request';
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="map-modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 id="map-modal-title" className="text-lg font-semibold text-gray-900">
              Property Locations ({listings.length} listings)
            </h2>
            <button
              onClick={onClose}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Map Content */}
          <div className="flex h-full">
            {/* Map Area */}
            <div className="flex-1 bg-gray-100 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Map listings={listings} />
              </div>

            </div>

            {/* Sidebar with listings */}
            <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Property List</h3>
                <div className="space-y-3">
                  {listings.slice(0, 6).map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        {listing.imageUrl ? (
                          <img
                            src={listing.imageUrl}
                            alt={listing.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {listing.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {[listing.location?.street, listing.location?.city].filter(Boolean).join(', ') || 'No location'}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-semibold text-green-600">
                              {formatPrice(listing.price)}
                            </span>
                            <a
                              href={listing.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {listings.length > 6 && (
                    <div className="text-center py-2">
                      <span className="text-sm text-gray-500">
                        +{listings.length - 6} more properties
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
