import logger from "#utils/logger.js";
import { Buffer } from "buffer";
import FormData from "form-data";
import { markdown2Html } from "../../services/markdown.js";
import fetch from "node-fetch";

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
  const { token, user, device } =
    notificationAdapters.find((adapter) => adapter.id === config.id).fields;

  const results = await Promise.all(
    listings.map(async (payload) => {
      try {
        const form = new FormData();
        form.append("token", token.value.trim());
        form.append("user", user.value.trim());
        if (device) form.append("device", device);

        if (payload.imageUrl || payload.lazyImage) {
          const imageBuffer = await getImageBuffer(payload.imageUrl || payload.lazyImage);
          if (imageBuffer) form.append("attachment", imageBuffer, { filename: "image.jpg" });
        }

        const address = getDefaultOrUnknown(payload.address);
        const price = getDefaultOrUnknown(payload.price);
        const size = getDefaultOrUnknown(payload.size);

        const msg = `${serviceName} | ${payload.title}\n\nAdresse: ${address} \nPreis: ${price} \nWohnfläche: ${size} \n\n${payload.trackingUrl}`;
        form.append("message", msg);

        const res = await fetch("https://api.pushover.net/1/messages.json", {
          method: "POST",
          body: form,
        });

        const contentType = res.headers.get("content-type") || "";

        if (!res.ok) {
          const text = await res.text();
          return { errors: [`HTTP ${res.status}: ${res.statusText}`], raw: text };
        }

        if (contentType.includes("application/json")) {
          return await res.json();
        } else {
          const text = await res.text();
          return { errors: ["Non-JSON response"], raw: text };
        }
      } catch (err) {
        logger.error(err, "Error while sending pushover notification");
        return { errors: [err.message] };
      }
    })
  );

  const errors = results
    .map((r) => (r.errors && r.errors.length > 0 ? r.errors.join(", ") : null))
    .filter((e) => e !== null);

  if (errors.length > 0) {
    logger.error(errors, `Error while sending pushover notification`);
    return Promise.reject(errors.join("; "));
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
