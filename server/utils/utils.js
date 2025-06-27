import { createHash } from 'crypto';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

function inDevMode() {
    return process.env.NODE_ENV == null || process.env.NODE_ENV !== 'production';
}

function isOneOf(word, arr) {
    if (arr == null || arr.length === 0) {
        return false;
    }
    const expression = String.raw`\b(${arr.join('|')})\b`;
    const blacklist = new RegExp(expression, 'ig');
    return blacklist.test(word);
}

function nullOrEmpty(val) {
    return val == null || val.length === 0;
}

function timeStringToMs(timeString, now) {
    const d = new Date(now);
    const parts = timeString.split(':');
    d.setHours(parts[0]);
    d.setMinutes(parts[1]);
    d.setSeconds(0);
    return d.getTime();
}

function duringWorkingHoursOrNotSet(config, now) {
    const { workingHoursFrom, workingHoursTo } = config;
    if (nullOrEmpty(workingHoursFrom) || nullOrEmpty(workingHoursTo)) {
        return true;
    }
    const toDate = timeStringToMs(workingHoursTo, now);
    const fromDate = timeStringToMs(workingHoursFrom, now);
    return fromDate <= now && toDate >= now;
}

function getDirName() {
    return dirname(fileURLToPath(import.meta.url));
}

function buildHash(...inputs) {
    if (!inputs || inputs.length === 0) return null;

    const cleaned = inputs
        .filter(i =>
            i !== null &&
            i !== undefined &&
            !(typeof i === 'string' && i.trim() === '') &&
            !(Array.isArray(i) && i.length === 0)
        )
        .map(i => typeof i === 'object' ? JSON.stringify(i) : String(i));

    if (cleaned.length === 0) return null;

    return createHash('sha256')
        .update(cleaned.join(','))
        .digest('hex');
}

export { buildHash, duringWorkingHoursOrNotSet, getDirName, inDevMode, isOneOf, nullOrEmpty };
export default {
    isOneOf,
    nullOrEmpty,
    duringWorkingHoursOrNotSet,
    getDirName,
};