'use strict';
var fs = require('fs');
class HARReader {
    constructor() {
        this.har = null;
    }

    /**
     * Opens the HAR file and calls other utility methods
     * */
    readHar(filePath) {
        this.har = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        this.readHttpPaths();
    }

    /**
     * Reads paths from the HAR file and keeps them in memory
     * */
    readEntries() {
        
    }

    /**
     * Reads data for a given HTTP path
     * */
    readHttpData() {

    }

    readHttpPaths() {
        
    }
}

module.exports = HARReader;