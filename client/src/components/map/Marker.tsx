import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

interface MarkerProps {
  map: mapboxgl.Map | null;
  title: string;
  lat: number;
  lng: number;
  onClick?: () => void;
}

const Marker: React.FC<MarkerProps> = ({ map, title, lat, lng, onClick }) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!map || lat === undefined || lng === undefined) return;

    // Popup
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false,
    }).setHTML(`<div style="font-size:14px;">${title}</div>`);

    // Custom Marker Element
    const el = document.createElement("div");
    el.className =
      "bg-blue-600 hover:bg-blue-700 text-white rounded-full w-4 h-4 shadow-md cursor-pointer transition transform hover:scale-110";
    el.title = title;

    // Click → select Listing
    el.addEventListener("click", () => {
      if (onClick) onClick();
    });

    // Hover Popup
    const handleEnter = () => {
      popup.setLngLat([lng, lat]).addTo(map);
    };
    const handleLeave = () => {
      popup.remove();
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    // create Marker
    const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);

    // add Refs
    markerRef.current = marker;
    popupRef.current = popup;

    return () => {
      popup.remove();
      marker.remove();
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("click", () => onClick?.());
    };
  }, [map, lat, lng, title, onClick]);

  return null;
};

export default Marker;
