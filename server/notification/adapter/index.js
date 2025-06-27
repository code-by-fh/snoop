import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const adapterDir = path.join(__dirname, './');

const notificationAdapters = {};

const notificationAdapterFiles = fs.readdirSync(adapterDir).filter(file => file.endsWith('.js') && file !== 'index.js');

for (const file of notificationAdapterFiles) {
  const modulePath = path.join(adapterDir, file);
  const moduleUrl = url.pathToFileURL(modulePath).href;
  const adapterModule = await import(moduleUrl);
  const adapterName = path.basename(file, '.js');
  notificationAdapters[adapterName] = adapterModule.default || adapterModule;
}

export function getAvailableNotificators() {
  return notificationAdapters;
}
