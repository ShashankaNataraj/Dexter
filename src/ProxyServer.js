import Hapi from 'hapi';
class ProxyServer {
    constructor(port = 8000, host = 'localhost') {
        this.server = new Hapi.Server();
        this
            .server
            .connection({ host, port });
        return this;
    }
    addRoutes() { 
        server.route({ method: 'GET', path: '/test', handler: handler });
    }
    start() {
        this
            .server
            .start();
    }
    stop() {
        this
            .server
            .stop();
    }
    restart() {
        this.start();
        this.stop();
    }
    serveRequest() {}
}

export default new ProxyServer();