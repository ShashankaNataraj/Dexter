const Dexter = require('../src/Dexter.js'),
    dexterServer = new Dexter(path.resolve(__dirname, 'test/data/doesnt_exist.har'));

describe('Rest API', () => {
    before(() => {
        dexterServer.startUp();
    });

    it('should\'ve started the server', function () {

    });

    after(() => {
        dexterServer.tearDown();
    });
});