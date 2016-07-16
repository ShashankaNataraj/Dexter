'use strict';
const fs = require('fs'),
    url = require('url'),
    wurl = require('wurl'),
    readFile = require('fs-readfile-promise');

class HarReader {
    constructor() {
        this.responseMap = new Map(); //Can be done with an object too, but using a map just because
        this.parsedHar = null;
    }

    /**
     * Opens the HAR file and calls other utility methods
     * */
    readHar(filePath) {
        console.log('ASD:' + filePath);
        return readFile(filePath)
            .then(rawHar=> {
                try {
                    console.log('here1111');
                    this.parsedHar = JSON.parse(rawHar);
                }
                catch (err) {//Catch JSON format exceptions
                    throw err;
                }
                this.parseHar();
            })
            .catch(err=> {
                throw err;
            });
    }

    parseHar() {
        this.parsedHar.log.entries.forEach((entry) => { //Construct response map based structure
            this.responseMap.set(
                wurl('path', entry.request.url), // Take in only the paths, not the domain names because thats of no use to us
                entry.response
            );
        });
        return this.responseMap;
    }

    /**
     * Returns response Object from the HAR file
     * */
    getResponseForUrl(passedUrl, method) {
        let url = wurl('path', passedUrl),
            storedResponse = this.responseMap.get(url);
        if (typeof storedResponse === 'undefined')
            throw new Error('Response doesn\'t exist in HAR file for path ' + url);
        else return storedResponse;
    }
}
module.exports = HarReader;
