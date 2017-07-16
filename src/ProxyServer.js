import Hapi from "hapi";
class ProxyServer {
    constructor(port = 8000, host = 'localhost'){
        this.server = new Hapi.Server();
        this
            .server
            .connection({host, port});
        this.addRoutes();
        return this;
    }

    addRoutes(){
        this.server.route({
            method: 'GET', path: '/test', handler: function (request, reply){
                reply('Hello World');
            }
        });
    }

    start(){
        this
            .server
            .start();
    }

    stop(){
        this
            .server
            .stop();
    }

    restart(){
        this.start();
        this.stop();
    }

    serveRequest(){
    }
}

export default new ProxyServer();