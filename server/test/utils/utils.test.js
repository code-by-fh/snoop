import { expect } from 'chai';
import { buildHash, duringWorkingHoursOrNotSet, timeStringToMsOfDay } from '../../utils/utils.js';

describe('utilsCheck', () => {
    describe('#utilsCheck()', () => {
        it('should be null when null input', () => {
            expect(buildHash(null)).to.be.null;
        });
        it('should be null when null empty', () => {
            expect(buildHash('')).to.be.null;
        });
        it('should return a value', () => {
            expect(buildHash('bla', '', null)).to.be.a.string;
        });
    });
});

function testDuring(config, timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const now = new Date();
    now.setHours(h, m, 0, 0);
    return duringWorkingHoursOrNotSet(config, now.getTime());
}

describe('timeUtils', () => {
    describe('timeStringToMsOfDay()', () => {
        it('should convert "00:00" to 86400000 (treated as end of day)', () => {
            expect(timeStringToMsOfDay('00:00')).to.equal(86400000);
        });

        it('should convert "06:00" to 21600000', () => {
            expect(timeStringToMsOfDay('06:00')).to.equal(21600000);
        });

        it('should convert "23:59" close to end of day', () => {
            expect(timeStringToMsOfDay('23:59')).to.equal(23 * 3600000 + 59 * 60000);
        });

        it('should handle invalid or empty string safely', () => {
            expect(timeStringToMsOfDay('')).to.equal(0);
            expect(timeStringToMsOfDay(null)).to.equal(0);
        });
    });

    describe('duringWorkingHoursOrNotSet()', () => {
        it('should return true if working hours not set', () => {
            expect(duringWorkingHoursOrNotSet({ workingHoursFrom: null, workingHoursTo: null })).to.be.true;
            expect(duringWorkingHoursOrNotSet({ workingHoursFrom: '', workingHoursTo: '' })).to.be.true;
        });

        it('should return true within normal working hours (e.g. 06:00–18:00 at 10:00)', () => {
            const config = { workingHoursFrom: '06:00', workingHoursTo: '18:00' };
            expect(testDuring(config, '10:00')).to.be.true;
        });

        it('should return false outside normal working hours (e.g. 06:00–18:00 at 23:00)', () => {
            const config = { workingHoursFrom: '06:00', workingHoursTo: '18:00' };
            expect(testDuring(config, '23:00')).to.be.false;
        });

        it('should return true at boundary start time', () => {
            const config = { workingHoursFrom: '06:00', workingHoursTo: '18:00' };
            expect(testDuring(config, '06:00')).to.be.true;
        });

        it('should return true at boundary end time', () => {
            const config = { workingHoursFrom: '06:00', workingHoursTo: '18:00' };
            expect(testDuring(config, '18:00')).to.be.true;
        });

        it('should handle overnight hours correctly (e.g. 22:00–06:00 at 23:30)', () => {
            const config = { workingHoursFrom: '22:00', workingHoursTo: '06:00' };
            expect(testDuring(config, '23:30')).to.be.true;
        });

        it('should handle overnight hours correctly (e.g. 22:00–06:00 at 03:00)', () => {
            const config = { workingHoursFrom: '22:00', workingHoursTo: '06:00' };
            expect(testDuring(config, '03:00')).to.be.true;
        });

        it('should return false for times outside overnight window (e.g. 22:00–06:00 at 12:00)', () => {
            const config = { workingHoursFrom: '22:00', workingHoursTo: '06:00' };
            expect(testDuring(config, '12:00')).to.be.false;
        });

        it('should interpret "06:00"–"00:00" as 06:00–24:00 (end of day)', () => {
            const config = { workingHoursFrom: '06:00', workingHoursTo: '00:00' };
            expect(testDuring(config, '07:00')).to.be.true; // morning
            expect(testDuring(config, '23:00')).to.be.true; // late evening
            expect(testDuring(config, '01:00')).to.be.false; // after midnight
        });

        it('should handle working hours spanning almost full day', () => {
            const config = { workingHoursFrom: '00:00', workingHoursTo: '00:00' };
            // special interpretation: full day
            expect(testDuring(config, '12:00')).to.be.true;
            expect(testDuring(config, '00:00')).to.be.true;
        });
    });
});