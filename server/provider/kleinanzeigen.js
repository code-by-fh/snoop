import { extractNumber } from '../utils/numberParser.js';
import utils, { buildHash } from '../utils/utils.js';

let appliedBlackList = [];
let appliedBlacklistedDistricts = [];

function normalize(o) {
  const size = o.size ? extractNumber(o.size) : null;
  const url = `${metaInformation.baseUrl}${o.url}`;
  const id = buildHash(o.id, o.price);
  const price = extractNumber(o.price);
  const location = {
    ...(o.address && { city: o.address })
  };
  return Object.assign(o, { id, size, url, price, location });
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
    size: '.aditem-main .text-module-end | removeNewline | trim',
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
  id: "kleinanzeigen",
};

export const init = (sourceConfig, blacklistTerms, blacklistedDistricts) => {
  config.enabled = sourceConfig.isActive;
  config.url = sourceConfig.url;
  appliedBlacklistedDistricts = blacklistedDistricts || [];
  appliedBlackList = blacklistTerms || [];
};

export { config };

