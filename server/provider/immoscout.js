/**
 * ImmoScout provider using the mobile API to retrieve listings.
 *
 * The mobile API provides the following endpoints:
 * - GET /search/total?{search parameters}: Returns the total number of listings for the given query
 *   Example: `curl -H "User-Agent: ImmoScout24_1410_30_._" https://api.mobile.immobilienscout24.de/search/total?searchType=region&realestatetype=apartmentrent&pricetype=calculatedtotalrent&geocodes=%2Fde%2Fberlin%2Fberlin `
 *
 * - POST /search/list?{search parameters}: Actually retrieves the listings. Body is json encoded and contains
 *   data specifying additional results (advertisements) to return. The format is as follows:
 *   ```
 *   {
 *   "supportedResultListTypes": [],
 *   "userData": {}
 *   }
 *   ```
 *   It is not necessary to provide data for the specified keys.
 *
 *   Example: `curl -X POST 'https://api.mobile.immobilienscout24.de/search/list?pricetype=calculatedtotalrent&realestatetype=apartmentrent&searchType=region&geocodes=%2Fde%2Fberlin%2Fberlin&pagenumber=1' -H "Connection: keep-alive" -H "User-Agent: ImmoScout24_1410_30_._" -H "Accept: application/json" -H "Content-Type: application/json" -d '{"supportedResultListType": [], "userData": {}}'`

 * - GET /expose/{id} - Returns the details of a listing. The response contains additional details not included in the
 *   listing response.
 *
 *   Example: `curl -H "User-Agent: ImmoScout24_1410_30_._" "https://api.mobile.immobilienscout24.de/expose/158382494"`
 *
 *
 * It is necessary to set the correct User Agent (see `getListings`) in the request header.
 *
 * Note that the mobile API is not publicly documented. I've reverse-engineered
 * it by intercepting traffic from an android emulator running the immoscout app.
 * Moreover, the search parameters differ slightly from the web API. I've mapped them
 * to the web API parameters by comparing a search request with all parameters set between
 * the web and mobile API. The mobile API actually seems to be a superset of the web API,
 * but I have decided not to include new parameters as I wanted to keep the existing UX (i.e.,
 * users only have to provide a link to an existing search).
 *
 */

import { convertWebToMobile } from '../services/runtime/immoscout/immoscout-web-translater.js';
import logger from '../utils/logger.js';
import { extractNumber } from '../utils/numberParser.js';
import utils, { buildHash, nullOrEmpty } from '../utils/utils.js';

let appliedBlackList = [];

async function getListings() {
  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'User-Agent': 'ImmoScout24_1410_30_._',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      supportedResultListTypes: [],
      userData: {},
    }),
  });
  if (!response.ok) {
    logger.error(`Error fetching data from ImmoScout Mobile API: ${response.statusText}`);
    return [];
  }

  const responseBody = await response.json();
  return responseBody.resultListItems
    .filter((item) => item.type === 'EXPOSE_RESULT')
    .map((expose) => {
      const item = expose.item;
      const [price, size, rooms] = item.attributes;

      const listing = {
        id: item.id,
        price: price?.value,
        size: size?.value,
        rooms: rooms?.value,
        title: item.title,
        url: `${metaInformation.baseUrl}/expose/${item.id}`,
        imageUrl: item.titlePicture?.preview || null,
      };

      if (item.address?.lat && item.address?.lon) {
        listing.location = {
          lat: item.address.lat,
          lng: item.address.lon,
        };
      }

      if (item.address?.line) {
        const [streetPart, cityPart] = item.address?.line.split(",")
        listing.location.street = streetPart.trim();
        listing.location.city = cityPart.trim();
      }

      return listing;
    });

}

function normalize(o) {
  const title = nullOrEmpty(o.title) ? 'NO TITLE FOUND' : o.title.replace('NEU', '');
  const id = buildHash(o.id, o.price);
  const price = extractNumber(o.price);
  const size = extractNumber(o.size);
  const rooms = extractNumber(o.rooms);

  return Object.assign(o, { id, title, price, size, rooms });
}

function applyBlacklist(o) {
  return !utils.isOneOf(o.title, appliedBlackList);
}

const config = {
  url: null,
  crawlFields: {
    id: 'id',
    title: 'title',
    price: 'price',
    size: 'size',
    url: 'link',
    address: 'address',
    imageUrl: '.result-list-entry .gallery-container .gallery__image@data-lazy-src',
  },
  // Not required - used by filter to remove and listings that failed to parse
  sortByDateParam: 'sorting=-firstactivation',
  normalize: normalize,
  filter: applyBlacklist,
  getListings: getListings,
};

export const init = (sourceConfig, blacklistTerms) => {
  config.enabled = sourceConfig.isActive;
  config.url = convertWebToMobile(sourceConfig.url);
  appliedBlackList = blacklistTerms || [];
};

export const metaInformation = {
  name: 'Immoscout',
  baseUrl: 'https://www.immobilienscout24.de',
  id: 'immoscout',
};

export { config };

