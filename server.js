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
    console.log(colors.yellow('Received request for:' + url));
    try {
        console.log('inside');
        storedResponse = har.getResponseForUrl(request.url);

        console.log(storedResponse);
        storedResponse.headers.forEach(function (header) {
            response.setHeader(header.name, header.value)
        });
        response.write('asd');
        // storedResponse.headers.forEach(({word, count}) => {
        //     console.log(word+' '+count);
        // });
    } catch (e) {
        response.send(e.message);
    } finally {
        response.end();
    }
});
