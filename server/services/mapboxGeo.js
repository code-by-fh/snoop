import fetch from 'node-fetch';
import logger from '#utils/logger.js';

export async function addGeoCoordinatesWithMapbox(listing) {
  const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
  if (!MAPBOX_TOKEN) {
    logger.warn("MAPBOX_ACCESS_TOKEN not set. Returning original listing.");
    return listing;
  }

  if (!listing.rawAddress) {
    logger.warn(`Listing ${listing.id} has no address. Skipping geocoding.`);
    return listing;
  }

  const sanitizedAddress = listing.rawAddress.replace(/;/g, '');
  const encodedAddress = encodeURIComponent(sanitizedAddress);
  const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodedAddress}&country=de&language=de&limit=1&access_token=${MAPBOX_TOKEN}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      logger.warn(`Failed to geocode listing ${listing.id}: ${response.statusText}`);
      return listing;
    }

    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const [lng, lat] = feature.geometry.coordinates;

      const ctx = feature.properties.context || {};
      const addressInfo = ctx.address || {};
      const streetInfo = ctx.street || {};

      const street = addressInfo.street_name
        ? `${addressInfo.street_name}${addressInfo.address_number ? ' ' + addressInfo.address_number : ''}`
        : streetInfo.name || feature.text || null;

      listing.location = {
        ...(lat && { lat }),
        ...(lng && { lng }),
        ...(street && { street: street.trim() }),
        ...(ctx.place?.name && { city: ctx.place.name }),
        ...(feature.properties.full_address && { fullAddress: feature.properties.full_address }),
        ...(ctx.region?.name && { state: ctx.region.name }),
        ...(ctx.postcode?.name && { zipcode: ctx.postcode.name }),
        ...(ctx.country?.name && { land: ctx.country.name }),
        ...(ctx.locality?.name && { district: ctx.locality.name }),
      };

      logger.info(`Found coordinates for listing ${listing.id}: lat=${lat}, lng=${lng}`);
    } else {
      logger.warn(`No coordinates found for listing ${listing.id}`);
    }
  } catch (err) {
    logger.error(`Error fetching coordinates for listing ${listing.id}:`, err);
  }

  return listing;
}
