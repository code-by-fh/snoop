import logger from "../../utils/logger.js";
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
    LOG.error(`Error while fetching image: ${error.message}`);
    return null;
  }
}

export const send = ({ serviceName, newListings, notificationConfig }) => {
  return newListings.map(async (payload, index) => {
    const form = new FormData();
    form.append("token", process.env.PUSHOVER_TOKEN);
    form.append("user", process.env.PUSHOVER_USER);

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
          LOG.info("Message sent successfully:", jsonResponse);
        }
      } catch (error) {
        LOG.error("Error sending message to Pushover:", error);
      }
    }, 1000 * index);
  });
};

export const config = {
  id: "pushover",
  name: "Pushover",
  description: "Pushover is being used to send new listings via Pushover Api.",
  config: {},
  readme: markdown2Html("notification/adapter/pushover.md"),
};
