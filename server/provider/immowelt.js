import utils, { buildHash } from '../utils/utils.js';
import { extractNumber } from '../utils/numberParser.js';

let appliedBlackList = [];

function normalize(o) {
  const id = buildHash(o.id, o.price);
  const url = o.url ? new URL(o.url).origin + new URL(o.url).pathname : null;
  const [rooms, size] = (o.size || "").split("·").map(v => v.trim()).map(v => extractNumber(v))
  const [street, district, city] = (o.address || "").split(",").map(v => v.trim())
  const location = {
    ...(street && { street }),
    ...city && { city }
  };
  const price = extractNumber(o.price)
  return Object.assign(o, { id, url, price, rooms, size, location });
}

function applyBlacklist(o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, appliedBlackList);
  const descNotBlacklisted = !utils.isOneOf(o.description, appliedBlackList);
  return titleNotBlacklisted && descNotBlacklisted;
}

const config = {
  url: null,
  crawlContainer:
    'div[data-testid="serp-core-scrollablelistview-testid"]:not(div[data-testid="serp-enlargementlist-testid"] div[data-testid="serp-card-testid"]) div[data-testid="serp-core-classified-card-testid"]',
  sortByDateParam: "order=DateDesc",
  waitForSelector: 'div[data-testid="serp-gridcontainer-testid"]',
  crawlFields: {
    id: 'a@href',
    price: 'div[data-testid="cardmfe-price-testid"] | removeNewline | trim',
    size: 'div[data-testid="cardmfe-keyfacts-testid"] | removeNewline | trim',
    title: 'div[data-testid="cardmfe-description-box-text-test-id"]  div:nth-child(2) | removeNewline | trim',
    url: 'a@href',
    address: 'div[data-testid="cardmfe-description-box-address"] | removeNewline | trim',
    imageUrl: 'div[data-testid="card-mfe-picture-box-gallery-thumbnail-test-id"] img@src'
  },
  normalize: normalize,
  filter: applyBlacklist,
};

export const init = (sourceConfig, blacklistTerms) => {
  config.url = sourceConfig.url;
  appliedBlackList = blacklistTerms || [];
};

export const metaInformation = {
  name: "Immowelt",
  baseUrl: "https://www.immowelt.de",
  imageBaseUrl: "https://mms.immowelt.de",
  id: "immowelt",
};

export { config };
