'use strict';

const
    Dexter = require('../src/Dexter'),
    path = require('path'),
    expect = require('chai').expect,
    harPath = path.resolve(__dirname, 'test/data/sample.har'),
    DexterException = require('../src/DexterException');

describe('Dexter', () => {

    it('should accept a har file path', () => {
        let
            harServer = new Dexter(harPath, 1121);

        expect(harServer).to.have.property('_harPath');
        expect(harServer._harPath).to.equal(harPath);
    });


    it('should throw an exception if no port is specified', () => {
        try {
            let harServer = new Dexter(harPath);
        }catch(ex){
            expect(ex).to.have.property('name');
            expect(ex.name).to.equal('InvalidPort');
        }
    });

    it('should accept a port if specified', () => {
        let
            port = 3000,
            harServer = new Dexter(harPath, port);

        expect(harServer).to.have.property('_port');
        expect(harServer._port).to.equal(port);
    });

});