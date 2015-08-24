'use strict';
var TUtils = require('./test_utils.js');
var NLPClient = require('./../src/nlp_client.js');
var assert = require('assert');

describe('Explanation Type:Question Converstion Test', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });


    var txt, res;

    txt = 'Convert 60 xx to yy.';
    res = 'QConv Data [{"convTo":"yy","convFrom":"xx","fromValue":"60"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'Convert 60 xx into yy.';
    res = 'QConv Data [{"convTo":"yy","convFrom":"xx","fromValue":"60"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'Convert 60 thousand Meters in to Yards.';
    res = 'QConv Data [{"convTo":"Yards","convFrom":"Meters","fromValue":"60 thousand"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'How many YY are there in  60 XX?';
    res = 'QConv Data [{"convTo":"YY","convFrom":"XX","fromValue":"60"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'How many YY are there in  60 XX?';
    res = 'QConv Data [{"convTo":"YY","convFrom":"XX","fromValue":"60"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'How much is two YY in XX?';
    res = 'QConv Data [{"convTo":"XX","convFrom":"YY","fromValue":2}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'How many XX are there in two YY?';
    res = 'QConv Data [{"convTo":"XX","convFrom":"YY","fromValue":2}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    /*
    txt = 'How many XX are in 2 YY?';
    res = 'QConv Data [{"convTo":"XX","convFrom":"YY","fromValue":2}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

        txt = 'How many YY in 60 XX?';
        res = 'QConv Convert From [xx] Value [60] TO [yy]';
        it(txt, (function(txt, res) {
            return TUtils.processExp(nlp, txt)
                .then(function(ret) {
                    assert.equal(ret, res);
                });
        }).bind(null, txt, res));
    */

});