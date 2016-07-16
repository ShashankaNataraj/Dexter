'use strict';
/**
 * Requires
 * */
const express = require('express'),
    colors = require('colors'),
    parseArgs = require('minimist'),
    harReader = require('./src/HarReader'),
    harUtils = require('./src/HarUtils');

/**
 * Lets for later usage
 * */
const app = express(),
    port = process.env.PORT || 1121,
    har = new harReader(),
    utils = new harUtils();

/**
 * Generic handler for all HTTP methods
 * */
function genericHandler(request, response, method) {
    let storedResponse;
    let url = request.url;
    process.stdout.write(colors.yellow('Serving ' + url + ':'));
    try {
        storedResponse = har.getResponseForUrl(request.url, method);
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
        let headers = utils.filterHeaders(storedResponse.headers);
        headers.forEach((header)=> {
            response.setHeader(header.name, header.value)
        });
        // Set Cookies
        storedResponse.cookies.forEach((cookie)=> {
            response.cookie(
                cookie.name,
                cookie.value,
                utils.processCookie(cookie)
            );
        });
        // Send the text content
        response.send(storedResponse.content.text);
        process.stdout.write(colors.green('Done \n'));
        response.end();
    }
}
app.post('/*', (request, response)=> {
    genericHandler(request, response, 'POST');
});
app.get('/*', (request, response)=> {
    genericHandler(request, response, 'GET');
});
app.put('/*', (request, response)=> {
    genericHandler(request, response, 'PUT');
});
app.delete('/*', (request, response)=> {
    genericHandler(request, response, 'DELETE');
});
app.connect('/*', (request, response)=> {
    genericHandler(request, response, 'CONNECT');
});
app.head('/*', (request, response)=> {
    genericHandler(request, response, 'HEAD');
});


/**
 * Serve static files
 */
app.use(express.static('public'));

/**
 * Start listening
 * */
app.listen(port, ()=> { //Start the server and listen on a port
    har.readHar('test/data/sample.har');
    console.log(colors.green.bold('Started Yama at:' + port));
});