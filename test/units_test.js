'use strict';
var TUtils = require('./test_utils.js');
var NLPClient = require('./../src/nlp_client.js');
var assert = require('assert');

describe('Grammar Type:Default Test', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });


    var txt, res;

    txt = 'Units for zTime are Hours, Minutes, Seconds, Days, Weeks.';
    res = 'Units Data [{"unitsFor":"zTime","units":["Hours","Minutes","Seconds","Days","Weeks"]}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'unit for zTime is Hours, Minutes, Seconds, Days and Weeks.';
    res = 'Units Data [{"unitsFor":"zTime","units":["Hours","Minutes","Seconds","Days","Weeks"]}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'unit for zTime is Hours.';
    res = 'Units Data [{"unitsFor":"zTime","units":["Hours"]}]';
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