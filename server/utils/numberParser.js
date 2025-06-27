/**
 * Extracts a number from a string in either German or English number format.
 * Accepts formats like "1.234,56" (German) or "1,234.56" (English).
 * 
 * @param {string|null} input - The input string containing a number.
 * @returns {number|null} The parsed number, or null if none found.
 */
export function extractNumber(input) {
    if (typeof input !== 'string') return null;

    const match = input.match(/[\d,\.]+/);
    if (!match) return null;

    const numStr = match[0];

    const hasComma = numStr.includes(',');
    const hasDot = numStr.includes('.');

    let cleaned;

    if (hasComma && numStr.indexOf(',') > numStr.indexOf('.')) {
        cleaned = numStr.replace(/\./g, '').replace(',', '.');
    }

    else if (hasDot && numStr.indexOf(',') < numStr.indexOf('.') && hasComma) {
        cleaned = numStr.replace(/,/g, '');
    }

    else if (hasDot && !hasComma) {
        cleaned = numStr.replace(/\./g, '');
    }

    else {
        cleaned = numStr.replace(/,/g, '');
    }

    const result = parseFloat(cleaned);
    return isNaN(result) ? null : result;
}
