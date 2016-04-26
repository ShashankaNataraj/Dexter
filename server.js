'use strict';
let express = require('express'),
    app = express(),
    port = process.env.PORT || 1121,
    parseArgs = require('minimist'),
    routes = require('./Modules/Routes.js'),
    harReader = require('./Modules/HarReader.js'),
    har = new harReader();

app.listen(port, ()=> { //Start the server and listen on a port
    har.readHar('sample.har');
    console.log('Running Yama at:' + port);
});
app.get('/*', (request, response) => {
    let storedResponse;
    try {
        storedResponse = har.getResponseForUrl(request.url);
        response.setHeader('Content-Type', storedResponse.content.mimeType);
        response.setHeader('Content-Type', storedResponse.content.mimeType);
    } catch (e) {
        response.send(e.message);
    }
});
