'use strict';
var TUtils = require('./util/test_utils.js');
var NLPClient = require('./../nlp_client.js');
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
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0].verb.data[0].subj.token, 'Seconds');
                assert.deepEqual(ret[0].verb.data[0].subj.data[0].numnode.dataValue, 'sixty');
                assert.deepEqual(ret[0].verb.data[0].subj.data[1].what.token, 'parsec');
                assert.deepEqual(ret[0].verb.data[0].subj.data[1].what.data[0].numnode.dataValue, 'two hundred');
            });
    }).bind(null, txt, res));
/*
    txt = 'There are sixty nine seconds in two hundred parsec.';
    res =['[Seconds>nummod>sixty nine]','[parsec>nummod>two hundred]'];
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                console.log(JSON.stringify(ret));
                assert.deepEqual(ret, res);
            });
    }).bind(null, txt, res));
*/
    txt = 'I walked 3,490 steps today.';
    res =['[steps>nummod>3490]'];
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0].verb.data[1].obj.token, 'steps');
                assert.deepEqual(ret[0].verb.data[1].obj.data[0].numnode.dataValue, '3490');
//                assert.deepEqual(ret, res);
            });
    }).bind(null, txt, res));


    txt = 'There are 52 weeks or 365 days in a year.';
    res =['[weeks>nummod>52]', '[days>nummod>365]'];
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0].verb.data[0].subj.token, 'weeks');
                assert.deepEqual(ret[0].verb.data[0].subj.data[0].numnode.dataValue, '52');
                assert.deepEqual(ret[0].verb.data[0].subj.data[1].what.token, 'days');
                assert.deepEqual(ret[0].verb.data[0].subj.data[1].what.data[0].numnode.dataValue, '<or> 365');
//                assert.deepEqual(ret, res);
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