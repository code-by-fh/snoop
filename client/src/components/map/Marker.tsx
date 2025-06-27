import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

interface MarkerProps {
    map: mapboxgl.Map | null;
    title: string;
    lat: number;
    lng: number;
}

const Marker: React.FC<MarkerProps> = ({ map, title, lat, lng }) => {
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const popupRef = useRef<mapboxgl.Popup | null>(null);

    useEffect(() => {
        if (!map || lat === undefined || lng === undefined) return;

        const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: false,
        }).setHTML(`<div style="font-size:14px;">${title}</div>`);

        const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map);

        const markerEl = marker.getElement();

        const handleEnter = () => {
            popup.setLngLat([lng, lat]).addTo(map);
        };

        const handleLeave = () => {
            popup.remove();
        };

        markerEl.addEventListener("mouseenter", handleEnter);
        markerEl.addEventListener("mouseleave", handleLeave);

        markerRef.current = marker;
        popupRef.current = popup;

        return () => {
            marker.remove();
            popup.remove();
            markerEl.removeEventListener("mouseenter", handleEnter);
            markerEl.removeEventListener("mouseleave", handleLeave);
        };
    }, [map, lat, lng, title]);

    return null;
};

export default Marker;
