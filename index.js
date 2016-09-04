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

/**
 * 
 * @description Controls Dexter's logging
 * @param {String} output
 * @param {Boolean} verboseControlled pass false if the log message should always be output regardless of verboseMode value
 */
function log(output, verboseControlled) {
    if (verboseControlled) {// If verboseControlled, check if verboseMode is enabled
        if (verboseMode) { // If yes, output
            console.log(output);
        } else {
            //Swallow console log
        }
    } else { // If not verboseControlled, always output it
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