import fetch from "node-fetch";
import { markdown2Html } from "../../services/markdown.js";

const MAX_ENTITIES_PER_CHUNK = 8;
const RATE_LIMIT_INTERVAL = 1010;

/**
 * splitting an array into chunks because Telegram only allows for messages up to
 * 4096 chars, thus we have to split messages into chunks
 * @param inputArray
 * @param perChunk
 */
const arrayChunks = (inputArray, perChunk) =>
  inputArray.reduce((all, one, i) => {
    const ch = Math.floor(i / perChunk);
    all[ch] = [].concat(all[ch] || [], one);
    return all;
  }, []);

function shorten(str, len = 30) {
  return str.length > len ? str.substring(0, len) + "..." : str;
}

export const send = async ({ serviceName, listings, notificationAdapters, jobName }) => {
  const { token, chatId } = notificationAdapters.find((adapter) => adapter.id === config.id).fields;
  //we have to split messages into chunk, because otherwise messages are going to become too big and will fail
  const chunks = arrayChunks(listings, MAX_ENTITIES_PER_CHUNK);
  const promises = chunks.map((chunk) => {
    let message = `<i>${jobName}</i> (${serviceName}) found <b>${listings.length}</b> new listings:\n\n`;
    message += chunk.map(
      (o) => `<a href='${o.trackingUrl}'><b>${shorten(o.title.replace(/\*/g, ""), 45).trim()}</b></a>\n` + [o.address, o.price, o.size].join(" | ") + "\n\n"
    );
    /**
     * This is to not break the rate limit. It is to only send 1 message per second
     */
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "post",
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
          headers: { "Content-Type": "application/json" },
        })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      }, RATE_LIMIT_INTERVAL);
    });
  });
  return Promise.all(promises);
};

export const config = {
  id: "telegram",
  name: "Telegram",
  readme: markdown2Html("./notification/adapter/telegram.md"),
  description: "Fredy will send new listings to your mobile, using Telegram.",
  fields: {
    token: {
      type: "text",
      label: "Token",
      description: "The token needed to access this service.",
    },
    chatId: {
      type: "chatId",
      label: "Chat Id",
      description: "The chat id to send messages to you.",
    },
  },
};
