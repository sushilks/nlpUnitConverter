'use strict';
var TUtils = require('./test_utils.js');
var NLPClient = require('./../src/nlp_client.js');
var assert = require('assert');

describe('Explanation Type:Question Converstion Test::', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });


    var txt, res;

    txt = 'Convert 60 xx to yy.';
    res = 'QConv Data [{"fromValue":"60","convTo":"yy","convFrom":"xx"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'Convert 60 xx into yy.';
    res = 'QConv Data [{"fromValue":"60","convTo":"yy","convFrom":"xx"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'Convert 60 thousand Meters in to Yards.';
    res = 'QConv Data [{"fromValue":"60 thousand","convTo":"Yards","convFrom":"Meters"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'How many meters are there in 602 foot?';
    res = 'QConv Data [{"fromValue":"602","convTo":"meters","convFrom":"foot"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'How many meters are there in 6 thousand foot?';
    res = 'QConv Data [{"fromValue":"6 thousand","convTo":"meters","convFrom":"foot"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'How much is two yards in centimeter?';
    res = 'QConv Data [{"fromValue":"two","convTo":"centimeter","convFrom":"yards"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'How many inches are there in two mile?';
    res = 'QConv Data [{"fromValue":"two","convTo":"inches","convFrom":"mile"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'How many meters are in 2 yards?';
    res = 'QConv Data [{"fromValue":"2","convTo":"meters","convFrom":"yards"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
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