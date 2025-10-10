import fs from 'fs';
import path from 'path';
import url from 'url';
import logger from "../utils/logger.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const providerDir = path.join(__dirname, './');

const providerMap = {};

const providerFiles = fs
  .readdirSync(providerDir)
  .filter(file => file.endsWith('.js') && file !== 'index.js');

for (const file of providerFiles) {
  const modulePath = path.join(providerDir, file);
  const moduleUrl = url.pathToFileURL(modulePath).href;

  try {
    const providerModule = await import(moduleUrl);
    const providerId = providerModule.metaInformation?.id;

    if (providerId) {
      providerMap[providerId] = providerModule;
    } else {
      logger.warn(`Provider "${file}" does not export a valid metaInformation.id`);
    }
  } catch (err) {
    logger.error(err, `Failed to load provider "${file}"`);
  }
}

export function getAvailableProviders() {
  return providerMap;
}
