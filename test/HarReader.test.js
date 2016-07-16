'use strict';
const harReader = require('../src/HarReader'),
    path = require('path'),
    har = new harReader();


describe('HAR Reader', function () {
    it('should throw an error on files which don\'t exist', function () {
        console.log(__dirname + '/data/sample.har');
        har
            .readHar(path.resolve(__dirname, 'data/doesnt_exist.har'))
            .catch(function (data) {
                expect(data.code).toEqual('ENOENT');
            });
    });

    it('should be able to load a HAR file', function () {
        console.log('here');
        har
            .readHar('test/data/sample.har')
            .then((data) => {
                console.log(111);
                expect(har.parsedHar).not.toBe(null);
                done();
            })
            .catch(()=> {
                console.log(222);
                console.log('rejected');
                done();
            });
    });
});