import urlModifier from "../services/runtime/queryStringMutator.js";
import { extractNumber } from '../utils/numberParser.js';
import utils, { buildHash } from "../utils/utils.js";

let appliedBlackList = [];

/**
 * Note, Immonet is rly a piece of sh*t. It is using a weird combination of React and some buttons (instead of links),
 * so that if somebody clicks the listing, a new page will open with the actual link to the listing. Of course, a scraper
 * cannot do this (which is why I always just return the link to the whole list of listings).
 * This is not only bad for us, but also bad for ppl with disabilities...
 */

function normalize(o) {
  const size = o.size ? extractNumber(o.size) : null;
  const rooms = o.size ? extractNumber(o.rooms) : null;
  const price = o.price ? extractNumber(o.price) : null;
  const title = o.title ? o.title.split("-")[0].trim() : "No title available";
  const url = urlModifier(config.url, config.sortByDateParam, config.urlParamsToRemove);
  const id = buildHash(title, price);
  return Object.assign(o, { id, price, size, title, url, rooms });
}

function applyBlacklist(o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, appliedBlackList);
  const descNotBlacklisted = !utils.isOneOf(o.description, appliedBlackList);
  return titleNotBlacklisted && descNotBlacklisted;
}

const config = {
  url: null,
  crawlContainer: 'div[data-testid="serp-core-classified-card-testid"]',
  sortByDateParam: "sortby=19",
  urlParamsToRemove: "order=Default",
  crawlFields: {
    id: 'button@title | trim',
    title: 'button@title | trim',
    price: 'div[data-testid="cardmfe-price-testid"] | trim',
    rooms: 'div[data-testid="cardmfe-keyfacts-testid"] div:nth-of-type(1) | trim',
    size: 'div[data-testid="cardmfe-keyfacts-testid"] div:nth-of-type(3) | trim',
    rawAddress: 'div[data-testid="cardmfe-description-box-address"] | trim',
    imageUrl: 'img[aria-label="Hauptbild"]@src | trim'
  },
  normalize: normalize,
  filter: applyBlacklist,
};

export const init = (sourceConfig, blacklistTerms) => {
  config.url = sourceConfig.url;
  appliedBlackList = blacklistTerms || [];
};

export const metaInformation = {
  name: "Immonet",
  baseUrl: "https://www.immonet.de",
  imageBaseUrl: "https://mms.immonet.de",
  id: "immonet",
};

export { config };

