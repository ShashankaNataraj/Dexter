'use strict';
class HARReader {
    constructor() {
        this.httpPaths = {};
    }

    /**
     * Opens the HAR file and calls other utility methods
     * */
    readHar() {
        this.readHttpPaths(this.filePath);
        return 1;
    }

    /**
     * Reads paths from the HAR file and keeps them in memory
     * */
    readHttpPaths() {

    }

    /**
     * Reads data for a given HTTP path
     * */
    readHttpData() {

    }
}

module.exports = HARReader;