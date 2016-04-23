'use strict';
let express = require('express'),
    app = express(),
    port = process.env.PORT || 1121,
    url = require('url'),
    parseArgs = require('minimist'),
    routes = require('./modules/Routes.js'),
    harReader = require('./modules/HarReader.js'),
    har = new harReader();

app.listen(port, ()=>{ //Start the server and listen on a port
    har.readHar('sample.har');
    console.log('Running Yama at:' + port);
});
app.get('/*', function(req, res) {
    har.getResponseForUrl(url.parse(req.url).pathname);
});