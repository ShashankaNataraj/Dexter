'use strict';

const
    Dexter = require('../src/Dexter'),
    path = require('path'),
    expect = require('chai').expect,
    harPath = path.resolve(__dirname, 'test/data/sample.har');

describe('Dexter', ()=> {

    it('should accept a har file path', ()=> {
        let
            harServer = new Dexter(harPath);

        expect(harServer).to.have.property('_harPath');
        expect(harServer._harPath).to.equal(harPath);
    });

    it('should accept a port if specified', ()=> {
        let
            port = 3000,
            harServer = new Dexter(harPath, port);

        expect(harServer).to.have.property('_port');
        expect(harServer._port).to.equal(port);
    });

    it('should use a default port if none specified', ()=> {
        let
            harServer = new Dexter(harPath);

        expect(harServer).to.have.property('_port');
        expect(harServer._port).to.equal(1121);
    });

});