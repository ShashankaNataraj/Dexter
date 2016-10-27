'use strict';
const
    harReader = require('../src/HarReader'),
    path = require('path'),
    expect = require('chai').expect,
    harPathInvalidFile = path.resolve(__dirname, 'test/data/doesnt_exist.har'),
    harPathIncorrectFileFormat = path.resolve(__dirname, 'test/data/json_wrong_format.har');


describe('HAR Reader', () => {

    it('should throw an error if file path is not specified', () => {
        let har;
        try {
            har = new harReader();
            console.log('here');
        } catch (ex) {
            expect(ex).to.have.property('name');
            expect(ex.name).to.equal('InvalidHARPath');
        }
    });

    it('should throw an error if the specified file is not a valid HAR file', () => {
        let har;
        try {
            har = new harReader(harPathIncorrectFileFormat);
        } catch (ex) {
            expect(ex).to.have.property('name');
            expect(ex.name).to.equal('InvalidHARFormat');
        }
    });
});