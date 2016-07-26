"use strict";

const
    path = require('path'),
    Dexter = require('../src/Dexter.js'),
    dexterServer = new Dexter(path.resolve(__dirname, 'test/data/sample.har')),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = require('chai').expect,
    serverAddress = 'http://127.0.0.1:1121';

chai.use(chaiHttp);

describe('Dexter Events', () => {

    it('should raise an event for startup', (done) => {
        dexterServer.once('startupSuccess', (port)=> {
            expect(port).to.equal(1121);
            done();
        });
        dexterServer.startUp();
    });

    it('should raise an event for received requests', (done)=> {
        dexterServer.once('receivedRequest', (url)=> {
            expect(url).to.equal('/');
            done();
        });
        chai.request(serverAddress)
            .get('/')
            .end();
    });

    it('should raise an event if no entries are found in the HAR file for the URL supplied', function (done) {
        let
            route = '/randomRouteThatDoesntExist';

        dexterServer.once('noEntryInHar', (url)=> {
            expect(url).to.equal(route);
            done();
        });
        chai.request(serverAddress)
            .get(route)
            .end();
    });
    
    it('should raise an event after shutting down successfully', (done)=> {
        dexterServer.once('shutdownSuccess', (port)=> {
            expect(port).to.equal(1121);
            done();
        });
        dexterServer.tearDown();
    });

});