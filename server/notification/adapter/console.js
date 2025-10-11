import { markdown2Html } from "../../services/markdown.js";

export const send = ({serviceName, listings, jobId}) => {
  return [Promise.resolve(console.info(`Found listings from provider ${serviceName}, Job: ${jobId}:\n ${JSON.stringify(listings, null, 2)}`))];
};

export const config = {
  id: "console",
  name: "Console",
  description: "This adapter sends new listings to the console. It is mostly useful for debugging.",
  config: {},
  readme: markdown2Html("notification/adapter/console.md"),
};
