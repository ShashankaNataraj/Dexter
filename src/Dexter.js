'use strict';

const
    express = require('express'),
    path = require('path'),
    EventEmitter = require('events').EventEmitter,
    harReader = require(__dirname + '/HarReader'),
    HarUtils = require(__dirname + '/HarUtils'),
    utils = new HarUtils();

/**
 * 
 * 
 * @class Dexter
 * @extends {EventEmitter}
 */
class Dexter extends EventEmitter {

    /**
     * Creates an instance of Dexter.
     * 
     * @param {string} harPath
     * @param {any} port
     */
    constructor(harPath, port) {
        super();
        this._app = express();
        this._port = port;
        this._har = new harReader();
        this._harPath = harPath;
    }
    /**
     * 
     * @description Handles entire server startup process (aka Ooh what does this button do)
     * @returns Dexter
     */
    startUp() {
        this.attachMethodHandlers();
        this.attachCustomRoutes();
        this.startServer();
        return this;
    }

    /**
     * @description Start listening to incoming requests
     */
    startServer() {
        this.server = this._app.listen(this._port, () => { //Start the server and listen on a port
            this._har.readHar(this._harPath);
            this.emit('startupSuccess', this._port);
        });
    }

    /**
     * @description Attaches HTTP method handlers to incoming requests
     */
    attachMethodHandlers() {
        this._app.all('/*', (request, response) => {
            this.genericHandler(request, response, request.method);
        });
    }

    /**
     * 
     * 
     * @param {any} response
     * @param {any} storedResponse
     * @description Sets the HTTP status code to an incoming request, reads status codes from the HAR file for the corresponding response
     */
    setStatus(response, storedResponse) {
        response.status(storedResponse.status);
    }

    /**
     * 
     * 
     * @param {object} response
     * @param {object} storedResponse
     * @description Sets headers to an incoming request, reads status codes from the HAR file for the corresponding response
     */
    setHeaders(response, storedResponse) {
        let headers = utils.filterHeaders(storedResponse.headers);
        headers.forEach((header) => {
            response.setHeader(header.name, header.value)
        });
    }

    /**
     * 
     * 
     * @param {object} response
     * @param {object} storedResponse
     * @description Sets cookies for an incoming HTTP request, reads cookies from the HAR file for the corresponding response.
     */
    setCookies(response, storedResponse) {
        storedResponse.cookies.forEach((cookie) => {
            response.cookie(
                cookie.name,
                cookie.value,
                utils.processCookie(cookie)
            );
        });
    }

    /**
     * 
     * 
     * @param {string} url
     * @param {object} response
     * @returns {string} storedResponse
     * @description Returns a HAR entry corresponding to the URL for which the request was received, throws appropriate exceptions if no entries are found in HAR file.
     */
    getStoredResponse(url, response) {
        let storedResponse;
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
        return storedResponse;
    }
    /**
     * 
     * 
     * @param {any} response
     * @param {any} storedResponse
     * @description Sets text content for an incoming HTTP request.
     */
    sendText(response, storedResponse) {
        response.send(storedResponse.content.text);
    }
    /**
     * 
     * 
     * @param {object} request
     * @param {object} response
     * @param {string} method
     * @description Callback handler for all HTTP requests handled by Dexter.
     */
    genericHandler(request, response, method) {
        let
            storedResponse,
            url = request.url;

        this.emit('receivedRequest', url);

        storedResponse = this.getStoredResponse(url, response);

        if (typeof storedResponse !== 'undefined') {
            this.emit('foundHarEntry', url);

            // Set the status
            this.setStatus(response, storedResponse);

            // Set the headers
            this.setHeaders(response, storedResponse);

            // Set Cookies
            this.setCookies(response, storedResponse);

            // Send the text content
            this.sendText(response, storedResponse);

            this.emit('requestServedSuccessfully');

            response.end();
        }
    }

    /**
     * @description Attaches custom 200 and 404 handlers to show good looking pages instead of blank ones
     */
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
     * @description Tears down the HTTP server and cleans up all resources (aka Dee Dee :O)
     */
    tearDown() {
        this.server.close();
        this.emit('shutdownSuccess', this._port);
    }
}

module.exports = Dexter;