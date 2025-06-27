import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';
import { Listing } from '../../types';
import Marker from './Marker';

interface MapProps {
    listings: Listing[];
}

const Map: React.FC<MapProps> = ({ listings }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const calculateCenter = (listings: Listing[]): [number, number] => {
        const latitudes = listings
            .map(listing => listing.location?.lat)
            .filter((lat): lat is number => lat !== undefined);

        const longitudes = listings
            .map(listing => listing.location?.lng)
            .filter((lng): lng is number => lng !== undefined);

        if (latitudes.length === 0 || longitudes.length === 0) return [0, 0];

        const avgLat = latitudes.reduce((acc, lat) => acc + lat, 0) / latitudes.length;
        const avgLng = longitudes.reduce((acc, lng) => acc + lng, 0) / longitudes.length;

        return [avgLng, avgLat];
    };

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN!;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/navigation-day-v1',
            zoom: 0,
            minZoom: 0
        });

        if (mapRef.current) {
            const center: [number, number] = calculateCenter(listings);
            mapRef.current.setCenter(center);
        }

        mapRef.current.on('load', () => {
            setIsMapLoaded(true);
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, [listings]);

    const getCoordinates = (listing: Listing): { title: string, lat: number, lng: number } | null => {
        if (listing.location && listing.location.lat !== undefined && listing.location.lng !== undefined) {
            return {
                title: listing.title,
                lat: listing.location.lat,
                lng: listing.location.lng
            };
        }
        return null;
    };

    return (
        <>
            <div
                className='h-full w-full'
                id="map-container"
                ref={mapContainerRef}
            />
            {isMapLoaded && mapRef.current && listings.map((listing) => {
                const coordinates = getCoordinates(listing);
                if (coordinates) {
                    return (
                        <Marker
                            key={listing.id}
                            map={mapRef.current}
                            title={coordinates.title}
                            lat={coordinates.lat}
                            lng={coordinates.lng}
                        />
                    );
                }
                return null;
            })}
        </>
    );
}

export default Map;
