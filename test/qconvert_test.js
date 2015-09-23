'use strict';
var TUtils = require('./test_utils.js');
var NLPClient = require('./../src/nlp_client.js');
var assert = require('assert');



function getQConvRes(ret) {
    for (let itm of ret) {
        let d = itm.substr(itm.indexOf('['));
        let n = itm.substr(0,itm.indexOf('['));
        let dj = JSON.parse(d)[0];
        if (n.match(/QConv/)) {
            delete dj._keys;
            return dj;
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

    txt = 'Convert 60 xx to yy.';
    res = {"fromValue":"60","convTo":"yy","convFrom":"xx"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                console.log(JSON.stringify(getQConvRes(ret)));
                console.log(JSON.stringify(res));
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'Convert 60 xx into yy.';
    res = {"fromValue":"60","convTo":"yy","convFrom":"xx"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'Convert 60 thousand Meters in to Yards.';
    res = {"fromValue":"60 thousand","convTo":"Yards","convFrom":"Meters"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'How many meters are there in 602 foot?';
    res = {"fromValue":"602","convTo":"meters","convFrom":"foot"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'How many meters are there in 6 thousand foot?';
    res = {"fromValue":"6 thousand","convTo":"meters","convFrom":"foot"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'How much is two yards in centimeter?';
    res = {"fromValue":"two","convTo":"centimeter","convFrom":"yards"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'How many inches are there in two mile?';
    res = {"fromValue":"two","convTo":"inches","convFrom":"mile"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getQConvRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'How many meters are in 2 yards?';
    res = {"fromValue":"2","convTo":"meters","convFrom":"yards"};
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
            return TUtils.processExp(nlp, txt)
                .then(function(ret) {
                    assert.equal(ret, res);
                });
        }).bind(null, txt, res));
*/
});