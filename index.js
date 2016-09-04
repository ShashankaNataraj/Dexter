'use strict';

const
    Dexter = require('./src/Dexter.js'),
    colors = require('colors'),
    ArgParser = require('./src/ArgParser'),
    parsedArgs = ArgParser.parse(process.argv.slice(2));

let
    harFilePath = parsedArgs['h'] || 'test/data/sample.har';

new
    Dexter(harFilePath, process.env.PORT)
    .startUp()
    .on('startupSuccess', (port) => {
        console.log(colors.green.bold('Started Dexter at:' + port));
    })
    .on('shutdownSuccess', () => {
        console.log(colors.red.bold('Stopped Dexter'));
    })
    .on('receivedRequest', (url) => {
        process.stdout.write(colors.yellow('Serving ' + url + ':'));
    })
    .on('noEntryInHar', (url) => {
        process.stdout.write(colors.red('Didn\'t find corresponding entry in HAR, returning 404\n'));
    })
    .on('foundHarEntry', (url) => {
        process.stdout.write(colors.green('Found entry, writing response with headers and cookies... '));
    })
    .on('requestServedSuccessfully', () => {
        process.stdout.write(colors.green('Done \n'));
    });