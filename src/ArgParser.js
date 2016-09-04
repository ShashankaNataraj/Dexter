'use strict';

const
    minimist = require('minimist');
/**
 * 
 * 
 * @class ArgParser
 * @classdesc This class uses minimist to parse handle command line  parameters.
 */
class ArgParser {
    /**
     * 
     * 
     * @static
     * @param {Object} args
     * @returns
     * @description Accepts nodeJS command line param array, parses these with minimist and returns the parsed arguments
     */
    static parse(args) {
        const 
            parsedArgs = minimist(args);
        return parsedArgs;
    }
}

module.exports = ArgParser;