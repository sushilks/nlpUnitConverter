'use strict';
var TUtils = require('./test_utils.js');
var NLPClient = require('./../src/nlp_client.js');
var assert = require('assert');

describe('Grammar Type:Unit Test::', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });


    var txt, res;

    txt = 'Units for zTime are Hours, Minutes, Seconds, Days, Weeks.';
    res = 'Units Data [{"unitsFor":"zTime","units":["Minutes","Seconds","Days","Weeks","Hours"]}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'unit for zLength is Meters, Lines, Inches and Yards.';
    res = 'Units Data [{"unitsFor":"zLength","units":["Lines","Inches","Yards","Meters"]}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'unit for zTime is Hour.';
    res = 'Units Data [{"unitsFor":"zTime","units":["Hour"]}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    /*
    txt = 'unit for measuring zTime is Minutes, Hours.';
    res = 'Units for [zTime] are [Minutes, Hours]';
    it(txt, (function(txt, res) {
        return process(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));
*/

});