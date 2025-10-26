import { Home } from "lucide-react";
import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Listing } from "../../types";
import { isAppDarkMode, onAppDarkModeChange } from "../../utils/theme";

interface MapProps {
  selectedListing: Listing | null;
  listings: Listing[];
  onSelect?: (listing: Listing | null) => void;
}

const Map: React.FC<MapProps> = ({ listings, onSelect, selectedListing }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState<"light" | "dark" | "satellite">(
    isAppDarkMode() ? "dark" : "light"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mapStyles = {
    light: "mapbox://styles/mapbox/light-v11",
    dark: "mapbox://styles/mapbox/dark-v11",
    satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  };

  useEffect(() => {
    const cleanup = onAppDarkModeChange((dark) => {
      setMapStyle(dark ? "dark" : "light");
    });
    return cleanup;
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN!;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyles[mapStyle],
      center: [10, 50],
      zoom: 4,
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.addControl(
      new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }),
      "top-right"
    );

    map.on("load", () => setIsMapLoaded(true));

    map.on("error", (e) => {
      const msg = e?.error?.message || "";

      if (msg.includes("Failed to fetch") || msg.includes("Unauthorized")) {
        setErrorMessage("Failed to fetch map data. Please check your Mapbox token.");
      } else {
        console.error("Mapbox error:", e.error);
      }
    });

    mapRef.current = map;
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (mapRef.current && isMapLoaded) {
      mapRef.current.setStyle(mapStyles[mapStyle]);
    }
  }, [mapStyle, isMapLoaded]);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;
    const map = mapRef.current;

    (map as any).__markers?.forEach((m: mapboxgl.Marker) => m.remove());
    const bounds = new mapboxgl.LngLatBounds();
    const markers: { id: string; marker: mapboxgl.Marker; element: HTMLElement; listing: Listing }[] = [];

    listings.forEach((listing) => {
      if (!listing.location?.lat || !listing.location?.lng) return;

      const el = document.createElement("div");
      el.className = "cursor-pointer transition-transform transform hover:scale-110";

      const root = createRoot(el);
      root.render(
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2
            ${listing.isFavorite
              ? "bg-yellow-400 text-black border-yellow-300"
              : "bg-gray-600 border-gray-300"}`}
          title={listing.title}
        >
          <Home size={16} className="text-white" />
        </div>
      );

      const marker = new mapboxgl.Marker(el)
        .setLngLat([listing.location.lng, listing.location.lat])
        .addTo(map);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        map.flyTo({
          center: [listing.location?.lng ?? 0, listing.location?.lat ?? 0],
          zoom: 8,
          speed: 1.2,
          curve: 1.2,
        });
        onSelect?.(listing);
      });

      markers.push({ id: listing.id, marker, element: el, listing });
      bounds.extend([listing.location.lng, listing.location.lat]);
    });

    (map as any).__markers = markers.map((m) => m.marker);
    (map as any).__markerData = markers;

    if (markers.length && !bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 14, duration: 0 });
    }

    const handleMapClick = () => onSelect?.(null);
    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
      markers.forEach(({ marker }) => marker.remove());
    };
  }, [listings, isMapLoaded, mapStyle]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current as any;
    const markers = map.__markerData as
      | { id: string; element: HTMLElement; listing: Listing }[]
      | undefined;
    if (!markers) return;

    markers.forEach(({ element, listing, id }) => {
      const div = element.querySelector("div");
      if (!div) return;

      div.classList.remove(
        "bg-blue-600",
        "border-blue-300",
        "bg-gray-600",
        "border-gray-300",
        "bg-yellow-400",
        "border-yellow-300"
      );

      if (selectedListing?.id === id) {
        div.classList.add("bg-blue-600", "border-blue-300");
      } else if (listing.isFavorite) {
        div.classList.add("bg-yellow-400", "border-yellow-300");
      } else {
        div.classList.add("bg-gray-600", "border-gray-300");
      }
    });
  }, [selectedListing]);

  if (errorMessage) {
    return (
      <div className="absolute top-3 left-3 bg-red-100 text-red-800 dark:bg-red-800/90 dark:text-red-100 px-4 py-2 rounded-md shadow-lg z-20">
        {errorMessage}
      </div>
    )
  }

  return (
    <div className="relative h-full w-full rounded-lg shadow-md">
      <div ref={mapContainerRef} className="h-full w-full rounded-lg" />

      <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg p-2 flex space-x-2 z-10">
        {(["light", "dark", "satellite"] as const).map((style) => (
          <button
            key={style}
            onClick={() => setMapStyle(style)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200
              ${mapStyle === style
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
          >
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Map;
