'use strict';

/**
 * Requires and consts
 * */
const
    express = require('express'),
    colors = require('colors'),
    parseArgs = require('minimist'),
    harReader = require(__dirname + '/HarReader'),
    harUtils = require(__dirname + '/HarUtils');

class Dexter {
    constructor(harPath) {
        this._app = express();
        this._port = process.env.PORT || 1121;
        this._har = new harReader();
        this._utils = new harUtils();
        this._harPath = harPath;
    }

    /**
     * Handles entire server startup process (aka Ooh what does this button do)
     * */
    startUp() {
        this.attachMethodHandlers();
        this.serveStaticFiles();
        this.startServer();
    }

    /**
     * Start listening
     * */
    startServer() {
        this.server = this._app.listen(this._port, ()=> { //Start the server and listen on a port
            this._har.readHar(this._harPath);
            console.log(colors.green.bold('Started Dexter at:' + this._port));
        });
    }

    /**
     * Attaches HTTP method handlers to incoming requests
     * */
    attachMethodHandlers() {
        this._app.all('/*', (request, response)=> {
            this.genericHandler(request, response, request.method);
        });
    }

    /**
     * Serve static files
     */
    serveStaticFiles() {
        this._app.use(express.static('public'));
    }

    /**
     * Generic handler for all HTTP methods
     * */
    genericHandler(request, response, method) {
        let storedResponse;
        let url = request.url;
        process.stdout.write(colors.yellow('Serving ' + url + ':'));
        try {
            storedResponse = this._har.getResponseForUrl(request.url, method);
        } catch (e) {
            process.stdout.write(colors.red('Didn\'t find corresponding entry in HAR, returning 404\n'));
            response.statusCode = 404;
            response.send(e.message);
        }
        if (storedResponse) {
            process.stdout.write(colors.green('Found entry, writing response with headers and cookies... '));
            // Set the status
            response.status(storedResponse.status);
            // Set the headers
            let headers = this._utils.filterHeaders(storedResponse.headers);
            headers.forEach((header)=> {
                response.setHeader(header.name, header.value)
            });
            // Set Cookies
            storedResponse.cookies.forEach((cookie)=> {
                response.cookie(
                    cookie.name,
                    cookie.value,
                    this._utils.processCookie(cookie)
                );
            });
            // Send the text content
            response.send(storedResponse.content.text);
            process.stdout.write(colors.green('Done \n'));
            response.end();
        }
    }

    /**
     * Dee Dee :O
     * */
    tearDown() {
        this.server.close();
    }
}

module.exports = Dexter;