import Slack from "slack";
import { markdown2Html } from "../../services/markdown.js";

const msg = Slack.chat.postMessage;

export const send = ({ serviceName, newListings, notificationConfig, jobKey }) => {
  const { token, channel } = notificationConfig.find((adapter) => adapter.id === config.id).fields;
  return newListings.map((payload) =>
    msg({
      token,
      channel,
      text: `*(${serviceName} - ${jobKey})* - ${payload.title}`,
      attachments: [
        {
          fallback: payload.title,
          color: "#36a64f",
          title: "Link to Exposé",
          title_link: payload.link,
          fields: [
            {
              title: "Price",
              value: payload.price,
              short: false,
            },
            {
              title: "Size",
              value: payload.size,
              short: false,
            },
            {
              title: "Address",
              value: payload.address,
              short: false,
            },
          ],
          footer: "Powered by Snnop",
          ts: new Date().getTime() / 1000,
        },
      ],
    })
  );
};

export const config = {
  id: "slack",
  name: "Slack",
  readme: markdown2Html("notification/adapter/slack.md"),
  description: "Snoop will send new listings to the slack channel of your choice..",
  fields: {
    token: {
      type: "text",
      label: "Token",
      description: "The token needed to send notifications to slack.",
    },
    channel: {
      type: "text",
      label: "Channel",
      description: "The channel where Snoop should send notifications to.",
    },
  },
};
