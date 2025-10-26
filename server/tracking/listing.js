import { encrypt } from '#utils/crypt.js';

export const getTrackingUrl = (listingId, userId) => {
    const payloadString = JSON.stringify({ listingId, userId });
    const encrypted = encrypt(payloadString);
    const encoded = encodeURIComponent(encrypted);

    return `http://localhost:5000/api/track/listing?data=${encoded}`;
};