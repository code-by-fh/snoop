import { extractNumber } from '../utils/numberParser.js';
import { buildHash, isOneOf } from '../utils/utils.js';

let appliedBlackList = [];

function normalize(o) {
  const originalId = o.id.split('/').pop();
  const id = buildHash(originalId, o.price);
  const size = o.size ? extractNumber(o.size.split("|")[1].trim()) : null;
  const rooms = o.size ? extractNumber(o.size.split("|")[0].trim()) : null;
  const title = o.title || 'No title available';
  const rawAddress = o.rawAddress?.replace(' / ', ' ') || null;
  const url = o.url != null ? `https://www.mcmakler.de${o.url}` : config.url;
  return Object.assign(o, { id, size, title, url, rawAddress, rooms });
}
function applyBlacklist(o) {
  const titleNotBlacklisted = !isOneOf(o.title, appliedBlackList);
  const descNotBlacklisted = !isOneOf(o.description, appliedBlackList);
  return titleNotBlacklisted && descNotBlacklisted;
}
const config = {
  url: null,
  crawlContainer: 'article[data-testid="propertyCard"]',
  sortByDateParam: 'sortBy=DATE&sortOn=DESC',
  waitForSelector: 'ul[data-testid="listsContainer"]',
  crawlFields: {
    id: 'h2 a@href',
    title: 'h2 a | removeNewline | trim',
    price: 'footer > p:first-of-type | parseNumber',
    size: 'footer > p:nth-of-type(2) | trim',
    rooms: 'footer > p:nth-of-type(2) | trim',
    rawAddress: 'div > h2 + p | removeNewline | trim',
    imageUrl: 'img@src',
    url: 'h2 a@href',
  },
  normalize: normalize,
  filter: applyBlacklist,
};
export const init = (sourceConfig, blacklist) => {
  config.url = sourceConfig.url;
  appliedBlackList = blacklist || [];
};
export const metaInformation = {
  name: 'McMakler',
  baseUrl: 'https://www.mcmakler.de/immobilien/',
  imageBaseUrl: 'https://images.mcmakler.de',
  id: 'mcMakler',
};
export { config };
