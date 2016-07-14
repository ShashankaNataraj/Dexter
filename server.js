'use strict';
let express = require('express'),
    app = express(),
    port = process.env.PORT || 1121,
    parseArgs = require('minimist'),
    harReader = require('./src/HarReader.js'),
    harUtils = require('./src/HarUtils.js'),
    har = new harReader(),
    utils = new harUtils(),
    colors = require('colors');

app.listen(port, ()=> { //Start the server and listen on a port
    har.readHar('sample.har');
    console.log(colors.green.bold('Started Yama at:' + port));
});
app.get('/favicon.ico', function (request, response) {
    response.end();
});

app.get('/*', (request, response) => {
    let storedResponse;
    let url = request.url;
    process.stdout.write(colors.yellow('Serving ' + url + ':'));
    try {
        storedResponse = har.getResponseForUrl(request.url);
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
        storedResponse.headers.forEach((header)=> {
            /**
             * GZIPPing is not supported as of now and some REST clients such as webstorms built in one will throw an error
             */
            if (header.value !== 'gzip') {
                response.setHeader(header.name, header.value)
            }
        });
        // Set Cookies
        storedResponse.cookies.forEach((cookie)=> {
            let shavedCookie = utils.processCookie(cookie);
            response.cookie(cookie.name, cookie.value, shavedCookie);
        });
        response.send(storedResponse.content.text);
        process.stdout.write(colors.green('Done \n'));
        response.end();
    }
});
