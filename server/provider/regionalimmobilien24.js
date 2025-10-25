import { extractNumber } from '../utils/numberParser.js';
import { buildHash, isOneOf } from '../utils/utils.js';

let appliedBlackList = [];

function normalize(o) {
  const id = buildHash(o.id, o.price);
  const rawAddress = o.rawAddress?.replace(/^adresse /i, '') ?? null;
  const title = o.title || 'No title available';
  const link = o.link != null ? decodeURIComponent(o.link) : config.url;
  const price = extractNumber(o.price) ?? null;
  const size = extractNumber(o.size) ?? null;
  var urlReg = new RegExp(/url\((.*?)\)/gim);
  const imageUrl = o.imageUrl != null ? urlReg.exec(o.imageUrl)[1] : null;
  return Object.assign(o, { id, rawAddress, title, link, imageUrl, price, size });
}
function applyBlacklist(o) {
  const titleNotBlacklisted = !isOneOf(o.title, appliedBlackList);
  const descNotBlacklisted = !isOneOf(o.description, appliedBlackList);
  return titleNotBlacklisted && descNotBlacklisted;
}
const config = {
  url: null,
  crawlContainer: '.listentry-content',
  sortByDateParam: null, // sort by date is standard
  waitForSelector: 'body',
  crawlFields: {
    id: '.listentry-iconbar-share@data-sid | trim',
    title: 'h2 | trim',
    price: '.listentry-details-price .listentry-details-v | trim',
    size: '.listentry-details-size .listentry-details-v | trim',
    rawAddress: '.listentry-adress | trim',
    imageUrl: '.listentry-img@style',
    url: '.shariff@data-url',
    description: '.listentry-extras | trim',
  },
  normalize: normalize,
  filter: applyBlacklist,
};
export const init = (sourceConfig, blacklist) => {
  config.url = sourceConfig.url;
  appliedBlackList = blacklist || [];
};
export const metaInformation = {
  name: 'Regionalimmobilien24',
  baseUrl: 'https://www.regionalimmobilien24.de/',
  imageBaseUrl: 'https://bilder.regionalimmobilien24.de',
  id: 'regionalimmobilien24',
};
export { config };
