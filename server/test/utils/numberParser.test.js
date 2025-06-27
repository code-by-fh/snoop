import { expect } from 'chai';
import { extractNumber } from '../../utils/numberParser.js';

describe('extractNumber', () => {
    it('should extract number from German format', () => {
        expect(extractNumber('1.234,56 m²')).to.equal(1234.56);
        expect(extractNumber('12.345')).to.equal(12345);
        expect(extractNumber('31,25')).to.equal(31.25);
    });

    it('should extract integer values', () => {
        expect(extractNumber('500 m²')).to.equal(500);
        expect(extractNumber('1000')).to.equal(1000);
        expect(extractNumber('2,5')).to.equal(2.5);
    });

    it('should return null on invalid or missing input', () => {
        expect(extractNumber(null)).to.equal(null);
        expect(extractNumber(undefined)).to.equal(null);
        expect(extractNumber('keine zahl')).to.equal(null);
        expect(extractNumber('')).to.equal(null);
    });

    it('should handle mixed non-number input', () => {
        expect(extractNumber('abc 123,45 xyz')).to.equal(123.45);
        expect(extractNumber('abc 1.234,00 xyz')).to.equal(1234.00);
    });
});
