'use strict';

/**
 * Requires and consts
 * */
const
    express = require('express'),
    path = require('path'),
    EventEmitter = require('events').EventEmitter,
    harReader = require(__dirname + '/HarReader'),
    HarUtils = require(__dirname + '/HarUtils');

const
    utils = new HarUtils();

class Dexter extends EventEmitter {
    constructor(harPath, port) {
        super();
        this._app = express();
        this._port = port || 1121;
        this._har = new harReader();
        this._harPath = harPath;
    }

    /**
     * Handles entire server startup process (aka Ooh what does this button do)
     * */
    startUp() {
        this.attachMethodHandlers();
        this.attachCustomRoutes();
        this.startServer();
        return this;
    }

    /**
     * Start listening
     * */
    startServer() {
        this.server = this._app.listen(this._port, () => { //Start the server and listen on a port
            this._har.readHar(this._harPath);
            this.emit('startupSuccess', this._port);
        });
    }

    /**
     * Attaches HTTP method handlers to incoming requests
     * */
    attachMethodHandlers() {
        this._app.all('/*', (request, response) => {
            this.genericHandler(request, response, request.method);
        });
    }

    /**
     * Generic handler for all HTTP methods
     * */
    genericHandler(request, response, method) {
        let
            storedResponse,
            url = request.url;

        this.emit('receivedRequest', url);
        try {
            if (url === '/') { // If this is a root request, just send out a 200 and be done with it
                response.statusCode = 200;
                response.end();
            } else { // Try to serve if this is a genuine request
                storedResponse = this._har.getResponseForUrl(request.url, method);
            }
        } catch (e) {
            this.emit('noEntryInHar', url);
            response.statusCode = 404;
            response.end();
        }
        if (typeof storedResponse !== 'undefined') {
            this.emit('foundHarEntry', url);
            // Set the status
            response.status(storedResponse.status);

            // Set the headers
            let headers = utils.filterHeaders(storedResponse.headers);
            headers.forEach((header) => {
                response.setHeader(header.name, header.value)
            });

            // Set Cookies
            storedResponse.cookies.forEach((cookie) => {
                response.cookie(
                    cookie.name,
                    cookie.value,
                    utils.processCookie(cookie)
                );
            });

            // Send the text content
            response.send(storedResponse.content.text);
            this.emit('requestServedSuccessfully');
            response.end();
        }
    }

    attachCustomRoutes() {
        this._app.get('/', function (request, response) {
            response.statusCode = 200;
            request.json({ message: 'hooray! welcome to our api!' });
            response.end();
        });
        this._app.all('/404', (request, response) => {
            response.statusCode = 404;
            response.send('404');
            response.end();
        });
    }

    /**
     * Dee Dee :O
     * */
    tearDown() {
        this.server.close();
        this.emit('shutdownSuccess', this._port);
    }
}

module.exports = Dexter;