'use strict';
const harReader = require('../src/HarReader'),
    har = new harReader();

describe('Reader', function () {
    it('should reject invalid JSON files', function () {
        let promise = har.readHar('data/json_wrong_format.har')
            .then((data)=> {
                console.log(1111);
            });
        promise.catch(function () {
            console.log(2);
        });
    });
    it('should be able to load a HAR file', function () {
        let promise = har.readHar('data/sample.har');
        promise
            .then(parsedHar => {
                expect(parsedHar).not.toBe(null)
            })
            .catch(()=> {
                console.log('rejected');
            });
    });
});