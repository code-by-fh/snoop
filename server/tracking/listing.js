import { encrypt } from '#utils/crypt.js';

import { getTrackingBaseUrl } from './index.js';


export const getTrackingUrl = (listingId, userId) => {
    const payloadString = JSON.stringify({ listingId, userId });
    const encrypted = encrypt(payloadString);
    const encoded = encodeURIComponent(encrypted);

    return `${getTrackingBaseUrl()}/api/track/listing?data=${encoded}`;
};