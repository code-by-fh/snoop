import { ExternalLink, X, Star, StarOff } from "lucide-react";
import React, { useState } from "react";
import { Listing } from "../../types";
import Map from "../map/Map";
import { formatPrice } from "@/utils/formatters";
import { addFavorite, removeFavorite } from "@/api";
import toast from "react-hot-toast";

interface ListingsMapViewProps {
  listings: Listing[];
}

const ListingsMapView: React.FC<ListingsMapViewProps> = ({ listings }) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [favoriteState, setFavoriteState] = useState<Record<string, boolean>>(
    Object.fromEntries(listings.map(l => [l.id, l.isFavorite || false]))
  );
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const toggleFavorite = async (listing: Listing) => {
    const favorited = favoriteState[listing.id];
    setFavoriteState(prev => ({ ...prev, [listing.id]: !favorited }));
    setLoading(prev => ({ ...prev, [listing.id]: true }));

    try {
      if (favorited) {
        await removeFavorite(listing.id);
        toast.success("Removed from favorites");
      } else {
        await addFavorite(listing.id);
        toast.success("Added to favorites");
      }
    } catch (err: any) {
      setFavoriteState(prev => ({ ...prev, [listing.id]: favorited })); // rollback
      toast.error(err?.response?.data?.message || "Failed to update favorite");
    } finally {
      setLoading(prev => ({ ...prev, [listing.id]: false }));
    }
  };

  const renderFavoriteButton = (listing: Listing) => {
    const favorited = favoriteState[listing.id];
    const isLoading = loading[listing.id];

    return (
      <button
        onClick={() => toggleFavorite(listing)}
        disabled={isLoading}
        className={`
          absolute top-3 right-12 p-2 rounded-full shadow-md z-10 transition
          ${favorited
            ? "bg-yellow-400 text-black hover:bg-yellow-500"
            : "bg-white text-gray-400 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}
        `}
      >
        {favorited ? <Star className="w-5 h-5" /> : <StarOff className="w-5 h-5" />}
      </button>
    );
  };

  return (
    <div className="w-full h-[50vh] sm:h-[77vh] flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-1 relative overflow-hidden h-full">
        {/* Map Area */}
        <div
          className={`transition-all duration-300 ease-in-out ${selectedListing ? "md:w-[calc(100%-24rem)]" : "w-full"
            } h-full`}
        >
          <Map listings={listings} onSelect={setSelectedListing} selectedListing={selectedListing} />
        </div>

        {/* Desktop Sidebar */}
        <div
          className={`hidden md:block bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${selectedListing ? "w-96 translate-x-0" : "w-0 translate-x-full"
            }`}
        >
          {selectedListing && (
            <div className="h-full flex flex-col relative">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedListing.title}
                </h2>
                {renderFavoriteButton(selectedListing)}
                <button
                  onClick={() => setSelectedListing(null)}
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 space-y-4">
                {selectedListing.imageUrl && (
                  <img
                    src={selectedListing.imageUrl}
                    alt={selectedListing.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedListing.description}
                </p>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <strong>Location:</strong>{" "}
                    {[selectedListing.location?.street, selectedListing.location?.city].filter(Boolean).join(", ")}
                  </p>
                  <p><strong>Rooms:</strong> {selectedListing.rooms}</p>
                  <p><strong>Size:</strong> {selectedListing.size} m²</p>
                  <p>
                    <strong>Price:</strong>{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatPrice(selectedListing.price)}
                    </span>
                  </p>
                </div>
                <a
                  href={selectedListing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Listing
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out ${selectedListing ? "translate-y-0" : "translate-y-full"
          }`}
      >
        {selectedListing && (
          <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-lg relative">
            {renderFavoriteButton(selectedListing)}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {selectedListing.title}
              </h2>
              <button
                onClick={() => setSelectedListing(null)}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedListing.imageUrl && (
                <img
                  src={selectedListing.imageUrl}
                  alt={selectedListing.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {selectedListing.description}
              </p>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>Location:</strong>{" "}
                  {[selectedListing.location?.street, selectedListing.location?.city].filter(Boolean).join(", ")}
                </p>
                <p><strong>Rooms:</strong> {selectedListing.rooms}</p>
                <p><strong>Size:</strong> {selectedListing.size} m²</p>
                <p>
                  <strong>Price:</strong>{" "}
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatPrice(selectedListing.price)}
                  </span>
                </p>
              </div>
              <a
                href={selectedListing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View Listing
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsMapView;
