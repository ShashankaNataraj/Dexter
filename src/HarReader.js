'use strict';

const
    fs = require('fs'),
    url = require('url'),
    wurl = require('wurl'),
    readFile = require('fs-readfile-promise');

/**
 * 
 * 
 * @class HarReader
 * @description Responsible for reading and maintaining the HAR file structure in-memory and providing controlled access to it
 */
class HarReader {
    /**
     * 
     * @constructor
     * @description Creates an instance of HarReader.
     */
    constructor() {
        this.responseMap = new Map(); //Can be done with an object too, but using a map just because
        this.parsedHar = null;
    }

    /**
     * 
     * 
     * @param {string} filePath
     * @returns {object} promise
     */
    readHar(filePath) {
        return readFile(filePath)
            .then(rawHar=> {
                try {
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
    
    /*
     * Parses the log entries in the HAR and creates a map based structure to store the same.
     * */
    /**
     * 
     * 
     * @returns
     */
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
     * 
     * 
     * @param {any} passedUrl
     * @param {any} method
     * @returns
     * @description Gets response object for a given URL
     */
    getResponseForUrl(passedUrl, method) {
        let url = wurl('path', passedUrl),
            storedResponse = this.responseMap.get(url);
        if (typeof storedResponse === 'undefined')
            throw new Error('Response doesn\'t exist in HAR file for path ' + url);
        else return storedResponse;
    }
}

module.exports = HarReader;
