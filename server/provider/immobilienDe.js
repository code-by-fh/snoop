import utils, { buildHash } from '../utils/utils.js';
import { extractNumber } from '../utils/numberParser.js';

let appliedBlackList = [];

function shortenLink(link) {
  return link.substring(0, link.indexOf("?"));
}

function parseId(shortenedLink) {
  return shortenedLink.substring(shortenedLink.lastIndexOf("/") + 1);
}

function normalize(o) {
  const size = o.size ? extractNumber(o.size) : null;
  const price = o.price ? extractNumber(o.price) : nul
  const rooms = o.rooms ? extractNumber(o.rooms) : null;
  const title = o.title || 'No title available';
  const location = {
    ...(o.city && { city: o.city })
  };
  const shortLink = shortenLink(o.url);
  const url = `https://www.immobilien.de/${shortLink}`;
  const id = buildHash(parseId(shortLink), o.price);
  const imageUrl = o.imageUrl ? `${metaInformation.baseUrl}${o.imageUrl}` : null;
  return Object.assign(o, { id, price, size, title, url, imageUrl, rooms, location });
}

function applyBlacklist(o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, appliedBlackList);
  const descNotBlacklisted = !utils.isOneOf(o.description, appliedBlackList);
  return titleNotBlacklisted && descNotBlacklisted;
}

const config = {
  url: null,
  crawlContainer: '._ref',
  sortByDateParam: 'sort_col=*created_ts&sort_dir=desc',
  waitForSelector: 'body',
  crawlFields: {
    id: '@href', //will be transformed later
    price: '.list_entry .immo_preis .label_info',
    size: '.list_entry .flaeche .label_info | removeNewline | trim',
    rooms: '.list_entry .zimmer .label_info | removeNewline | trim',
    title: '.list_entry .part_text h3 span',
    description: '.list_entry .description | trim',
    url: '@href',
    city: '.list_entry .place',
    imageUrl: ".list_entry .part_logo img@src",
  },
  normalize: normalize,
  filter: applyBlacklist,
};

export const init = (sourceConfig, blacklistTerms) => {
  config.enabled = sourceConfig.isActive;
  config.url = sourceConfig.url;
  appliedBlackList = blacklistTerms || [];
};

export const metaInformation = {
  name: "Immobilien.de",
  baseUrl: "https://www.immobilien.de",
  id: "immobilienDe",
};

export { config };
