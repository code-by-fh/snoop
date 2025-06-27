import { extractNumber } from '../utils/numberParser.js';
import utils, { buildHash } from "../utils/utils.js";

let appliedBlackList = [];

function normalize(o) {
  const urlParts = o.url.split("/");
  const id = buildHash(urlParts[urlParts.length - 2]);
  const url = `${metaInformation.baseUrl}${o.url}`;
  const price = extractNumber(o.price);
  const size = extractNumber(o.size);
  const location = {
    ...(o.address && { city: o.address })
  };
  return Object.assign(o, { id, url, price, size, location });
}

function applyBlacklist(o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, appliedBlackList);
  const descNotBlacklisted = !utils.isOneOf(o.description, appliedBlackList);
  return o.id != null && o.title != null && o.url && titleNotBlacklisted && descNotBlacklisted && o.url.startsWith(o.url);
}

const config = {
  url: null,
  crawlContainer: "div[id^='bookmark_']",
  sortByDateParam: "",
  waitForSelector: "div[id^='bookmark_']",
  crawlFields: {
    id: "a@href",
    price: "span.text-primary-500 | removeNewline | trim",
    size: "div[title='Wohnfläche'] span | removeNewline | trim",
    address: "div.text-slate-800 span | removeNewline | trim",
    title: "h4 | removeNewline | trim",
    url: "a@href",
    imageUrl: "img@src"
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
  name: "OhneMakler",
  baseUrl: "https://www.ohne-makler.net",
  id: "OhneMakler",
};

export { config };

