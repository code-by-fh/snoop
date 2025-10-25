import utils, { buildHash, nullOrEmpty } from "../utils/utils.js";
import { extractNumber } from '../utils/numberParser.js';

let appliedBlackList = [];

function normalize(o) {
  const url = nullOrEmpty(o.url) ? 'NO LINK' : `${metaInformation.baseUrl}${o.url.substring(o.url.indexOf('/neubau'))}`;
  const id = buildHash(o.url, o.price);
  const price = extractNumber(o.price)
  const size = extractNumber(o.size)
  const rooms = extractNumber(o.rooms)
  return Object.assign(o, { id, url, price, size, rooms });
}

function applyBlacklist(o) {
  return !utils.isOneOf(o.title, appliedBlackList);
}

const config = {
  url: null,
  crawlContainer: '.col-12.mb-4',
  sortByDateParam: 'sort=newest',
  waitForSelector: '.nbk-section',
  crawlFields: {
    id: 'a@href',
    title: 'a@title | removeNewline | trim',
    url: 'a@href',
    rawAddress: '.nbk-project-card__description | removeNewline | trim',
    price: '.nbk-project-card__list li:nth-of-type(1) .nbk-project-card__spec-value | removeNewline | trim',
    size: '.nbk-project-card__list li:nth-of-type(2) .nbk-project-card__spec-value | removeNewline | trim',
    rooms: '.nbk-project-card__list li:nth-of-type(3) .nbk-project-card__spec-value | removeNewline | trim',
    imageUrl: ".swiper-slide img@src",
  },
  normalize: normalize,
  filter: applyBlacklist,
};

export const init = (sourceConfig, blacklistTerms) => {
  config.url = sourceConfig.url;
  appliedBlackList = blacklistTerms || [];
};

export const metaInformation = {
  name: "Neubau Kompass",
  baseUrl: "https://www.neubaukompass.de",
  id: "neubauKompass",
};

export { config };
