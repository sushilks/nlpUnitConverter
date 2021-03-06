'use strict';
var TUtils = require('./util/test_utils.js');
var NLPClient = require('./../nlp_client.js');
var assert = require('assert');

function getRes(ret) {
    for (let itm of ret) {
        let d = itm.substr(itm.indexOf('['));
        let n = itm.substr(0,itm.indexOf('['));
        if (n.match(/Units/)) {
            let dj = JSON.parse(d)[0];
            delete dj._keys;
            delete dj.defaultUsed;
            return dj.args;
        }
    }
    return;
}

describe('Grammar Type:Unit Test::', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });


    var txt, res;
    txt = 'zTime is a type of measure.';
    it(txt, (function (txt, res) {
        return TUtils.processExp(nlp, txt);
    }).bind(null, txt, res));;

    txt = 'zLength is a type of measure.';
    it(txt, (function (txt, res) {
        return TUtils.processExp(nlp, txt);
    }).bind(null, txt, res));;

    txt = 'Units for zTime are Hours, Minutes, Seconds, Days, Weeks.';
    res = {"unitsFor":{ "listStr": ["zTime"] },"units":{ "listStr" :["Hours","Minutes","Seconds","Days","Weeks"]}};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'unit for zLength is Meters, Lines, Inches and Yards.';
    res = {"unitsFor":{ "listStr": ["zLength"]},"units":{"listStr" :["Meters", "Lines","Inches","Yards"]}};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'unit for zTime is Hour.';
    res = {"unitsFor":{"listStr":["zTime"]},"units":{"listStr":["Hour"]}};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'unit for measuring zTime is Minutes, Hours.';
    res = {"unitsFor":{"listStr":["zTime"]},"units":{"listStr": ["Minutes","Hours"]}};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRes(ret), res);
            });
    }).bind(null, txt, res));

});