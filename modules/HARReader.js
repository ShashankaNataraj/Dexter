'use strict';
let fs = require('fs'),
    url = require('url');
class HarReader {
    constructor() {
        this.har = null;
        this.responseMap = new Map(); //Can be done with an object too, but using a map just because
    }

    /**
     * Opens the HAR file and calls other utility methods
     * */
    readHar(filePath) {
        fs.readFile(filePath, (error,rawHar)=>{
            JSON.parse(rawHar).log.entries.forEach((entry) => {
                this.responseMap.set(this.getPathUrl(entry.request.url), entry.response);
            });
        });
    }

    /**
     * Returns a response object from the HAR file given a URL
     * */
    getPathUrl(passedUrl) {
        passedUrl = url.parse(passedUrl).pathname;
        return passedUrl;
    }

    /**
     * Returns response Object from the HAR file
     * */
    getResponseForUrl(passedUrl) {
        let parsedUrl = this.getPathUrl(passedUrl),
            storedResponse = this.responseMap.get(parsedUrl);
        if (typeof storedResponse === 'undefined')
            throw new Error('Response doesn\'t exist in HAR file for path ' + parsedUrl);
        else return storedResponse;
    }
}
module.exports = HarReader;
