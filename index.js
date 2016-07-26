"use strict";
const
    Dexter = require(__dirname + '/src/Dexter.js'),
    colors = require('colors');

new
    Dexter('test/data/sample.har', process.env.PORT)
    .startUp()
    .on('startupSuccess', (port)=> {
        console.log(colors.green.bold('Started Dexter at:' + port));
    })
    .on('shutdownSuccess', () => {
        console.log(colors.red.bold('Stopped Dexter'));
    })
    .on('receivedRequest', (url)=> {
        process.stdout.write(colors.yellow('Serving ' + url + ':'));
    })
    .on('noEntryInHar', (url)=> {
        process.stdout.write(colors.red('Didn\'t find corresponding entry in HAR, returning 404\n'));
    })
    .on('foundHarEntry', (url)=> {
        process.stdout.write(colors.green('Found entry, writing response with headers and cookies... '));
    })
    .on('requestServedSuccessfully', ()=> {
        process.stdout.write(colors.green('Done \n'));
    });