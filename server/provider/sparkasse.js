import { isOneOf, buildHash } from '../utils/utils.js';
import { extractNumber } from '../utils/numberParser.js';

let appliedBlackList = [];

function normalize(o) {
    const originalId = o.id.split('/').pop().replace('.html', '');
    const id = buildHash(originalId, o.price);
    const size = extractNumber(o.size?.replace(' Wohnfläche', '')) ?? null;
    const price = extractNumber(o.price) ?? null;
    const title = o.title || 'No title available';
    const url = o.url != null ? `https://immobilien.sparkasse.de${o.url}` : config.baseUrl;
    return Object.assign(o, { id, size, title, url, price });
}
function applyBlacklist(o) {
    const titleNotBlacklisted = !isOneOf(o.title, appliedBlackList);
    const descNotBlacklisted = !isOneOf(o.description, appliedBlackList);
    return titleNotBlacklisted && descNotBlacklisted;
}
const config = {
    url: null,
    crawlContainer: '.estate-list-item-row',
    sortByDateParam: 'sortBy=date_desc',
    waitForSelector: 'body',
    crawlFields: {
        id: 'div[data-testid="estate-link"] a@href',
        title: 'h3 | trim',
        price: '.estate-list-price | trim',
        size: '.estate-mainfact:first-child span | trim',
        address: 'h6 | trim',
        imageUrl: '.estate-list-item-image-container img@src',
        url: 'div[data-testid="estate-link"] a@href',
    },
    normalize: normalize,
    filter: applyBlacklist,
};
export const init = (sourceConfig, blacklist) => {
    config.url = sourceConfig.url;
    appliedBlackList = blacklist || [];
};
export const metaInformation = {
    name: 'Sparkasse Immobilien',
    baseUrl: 'https://immobilien.sparkasse.de/',
    imageBaseUrl: 'https://api.immobilie1.de',
    id: 'sparkasse',
};
export { config };