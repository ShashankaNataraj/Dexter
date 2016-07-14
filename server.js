'use strict';
let express = require('express'),
    app = express(),
    port = process.env.PORT || 1121,
    parseArgs = require('minimist'),
    routes = require('./modules/Routes.js'),
    harReader = require('./modules/HarReader.js'),
    har = new harReader(),
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
    process.stdout.write(colors.yellow('Received request for ' + url + ':'));
    try {
        storedResponse = har.getResponseForUrl(request.url);
    } catch (e) {
        process.stdout.write(colors.red('Didn\'t find corresponding entry in HAR, returning 404'));
        response.statusCode = 404;
        response.send(e.message);
    }
    if (storedResponse) {
        process.stdout.write(colors.green('Found entry, writing response with headers and cookies'));
        storedResponse.headers.forEach((header)=>response.setHeader(header.name,header.value));
        response.status(storedResponse.status);
        response.end();
    }
});
