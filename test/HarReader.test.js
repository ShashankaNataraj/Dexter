'use strict';
const harReader = require('../src/HarReader'),
    path = require('path'),
    har = new harReader(),
    expect = require('chai').expect;


describe('HAR Reader', function () {
    it('should throw an error on files which don\'t exist', function () {
        return har
            .readHar(path.resolve(__dirname, 'data/doesnt_exist.har'))
            .catch(function (data) {
                expect(data.code).to.equal('ENOENT');
            });
    });

    it('should be able to load a HAR file', function () {
        return har
            .readHar('test/data/sample.har')
            .then((data) => {
                expect(har).to.have.property('parsedHar');
            });
    });
});