import { markdown2Html } from "../../services/markdown.js";
import logger from '#utils/logger.js';

export const send = ({ serviceName, newListings, jobKey }) => {
  return [Promise.resolve(logger.info(`Found entry from service ${serviceName}, Job: ${jobKey}:`, newListings))];
};

export const config = {
  id: "console",
  name: "Console",
  description: "This adapter sends new listings to the console. It is mostly useful for debugging.",
  config: {},
  readme: markdown2Html("notification/adapter/console.md"),
};
