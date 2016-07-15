const harReader = require('../src/HarReader'),
    har = new harReader();
describe('Reader', function () {
    it('should be able to load a HAR file', function () {
        har.readHar('data/sample.har');
        expect(har.parsedHar).not.toBe(null);
    });
});