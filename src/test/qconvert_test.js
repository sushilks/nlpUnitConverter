'use strict';
var TUtils = require('./util/test_utils.js');
var NLPClient = require('./../nlp_client.js');
var assert = require('assert');



function getQConvRes(ret) {
    for (let itm of ret) {
        let d = itm.substr(itm.indexOf('['));
        let n = itm.substr(0,itm.indexOf('['));
        let dj = JSON.parse(d)[0];
        if (n.match(/QConv/)) {
            //delete dj._keys;
            return dj.args;
        }
    }
    return;
}

describe('Explanation Type:Question Converstion Test::', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });


    var txt, res;
    txt = 'ZEQtest is a type of measure.';
    it(txt, (function (txt, res) {
        return TUtils.processExp(nlp, txt);
    }).bind(null, txt, res));;


    txt = 'Units for ZEQtest are xx, yy, meters, yards, foot, centimeter, miles, inches';
    it(txt, (function (txt, res) {
        return TUtils.processExp(nlp, txt);
    }).bind(null, txt, res));

    txt = 'there is one xx in two yy.';
    it(txt, (function (txt, res) {
        return TUtils.processExp(nlp, txt);
    }).bind(null, txt, res));

    txt = 'there is one meter in two yard.';
    it(txt, (function (txt, res) {
        return TUtils.processExp(nlp, txt);
    }).bind(null, txt, res));

    txt = 'there is one meter in two foot.';
    it(txt, (function (txt, res) {
        return TUtils.processExp(nlp, txt);
    }).bind(null, txt, res));

    txt = 'there is one mile in two inch.';
    it(txt, (function (txt, res) {
        return TUtils.processExp(nlp, txt);
    }).bind(null, txt, res));

    txt = 'there is 100 centimeter in one meter.';
    it(txt, (function (txt, res) {
        return TUtils.processExp(nlp, txt);
    }).bind(null, txt, res));

    txt = 'Convert 60 xx to yy.';
    res = {"fromValue":{"listStr":["60"]},"convTo":{"listStr":["yy"]},"convFrom":{"listStr":["xx"]}};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                //console.log(JSON.stringify(getQConvRes(ret)));
               // console.log(JSON.stringify(res));
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'Convert 60 xx into yy.';
    res = {"fromValue":{"listStr":["60"]},"convTo":{"listStr":["yy"]},"convFrom":{"listStr":["xx"]}};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'Convert 60 thousand Meters in to Yards.';
    res = {"fromValue":{"listStr":["60 thousand"]},"convTo":{"listStr":["Yards"]},"convFrom":{"listStr":["Meters"]}};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'How many meters are there in 602 foot?';
    res = {"fromValue":{"listStr":["602"]},"convTo":{"listStr":["meters"]},"convFrom":{"listStr":["foot"]}};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'How many meters are there in 6 thousand foot?';
    res = {"fromValue":{"listStr":["6 thousand"]},"convTo":{"listStr":["meters"]},"convFrom":{"listStr":["foot"]}};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'How much is two yards in centimeter?';
    res = {"fromValue":{"listStr":["two"]},"convTo":{"listStr":["centimeter"]},"convFrom":{"listStr":["yards"]}};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'How many inches are there in two mile?';
    res = {"fromValue":{"listStr":["two"]},"convTo":{"listStr":["inches"]},"convFrom":{"listStr":["mile"]}};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'How many meters are in 2 yards?';
    res = {"fromValue":{"listStr":["2"]},"convTo":{"listStr":["meters"]},"convFrom":{"listStr":["yards"]}};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));
/*
        txt = 'How many meters in 60 miles?';
        res = 'QConv Data [{"convTo":"meters","convFrom":"miles","fromValue":60}]';
        it(txt, (function(txt, res) {
            reqturn TUtils.processExp(nlp, txt)
                .then(function(ret) {
                    assert.equal(ret, res);
                });
        }).bind(null, txt, res));
*/
});