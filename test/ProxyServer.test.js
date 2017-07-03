import ProxyServer from '../src/ProxyServer';

describe('ProxyServer', () => {
    it('Should be able to start an HTTP server');
    it('Should be able to stop the HTTP server');
    it('Should be able to restart the HTTP server');
    it('Should respond to a GET request to the root');
    it('Should respond with a 200 for routes that exist');
    it('Should respond with a 404 for routes that dont\'t exist');
});