import utils, { buildHash } from '../utils/utils.js';
import { extractNumber } from '../utils/numberParser.js';

let appliedBlackList = [];

function normalize(o) {
  const url = `${metaInformation.baseUrl}/expose/${o.id}.html`;
  const price = extractNumber(o.price);
  const size = extractNumber(o.size);
  const imageUrl = o.imageUrl ? `${metaInformation.baseUrl}${o.imageUrl}` : null;
  const id = buildHash(o.id, price);
  const rooms = extractNumber(o.rooms)
  return Object.assign(o, { id, price, url, imageUrl, size, rooms });
}

function applyBlacklist(o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, appliedBlackList);
  const descNotBlacklisted = !utils.isOneOf(o.description, appliedBlackList);
  return titleNotBlacklisted && descNotBlacklisted;
}

const config = {
  url: null,
  crawlContainer: '.tabelle',
  sortByDateParam: 'sort_type=newest',
  waitForSelector: 'body',
  crawlFields: {
    id: '.inner_object_data input[name="marker_objekt_id"]@value | int',
    price: '.inner_object_data .single_data_price | removeNewline | trim',
    size: '.tabelle .tabelle_inhalt_infos .single_data_box:first-of-type  | removeNewline | trim',
    rooms: '.tabelle .tabelle_inhalt_infos .single_data_box:nth-of-type(2)  | removeNewline | trim',
    title: '.inner_object_data .tabelle_inhalt_titel_black | removeNewline | trim',
    imageUrl: ".tabelle .inner_object_pic img@src",
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
  name: "1a Immobilien",
  baseUrl: "https://www.1a-immobilienmarkt.de",
  id: "einsAImmobilien",
};

export { config };
