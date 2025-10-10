import { markdown2Html } from "../../services/markdown.js";
import fetch from "node-fetch";
import logger from "#utils/logger.js";

const RATE_LIMIT_INTERVAL = 1010;

const TEMPLATE = {
  to: "",
  messaging_product: "whatsapp",
  type: "template",
  template: {
    name: "f_scout",
    language: {
      code: "de",
    },
    components: [
      {
        type: "body",
        parameters: "",
      },
    ],
  },
};

//as a parameter, you will always get the serviceName, newListings and all the values, that
//you have defined exports.config.fields. (This is being used for rendering in the frontend)
export const send = ({ serviceName, newListings, notificationConfig }) => {
  const { receivers } = notificationConfig.find((adapter) => adapter.id === config.id).fields;
  return newListings.map((payload) => {
    const promises = receivers
      .trim()
      .split(",")
      .map((receiver) => {
        const data = {
          to: receiver,
          messaging_product: "whatsapp",
          type: "template",
          template: {
            name: "f_scout",
            language: {
              code: "de",
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: serviceName,
                  },
                  {
                    type: "text",
                    text: payload.title,
                  },
                  {
                    type: "text",
                    text: payload.address,
                  },
                  {
                    type: "text",
                    text: `${payload.link}`,
                  },
                ],
              },
            ],
          },
        };

        var config = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WHATS_APP_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };

        
        /**
         * This is to not break the rate limit. It is to only send 1 message per second
         */
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            fetch(process.env.WHATS_APP_API_URL, config)
              .then((response) => logger.info(JSON.stringify(response.json())))
              .catch((err) => logger.error(err));
          }, RATE_LIMIT_INTERVAL);
        });
      });
      return Promise.all(promises);

  });
};

export const config = {
  id: "whatsapp",
  name: "WhatsApp",
  //this readme is rendered in the frontend to explain how to use this
  readme: markdown2Html("./notification/adapter/whatsapp.md"),
  description: "WhatsApp is being used to send new listings via WhatsApp Cloud Api.",
  fields: {
    receivers: {
      type: "text",
      label: "Receiver Phonenumbers (comma sperated)",
      description: "The phone numbers (comma sperated) which Fredy is using to send notifications to.",
    },
  },
};
