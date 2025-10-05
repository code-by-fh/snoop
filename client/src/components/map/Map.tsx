import { Home } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Listing } from '../../types';
import { isAppDarkMode, onAppDarkModeChange } from "../../utils/theme";

interface MapProps {
  listings: Listing[];
  onSelect?: (listing: Listing) => void;
}

const Map: React.FC<MapProps> = ({ listings, onSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const mapDarkStyle = 'mapbox://styles/mapbox/dark-v11';
  const mapLightStyle = 'mapbox://styles/mapbox/light-v11';

  useEffect(() => {
    const cleanup = onAppDarkModeChange((dark) => {
      console.log('Dark mode changed:', dark);
      if (mapRef.current) {
        mapRef.current.setStyle(dark ? mapDarkStyle : mapLightStyle);
      }
    });

    return cleanup;
  }, []);


  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN!;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: isAppDarkMode() ? mapDarkStyle : mapLightStyle,
      center: [10, 50],
      zoom: 4,
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(
      new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }),
      'top-right'
    );

    map.on('load', () => {
      setIsMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    const map = mapRef.current;

    // alte Marker löschen
    (map as any).__markers?.forEach((m: mapboxgl.Marker) => m.remove());
    (map as any).__markers = [];

    const bounds = new mapboxgl.LngLatBounds();

    listings.forEach((listing) => {
      if (listing.location?.lat && listing.location?.lng) {
        const el = document.createElement('div');
        el.className = 'cursor-pointer transition-transform transform hover:scale-110';

        const root = createRoot(el);
        root.render(
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 
              ${selectedId === listing.id
                ? 'bg-blue-600 border-blue-300'
                : 'bg-gray-600 border-gray-300'} 
            `}
            title={listing.title}
          >
            <Home size={16} className="text-white" />
          </div>
        );

        const marker = new mapboxgl.Marker(el)
          .setLngLat([listing.location.lng, listing.location.lat])
          .addTo(map);

        el.addEventListener('click', () => {
          setSelectedId(listing.id);
          onSelect?.(listing);
        });

        (map as any).__markers.push(marker);
        bounds.extend([listing.location.lng, listing.location.lat]);
      }
    });

    if (listings.length > 0) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 14, duration: 1000 });
    }
  }, [listings, isMapLoaded, onSelect, selectedId]);

  return <div className="h-full w-full rounded-lg shadow-md" ref={mapContainerRef} />;
};

export default Map;
