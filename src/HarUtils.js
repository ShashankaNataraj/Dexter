'use strict';
let _ = require('underscore');

class HarUtils{
    processCookie(cookie){
        let shavedCookie = _.clone(cookie);
        delete shavedCookie.name;
        delete shavedCookie.value;
        if (shavedCookie.expires !== null) {
            shavedCookie.expires = new Date(shavedCookie.expires);
        }
    }
}
module.exports = HarUtils;