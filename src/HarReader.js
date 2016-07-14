'use strict';
let fs = require('fs'),
    url = require('url'),
    wurl = require('wurl');

class HarReader {
    constructor() {
        this.responseMap = new Map(); //Can be done with an object too, but using a map just because
    }

    /**
     * Opens the HAR file and calls other utility methods
     * */
    readHar(filePath) {
        fs.readFile(filePath, (err, rawHar)=> {
            let parsedHar;
            if (err) {// Catch file existence issues
                throw err;
            }
            else {
                try {
                    parsedHar = JSON.parse(rawHar);
                }
                catch (err) {//Catch JSON format exceptions
                    throw err;
                }
                parsedHar.log.entries.forEach((entry) => { //Construct response map based structure
                    this.responseMap.set(
                        wurl('path', entry.request.url), // Take in only the paths, not the domain names because thats of no use to us
                        entry.response
                    );
                });
            }
        });
    }

    /**
     * Returns response Object from the HAR file
     * */
    getResponseForUrl(passedUrl) {
        let url = wurl('path', passedUrl),
            storedResponse = this.responseMap.get(url);
        if (typeof storedResponse === 'undefined')
            throw new Error('Response doesn\'t exist in HAR file for path ' + url);
        else return storedResponse;
    }
}
module.exports = HarReader;
