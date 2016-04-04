var express = require('express');
var app = express();
var port = process.env.PORT || 1121;

var fs = require('fs');
var parseArgs = require('minimist');


app.listen(port, ()=>{//Start the server and listen on a port
    var argv = parseArgs((process.argv));
    var obj = JSON.parse(fs.readFileSync('sample.har', 'utf8'));
    var harReader = require('./modules/HARReader.js')(obj);
    console.log(harReader.readHar(obj));
    console.log('Running Yama at:' + port);
});