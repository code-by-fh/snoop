import { useFavorite } from '@/hooks/useFavorite';
import { formatPrice } from "@/utils/formatters";
import { MapPin, X } from "lucide-react";
import React, { useState } from "react";
import { Listing } from "../../types";
import FavoriteButton from "../common/FavoriteButton";
import ViewDetailsButton from '../common/ViewDetailsButton';
import ViewedButton from '../common/ViewedButton';
import Map from "../map/Map";

interface ListingsMapViewProps {
  listings: Listing[];
}

const ListingsMapView: React.FC<ListingsMapViewProps> = ({ listings }) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  return (
    <div className="w-full h-[50vh] sm:h-[77vh] flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-1 relative overflow-hidden h-full">
        <div
          className={`transition-all duration-300 ease-in-out ${selectedListing ? "md:w-[calc(100%-24rem)]" : "w-full"} h-full`}
        >
          <Map listings={listings} onSelect={setSelectedListing} selectedListing={selectedListing} />
        </div>
        <div
          className={`hidden md:block bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${selectedListing ? "w-96 translate-x-0" : "w-0 translate-x-full"}`}
        >
          {selectedListing && (
            <ListingDetailSidebar listing={selectedListing} onClose={() => setSelectedListing(null)} />
          )}
        </div>
      </div>
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out ${selectedListing ? "translate-y-0" : "translate-y-full"}`}
      >
        {selectedListing && (
          <ListingDetailSidebar listing={selectedListing} onClose={() => setSelectedListing(null)} mobile />
        )}
      </div>
    </div>
  );
};

interface ListingDetailSidebarProps {
  listing: Listing;
  onClose: () => void;
  mobile?: boolean;
}

const ListingDetailSidebar: React.FC<ListingDetailSidebarProps> = ({ listing, onClose, mobile = false }) => {
  const { favorited, toggleFavorite, loading } = useFavorite(listing.isFavorite || false);

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden transition-all duration-300
        ${mobile
          ? "rounded-t-2xl shadow-2xl relative overflow-hidden"
          : "h-full flex flex-col relative rounded-2xl shadow-xl"
        } `}
    >

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-snug">
          {listing.title}
        </h2>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
        </button>
      </div>

      {/* Content */}
      <div
        className={`p-5 ${mobile
          ? "space-y-4 max-h-[70vh] overflow-y-auto"
          : "overflow-y-auto flex-1 space-y-6"
          }`}
      >

        {/* Image */}
        {listing.imageUrl && (
          <div className="relative group rounded-xl overflow-hidden">
            <FavoriteButton
              isFavorite={favorited}
              onToggle={() => toggleFavorite(listing.id)}
              loading={loading}
              className="absolute top-[15px] left-[15px]"
            />

            <ViewedButton viewed={listing.viewed || false} className="absolute top-[15px] right-[15px]" listingId={listing.id} />

            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70 group-hover:opacity-50 transition"></div>
          </div>
        )}

        {/* Description */}
        {listing.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {listing.description}
          </p>
        )}

        {/* Info Section */}
        <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
            <span className="truncate" title={listing.location?.fullAddress}>
              {listing.location?.fullAddress ||
                listing.location?.street ||
                "No location"}
            </span>
          </div>
          {listing.rooms && (
            <div>
              <strong className="text-gray-900 dark:text-gray-100">Rooms:</strong>{" "}
              {listing.rooms}
            </div>
          )}
          {listing.size && (
            <div>
              <strong className="text-gray-900 dark:text-gray-100">Size:</strong>{" "}
              {listing.size} m²
            </div>
          )}
          {listing.price && (
            <div>
              <strong className="text-gray-900 dark:text-gray-100">Price:</strong>{" "}
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatPrice(listing.price)}
              </span>
            </div>
          )}
        </div>

        <ViewDetailsButton url={listing.trackingUrl} />
      </div>
    </div>

  );
};

export default ListingsMapView;
