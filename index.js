'use strict';

const
    Dexter = require('./src/Dexter.js'),
    colors = require('colors'),
    ArgParser = require('./src/ArgParser'),
    parsedArgs = ArgParser.parse(process.argv.slice(2));

let
    harFilePath = parsedArgs['h'] || 'test/data/sample.har',
    port = parsedArgs['p'] || 1121,
    verboseMode = parsedArgs['v'] || false;

function log(output, verboseControlled) {
    if (verboseControlled) {
        if (verboseMode) {
            console.log(output);
        } else {
            //Swallow console log
        }
    } else {
        console.log(output);
    }
}
new
    Dexter(harFilePath, port)
    .startUp()
    .on('startupSuccess', (port) => {
        log(colors.green.bold('Started Dexter at:' + port), false);
    })
    .on('shutdownSuccess', () => {
        log(colors.red.bold('Stopped Dexter'), false);
    })
    .on('receivedRequest', (url) => {
        log(colors.yellow('Serving ' + url), true);
    })
    .on('noEntryInHar', (url) => {
        log(colors.red('Didn\'t find corresponding entry in HAR, returning 404\n'), true);
    })
    .on('foundHarEntry', (url) => {
        log(colors.green('Found entry, writing response with headers and cookies... '), true);
    })
    .on('requestServedSuccessfully', () => {
        log(colors.green('Done \n'), true);
    });