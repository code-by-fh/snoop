import { extractNumber } from '../utils/numberParser.js';
import utils, { buildHash } from '../utils/utils.js';

let appliedBlackList = [];
let appliedBlacklistedDistricts = [];

function normalize(o) {
  const url = `${metaInformation.baseUrl}${o.url}`;
  const id = buildHash(o.id, o.price);
  const price = extractNumber(o.price);
  const location = {
    ...(o.address && { city: o.address })
  };
  const splitSizeRooms = o.size.split('·');
  const rooms = o.rooms && splitSizeRooms[1] ? extractNumber(o.rooms.split('·')[0].trim()) : null;
  const size = o.size && splitSizeRooms[1] ? extractNumber(o.size.split('·')[1].trim()) : null;
  o.size.split('·')[6].trim()
  return Object.assign(o, { id, size, url, price, location, rooms });
}

function applyBlacklist(o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, appliedBlackList);
  const descNotBlacklisted = !utils.isOneOf(o.description, appliedBlackList);
  const isBlacklistedDistrict = appliedBlacklistedDistricts.length === 0 ? false : utils.isOneOf(o.description, appliedBlacklistedDistricts);
  return !isBlacklistedDistrict && titleNotBlacklisted && descNotBlacklisted && o.title && o.url;
}

const config = {
  url: null,
  crawlContainer: '#srchrslt-adtable .ad-listitem:not(.is-highlight):not(.badge-topad):not(.is-topad)',
  //sort by date is standard oO
  sortByDateParam: null,
  waitForSelector: 'body',
  crawlFields: {
    id: '.aditem@data-adid | int',
    price: '.aditem-main--middle--price-shipping--price | removeNewline | trim',
    size: '.aditem-main--middle--tags | removeNewline | trim',
    rooms: '.aditem-main--middle--tags | removeNewline | trim',
    title: '.aditem-main .text-module-begin a | removeNewline | trim',
    url: '.aditem-main .text-module-begin a@href | removeNewline | trim',
    description: '.aditem-main .aditem-main--middle--description | removeNewline | trim',
    address: '.aditem-main--top--left | trim | removeNewline',
    imageUrl: ".aditem-image .imagebox img@src",
  },
  normalize: normalize,
  filter: applyBlacklist,
};

export const metaInformation = {
  name: "Kleinanzeigen",
  baseUrl: "https://www.kleinanzeigen.de",
  imageBaseUrl: "https://img.kleinanzeigen.de",
  id: "kleinanzeigen",
};

export const init = (sourceConfig, blacklistTerms, blacklistedDistricts) => {
  config.url = sourceConfig.url;
  appliedBlacklistedDistricts = blacklistedDistricts || [];
  appliedBlackList = blacklistTerms || [];
};

export { config };

