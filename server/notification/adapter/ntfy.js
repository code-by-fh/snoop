import fetch from "node-fetch";
import { markdown2Html } from "../../services/markdown.js";

export const send = ({ serviceName, listings, notificationAdapters, jobName }) => {
  const { priority, server, topic } = notificationAdapters.find((adapter) => adapter.id === config.id).fields;

  const promises = listings.map((newListing) => {
    const message = `Address: ${newListing.address} Size: ${newListing.size.replace(/2m/g, "$m^2$")} Price: ${newListing.price}`;
    return fetch(server, {
      method: "POST",
      body: JSON.stringify({
        topic: topic,
        message: message,
        title: newListing.title,
        tags: [serviceName, jobName],
        priority: parseInt(priority),
        click: newListing.trackingUrl,
      }),
    });
  });

  return Promise.all(promises);
};

export const config = {
  id: "ntfy",
  name: "ntfy",
  readme: markdown2Html("./notification/adapter/ntfy.md"),
  description: "Fredy will send new listings to your ntfy.",
  fields: {
    priority: {
      type: "number",
      label: "Priority",
      description: "The priority of the send notification.",
    },
    server: {
      type: "text",
      label: "Server-URL",
      description: "The server url to the send the notification to.",
    },
    topic: {
      type: "text",
      label: "topic",
      description: "The topic where fredy should send notifications to. The topic is a secret, only known to you, make sure it is something not generic.",
    },
  },
};