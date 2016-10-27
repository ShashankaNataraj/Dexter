'use strict';

const
    fs = require('fs'),
    url = require('url'),
    wurl = require('wurl'),
    readFile = require('fs-readfile-promise'),
    DexterException = require('./DexterException');

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
    constructor(filePath) {
        this.responseMap = new Map(); //Can be done with an object too, but using a map just because
        this._parsedHar = null;
        this._readHar(filePath);
    }

    /**
     * 
     * 
     * @param {string} filePath
     * @returns {object} promise
     */
    _readHar(filePath) {
        if (typeof filePath === 'undefined') {
            throw new DexterException('Invalid file path', 'InvalidHARPath');
        }
        try {
            this._parsedHar = JSON.parse(readFileSync(filePath));
        }
        catch (ex) {
            throw new DexterException('Invalid HAR format', 'InvalidHARFormat');
        }
        this.parseHar();
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
        this._parsedHar.log.entries.forEach((entry) => { //Construct response map based structure
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
