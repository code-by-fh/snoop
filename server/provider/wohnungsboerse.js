import { extractNumber } from '../utils/numberParser.js';
import utils from "../utils/utils.js";

let appliedBlackList = [];

function normalize(o) {
  const id = o.url.split("/").pop();
  const price = extractNumber(o.price);
  const size = extractNumber(o.size);
  const rooms = extractNumber(o.rooms)
  const [city] = (o.details || "").split("-").map(v => v.trim())
  const rawAddress = city?.trim();
  return Object.assign(o, { id, price, size, rooms, rawAddress });
}

function applyBlacklist(o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, appliedBlackList);
  const descNotBlacklisted = !utils.isOneOf(o.description, appliedBlackList);
  return o.id != null && o.title != null && titleNotBlacklisted && descNotBlacklisted && o.url.startsWith(o.url);
}

const config = {
  url: null,
  sortByDateParam: null,
  waitForSelector: 'body',
  crawlContainer: ".search_result_container > a",
  crawlFields: {
    id: "@class",
    title: "h3 | trim",
    price: "dl:nth-of-type(1) dd | removeNewline | trim",
    rooms: "dl:nth-of-type(2) dd | removeNewline | trim",
    size: "dl:nth-of-type(3) dd | removeNewline | trim",
    details: "div.before\\:icon-location_marker | trim",
    url: "@href",
    imageUrl: "img@src"
  },
  normalize: normalize,
  filter: applyBlacklist
};

export const init = (sourceConfig, blacklistTerms) => {
  config.url = sourceConfig.url;
  appliedBlackList = blacklistTerms || [];
};

export const metaInformation = {
  name: "Wohnungsboerse",
  baseUrl: "https://www.wohnungsboerse.net",
  id: "wohnungsboerse",
};

export { config };

