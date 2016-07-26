"use strict";

const
    path = require('path'),
    Dexter = require('../src/Dexter.js'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = chai.expect,
    dexterServer = new Dexter(path.resolve(__dirname, 'test/data/sample.har')),
    serverAddress = 'http://127.0.0.1:1121';

chai.use(chaiHttp);

describe('Rest API', () => {
    before(() => {
        dexterServer.startUp();
    });

    it('should be able to access root path', (done) => {
        chai.request(serverAddress)
            .get('/')
            .end((err, response) => {
                expect(response.status).to.equal(200);
                done();
            });
    });

    it('should respond with 404 for routes not found', (done)=> {
        chai.request(serverAddress)
            .get('/randomRouteThatDoesntExist')
            .end(function (err, response) {
                expect(response.status).to.equal(404);
                done();
            });
    });

    after(() => {
        dexterServer.tearDown();
    });
});