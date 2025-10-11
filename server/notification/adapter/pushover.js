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

export const send = ({ serviceName, listings, notificationAdapters }) => {
  const { token, user } = notificationAdapters.find((adapter) => adapter.id === config.id).fields;
  return listings.map(async (payload, index) => {
    const form = new FormData();
    form.append("token", token);
    form.append("user", user);

    if (payload.image || payload.lazyImage) {
      const imageBuffer = await getImageBuffer(payload.image || payload.lazyImage);
      if (imageBuffer) form.append("attachment", imageBuffer, { filename: "image.jpg" });
    }

    const address = getDefaultOrUnknown(payload.address);
    const price = getDefaultOrUnknown(payload.price);
    const size = getDefaultOrUnknown(payload.size);
    const description = getDefaultOrUnknown(payload.description);

    const msg = `${serviceName} | ${payload.title}\n\nAdresse: ${address} \nPreis: ${price} \nWohnfläche: ${size} \n\nBeschreibung: ${description}\n\n${payload.link}`;

    form.append("message", msg);

    /**
     * This is to not break the rate limit. It is to only send 1 message per second
     */

    setTimeout(async () => {
      try {
        const response = await fetch("https://api.pushover.net/1/messages.json", {
          method: "POST",
          body: form,
          headers: form.getHeaders(),
        });
        if (response.ok) {
          const jsonResponse = await response.json();
          logger.info(`Message sent successfully: ${jsonResponse}`,);
        }
      } catch (error) {
        logger.error(error, "Error sending message to Pushover:");
      }
    }, 1000 * index);
  });
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
