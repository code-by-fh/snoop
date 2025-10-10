import { markdown2Html } from "../../services/markdown.js";

export const send = ({ serviceName, newListings, jobId }) => {
  return [Promise.resolve(console.info(`Found listings from provider ${serviceName}, Job: ${jobId}:\n ${JSON.stringify(newListings, null, 2)}`))];
};

export const config = {
  id: "console",
  name: "Console",
  description: "This adapter sends new listings to the console. It is mostly useful for debugging.",
  config: {},
  readme: markdown2Html("notification/adapter/console.md"),
};
