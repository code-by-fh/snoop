import logger from "#utils/logger.js";
import { markdown2Html } from "../../services/markdown.js";

import { Buffer } from "buffer";
import FormData from "form-data";

function getDefaultOrUnknown(value) {
  return value || "k.A.";
}

async function getImageBuffer(url) {
  try {
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);

    const arrayBuffer = await imageResponse.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    logger.error(error, `Error while fetching image`);
    return null;
  }
}

export const send = async ({ serviceName, listings, notificationAdapters }) => {
  const { token, user, device } = notificationAdapters.find((adapter) => adapter.id === config.id).fields;

  const results = await Promise.all(
    listings.map(async (newListing) => {
      const title = `${serviceName}: ${newListing.title}`;
      const message = `Address: ${newListing.address}\nSize: ${newListing.size}\nPrice: ${newListing.price}\nLink: ${newListing.url}`;

      const form = new FormData();
      form.append('token', token?.value?.trim());
      form.append('user', user?.value?.trim());
      form.append('title', title);
      form.append('message', message);
      if (device) form.append('device', device);

      // Try to attach image if available
      if (listings.image || listings.lazyImage) {
        const imageBuffer = await getImageBuffer(listings.image || listings.lazyImage);
        if (imageBuffer) form.append("attachment", imageBuffer, { filename: "image.jpg" });
      }

      const res = await fetch('https://api.pushover.net/1/messages.json', {
        method: 'POST',
        body: form,
      });

      return res.json();
    }),
  );

  const errors = results
    .map((r) => (r.errors && r.errors.length > 0 ? r.errors.join(', ') : null))
    .filter((e) => e !== null);

  if (errors.length > 0) {
    return Promise.reject(errors.join('; '));
  }

  return results;

};


export const config = {
  id: "pushover",
  name: "Pushover",
  readme: markdown2Html("notification/adapter/pushover.md"),
  description: "Pushover is being used to send new listings via Pushover Api.",
  fields: {
    token: {
      type: "text",
      label: "Token",
      description: "The token needed to access this service.",
    },
    user: {
      type: "text",
      label: "User",
      description: "The user needed to access this service.",
    },
  },
};
