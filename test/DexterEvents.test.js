"use strict";

const
    path = require('path'),
    Dexter = require('../src/Dexter.js'),
    dexterServer = new Dexter(path.resolve(__dirname, 'test/data/sample.har')),
    expect = require('chai').expect;

describe('Events', () => {
    it('should raise an event for startup', () => {

        dexterServer.on('startupSuccess',(port)=>{
            assert(false);
            done();
        });
    });
    dexterServer.startUp();

    after(() => {
        dexterServer.tearDown();
    });
});