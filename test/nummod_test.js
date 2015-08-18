'use strict';
var TUtils = require('./test_utils.js');
var NLPClient = require('./../src/nlp_client.js');
var assert = require('assert');


describe('Grammar nummod Test ::', function() {
    var nlp ;

    before(()=>{
        nlp = new NLPClient();
    });

    var txt, res;

    txt = 'There are sixty Seconds in two hundred parsec.';
    res =['[Seconds>nummod>sixty]','[parsec>nummod>two hundred]'];
    it(txt, (function(txt, res) {
        return TUtils.process(nlp, txt, /nummod/)
            .then(function(ret) {
                assert.deepEqual(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'There are sixty nine Seconds in two hundred parsec.';
    res =['[Seconds>nummod>sixty nine]','[parsec>nummod>two hundred]'];
    it(txt, (function(txt, res) {
        return TUtils.process(nlp, txt, /nummod/)
            .then(function(ret) {
                assert.deepEqual(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'I walked 3,490 steps today.';
    res =['[steps>nummod>3490]'];
    it(txt, (function(txt, res) {
        return TUtils.process(nlp, txt, /nummod/)
            .then(function(ret) {
                assert.deepEqual(ret, res);
            });
    }).bind(null, txt, res));


    txt = 'There are 52 weeks or 365 days in a year.';
    res =['[weeks>nummod>52]', '[days>nummod>365]'];
    it(txt, (function(txt, res) {
        return TUtils.process(nlp, txt, /nummod/)
            .then(function(ret) {
                assert.deepEqual(ret, res);
            });
    }).bind(null, txt, res));
/*
    txt = 'There are five hundred and sixty nine Seconds in two hundred and elevan parsec.';
    res =['nummod [Seconds>nummod>sixty nine]','nummod [parsec>nummod>two hundred]'];
    it(txt, (function(txt, res) {
        return process(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(ret, res);
            });
    }).bind(null, txt, res));
*/
});