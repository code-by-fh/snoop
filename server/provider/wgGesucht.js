import { extractNumber } from '../utils/numberParser.js';
import utils, { buildHash } from '../utils/utils.js';

let appliedBlackList = [];

function extractUrlFromStyleAttribute(style) {
  if (style && style.includes("url(")) {
    return style.match(/url\((.*?)\)/)[1];
  } else {
    LOG.warn("No background image URL found.");
    return null;
  }
}

function normalize(o) {
  const id = buildHash(o.id, o.price);
  const url = `${metaInformation.baseUrl}${o.url}`;
  const price = extractNumber(o.price);
  const size = extractNumber(o.size);
  const [rawRooms, city, street] = (o.details || "").split("|").map(v => v.trim())
  const rooms = extractNumber(rawRooms)
  const location = {
    ...(city && { city }),
    ...(street && { street })
  }
  return Object.assign(o, { id, url, price, size, rooms, location });
}

function applyBlacklist(o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, appliedBlackList);
  const descNotBlacklisted = !utils.isOneOf(o.description, appliedBlackList);
  return o.id != null && titleNotBlacklisted && descNotBlacklisted && o.url.startsWith(o.url);
}

const config = {
  url: null,
  crawlContainer: '#main_column .wgg_card',
  sortByDateParam: 'sort_column=0&sort_order=0',
  waitForSelector: 'body',
  crawlFields: {
    id: '@data-id',
    details: '.row .noprint .col-xs-11 | removeNewline |trim',
    price: '.middle .col-xs-3 | removeNewline |trim',
    size: '.middle .text-right | removeNewline |trim',
    title: '.truncate_title a | removeNewline |trim',
    url: '.truncate_title a@href',
    imageUrl: ".row img@src"
  },
  normalize: normalize,
  filter: applyBlacklist,
};

export const init = (sourceConfig, blacklistTerms) => {
  config.url = sourceConfig.url;
  appliedBlackList = blacklistTerms || [];
};

export const metaInformation = {
  name: "Wg gesucht",
  baseUrl: "https://www.wg-gesucht.de",
  imageBaseUrl: "https://img.wg-gesucht.de",
  id: "wgGesucht",
};

export { config };

