import utils, { buildHash } from '../utils/utils.js';
import { extractNumber } from '../utils/numberParser.js';

let appliedBlackList = [];

function normalize(o) {
  const size = extractNumber(o.size);
  const price = extractNumber(o.price);
  const rooms = extractNumber(o.rooms);
  const title = o.title || 'No title available';
  const immoId = o.id.substring(o.id.indexOf('-') + 1, o.id.length);
  const url = `${metaInformation.baseUrl}/immobilien/${immoId}`;
  const id = buildHash(immoId, price);
  return Object.assign(o, { id, price, size, title, url, rooms });
}

function applyBlacklist(o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, appliedBlackList);
  const descNotBlacklisted = !utils.isOneOf(o.description, appliedBlackList);
  return titleNotBlacklisted && descNotBlacklisted;
}

const config = {
  url: null,
  crawlContainer: '.js-serp-item',
  sortByDateParam: 's=most_recently_updated_first',
  waitForSelector: 'body',
  crawlFields: {
    id: '.js-bookmark-btn@data-id',
    price: 'div.align-items-start div:nth-of-type(1) | trim',
    rooms: 'div.align-items-start div:nth-of-type(2) | trim',
    size: 'div.align-items-start div:nth-of-type(3) | trim',
    details: 'div.align-items-start | trim',
    title: '.js-item-title-link@title | trim',
    url: '.ci-search-result__link@href',
    rawAddress: '.card-body div:nth-of-type(3) | removeNewline | trim',
    imageUrl: "div img@src",
  },
  normalize: normalize,
  filter: applyBlacklist,
};

export const init = (sourceConfig, blacklistTerms) => {
  config.url = sourceConfig.url;
  appliedBlackList = blacklistTerms || [];
};

export const metaInformation = {
  name: "Immo Südwest Presse",
  baseUrl: "https://immo.swp.de",
  imageBaseUrl: "https://cmcdn.de",
  id: "immoswp",
};

export { config };
