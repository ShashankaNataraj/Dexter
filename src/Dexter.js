'use strict';

const
    express = require('express'),
    path = require('path'),
    EventEmitter = require('events').EventEmitter,
    harReader = require('./HarReader'),
    HarUtils = require('./HarUtils'),
    utils = new HarUtils(),
    DexterException = require('./DexterException');

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
        this._assignHAR();
        this._assignPort();
    }

    /**
     * @private
     * @description Responsible for assigning HARPath, Har variable and throwing any associated exceptions
     */
    _assignHAR() {
        if (harPath !== undefined) {
            this._harPath = harPath;
        } else {
            throw new DexterException('HAR file path not specified', 'InvalidHAR');
        }
        this._har = new harReader();
    }

    /**
     * @private
     */
    _assignPort() {
        if (isNaN(parseInt(port))) {
            throw new DexterException('Invalid port specified', 'InvalidPort');
        } else {
            this._port = port;
        }
    }

    /**
     * @private
     * @description Attaches HTTP method handlers to incoming requests
     */
    _attachMethodHandlers() {
        this._app.all('/*', (request, response) => {
            this._genericHandler(request, response, request.method);
        });
    }

    /**
     * 
     * 
     * @param {any} response
     * @param {any} storedResponse
     * @private
     * @description Sets the HTTP status code to an incoming request, reads status codes from the HAR file for the corresponding response
     */
    _setStatus(response, storedResponse) {
        response.status(storedResponse.status);
    }

    /**
     * 
     * 
     * @param {object} response
     * @param {object} storedResponse
     * @private
     * @description Sets headers to an incoming request, reads status codes from the HAR file for the corresponding response
     */
    _setHeaders(response, storedResponse) {
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
     * @private
     * @description Sets cookies for an incoming HTTP request, reads cookies from the HAR file for the corresponding response.
     */
    _setCookies(response, storedResponse) {
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
     * @private
     * @description Returns a HAR entry corresponding to the URL for which the request was received, throws appropriate exceptions if no entries are found in HAR file.
     */
    _getStoredResponse(url, response, method) {
        let storedResponse;
        try {
            if (url === '/') { // If this is a root request, just send out a 200 and be done with it
                response.statusCode = 200;
                response.end();
            } else { // Try to serve if this is a genuine request
                storedResponse = this._har.getResponseForUrl(url, method);
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
     * @param {object} response
     * @param {object} storedResponse
     * @private
     * @description Sets text content for an incoming HTTP request.
     */
    _sendText(response, storedResponse) {
        response.send(storedResponse.content.text);
    }
    /**
     * 
     * 
     * @param {object} request
     * @param {object} response
     * @param {string} method
     * @private
     * @description Callback handler for all HTTP requests handled by Dexter.
     */
    _genericHandler(request, response, method) {
        let
            storedResponse,
            url = request.url;

        this.emit('receivedRequest', url);

        storedResponse = this._getStoredResponse(url, response, method);

        if (typeof storedResponse !== 'undefined') {
            this.emit('foundHarEntry', url);

            // Set the status
            this._setStatus(response, storedResponse);

            // Set the headers
            this._setHeaders(response, storedResponse);

            // Set Cookies
            this._setCookies(response, storedResponse);

            // Send the text content
            this._sendText(response, storedResponse);

            this.emit('requestServedSuccessfully');

            response.end();
        }
    }

    /**
     * @private
     * @description Attaches custom 200 and 404 handlers to show good looking pages instead of blank ones
     */
    _attachCustomRoutes() {
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
     * @private
     * @description Tears down the HTTP server and cleans up all resources (aka Dee Dee :O)
     */
    _tearDown() {
        this.server.close();
        this.emit('shutdownSuccess', this._port);
    }
    /**
     * 
     * @returns Dexter
     * @description Handles entire server startup process (aka Ooh what does this button do)
     * @public
     */
    startUp() {
        this._attachMethodHandlers();
        this._attachCustomRoutes();
        this.startServer();
        return this;
    }

    /**
     * @description Starts listening to incoming requests
     * @public
     */
    startServer() {
        this.server = this._app.listen(this._port, () => { //Start the server and listen on a port
            this._har.readHar(this._harPath);
            this.emit('startupSuccess', this._port);
        });
    }
}

module.exports = Dexter;