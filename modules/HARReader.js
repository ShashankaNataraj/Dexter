'use strict';
class HARReader {
    /**
     * Opens the HAR file and calls other utility methods
     * */
    readHAR(filePath) {
        this.readHttpPaths(filePath);
    }
    /**
     * Reads paths from the HAR file and keeps them in memory
     * */
    readHttpPaths(filePath){
        
    }
    /**
     * Reads data for a given HTTP path
     * */
    readHttpData(){

    }
}

module.exports = HARReader;