import fetch from "node-fetch";
import { markdown2Html } from "../../services/markdown.js";

export const send = async ({ serviceName, listings, notificationAdapters, jobName }) => {
  const { webhook, channel } = notificationAdapters.find((adapter) => adapter.id === config.id).fields;

  let message = `### *${jobName}* (${serviceName}) found **${listings.length}** new listings:\n\n`;
  message += `| Title | Address | Size | Price |\n|:----|:----|:----|:----|\n`;
  message += listings.map((o) => `| [${o.title}](${o.link}) | ` + [o.address, o.size.replace(/2m/g, "$m^2$"), o.price].join(" | ") + " |\n");
  return fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      channel: channel,
      text: message,
    },
  });
};

export const config = {
  id: "mattermost",
  name: "Mattermost",
  readme: markdown2Html("./notification/adapter/mattermost.md"),
  description: "Fredy will send new listings to your mattermost team chat.",
  fields: {
    webhook: {
      type: "text",
      label: "Webhook-URL",
      description: "The incoming webhook url",
    },
    channel: {
      type: "text",
      label: "Channel",
      description: "The channel where fredy should send notifications to.",
    },
  },
};
