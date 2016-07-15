'use strict';
let _ = require('underscore');

class HarUtils {
    processCookie(cookie) {
        let shavedCookie = _.clone(cookie);
        delete shavedCookie.name;
        delete shavedCookie.value;
        if (shavedCookie.expires !== null) {
            shavedCookie.expires = new Date(shavedCookie.expires); // Convert the expires property into a date
        }
    }
    /**
     * GZIPPing is not supported as of now and some REST clients such as webstorms built in one will throw an error
     */
    filterHeaders(headers) {
        return headers.filter((header)=> {
            return header.value != 'gzip';
        });
    }
}
module.exports = HarUtils;