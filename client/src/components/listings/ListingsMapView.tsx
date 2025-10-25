import { useFavorite } from '@/hooks/useFavorite';
import { formatPrice } from "@/utils/formatters";
import { ExternalLink, X } from "lucide-react";
import React, { useState } from "react";
import { Listing } from "../../types";
import FavoriteButton from "../common/FavoriteButton";
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
    <div className={`bg-white dark:bg-gray-800 ${mobile ? "rounded-t-lg shadow-lg relative" : "h-full flex flex-col relative"}`}>
      <FavoriteButton
        isFavorite={favorited}
        onToggle={() => toggleFavorite(listing.id)}
        loading={loading}
        className="absolute top-[80px] left-[20px]"
      />
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{listing.title}</h2>
        <button
          onClick={onClose}
          className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className={`p-4 ${mobile ? "space-y-3 max-h-[60vh] overflow-y-auto" : "overflow-y-auto flex-1 space-y-4"}`}>
        {listing.imageUrl && (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className={`w-full ${mobile ? "h-40" : "h-48"} object-cover rounded-lg`}
          />
        )}
        <p className="text-sm text-gray-700 dark:text-gray-300">{listing.description}</p>
        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Location:</strong>{" "}
            {[listing.location?.street, listing.location?.city].filter(Boolean).join(", ")}
          </p>
          <p><strong>Rooms:</strong> {listing.rooms}</p>
          <p><strong>Size:</strong> {listing.size} m²</p>
          <p>
            <strong>Price:</strong>{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">{formatPrice(listing.price)}</span>
          </p>
        </div>
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          View Listing
        </a>
      </div>
    </div>
  );
};

export default ListingsMapView;
