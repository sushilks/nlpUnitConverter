'use strict';
var TUtils = require('./test_utils.js');
var NLPClient = require('./../src/nlp_client.js');
var assert = require('assert');

describe('Grammar VerbBase Test ::', function() {
    var nlp ;

    before(()=>{
        nlp = new NLPClient();
    });

    var txt, res;

    txt = 'units for time are hours, minutes, days, months and seconds.';
    res = {
        verb: 'are',
        rawSubj: 'units>nmod:for>time',
        subj: 'units',
        subjWho: 'time',
        rawObj: 'hours minutes days months seconds',
        obj: 'hours minutes days months seconds'
    };
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                console.log('ret[0] = ' + JSON.stringify(ret[0]));
                console.log('RES    = ' + JSON.stringify(res));

                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));
    txt = 'there is 60 sec in one min.';
    res = {
        verb: 'is',
        rawSubj: 'sec>nmod:in>min>nummod>one,sec>nummod>60',
        subjWhat: 'min>nummod>one',
        subj: 'sec>nummod>60'
    };
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));

    txt = 'in one minute there is 60 seconds.';
    res = {
        verb: 'is',
        rawVerbMod: 'is>nmod:in>minute>nummod>one',
        verbModWhat: 'minute>nummod>one',
        verbMod: 'is',
        rawSubj: 'seconds>nummod>60',
        subj: 'seconds>nummod>60'
    };
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));

    txt = 'there are 60 sec in a min.';
    res = {
        verb: 'are',
        rawSubj: 'sec>nmod:in>min,sec>nummod>60',
        subjWhat: 'min',
        subj: 'sec>nummod>60'
    };
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));

    txt = '60 Seconds is equal to one Minute.';
    res = {
        verb: 'is',
        rawSubj: 'Seconds>nummod>60',
        subj: 'Seconds>nummod>60',
        rawObj: 'equal>nmod:to>Minute>nummod>one',
        objWho: 'Minute>nummod>one',
        obj: 'equal'
    };

    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));

    txt = '60 Seconds makes one Minute.';
    //verb=[makes] Subj=[] Object=[] SubjOnly: ObjectOnly:
    res = {
        verb: 'makes',
        rawSubj: 'Seconds>nummod>60',
        subj: 'Seconds>nummod>60',
        rawObj: 'Minute>nummod>one',
        obj: 'Minute>nummod>one'
    };
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));

    txt = 'convert 837 Weeks into Seconds.';
    //verb=[makes] Subj=[] Object=[] SubjOnly: ObjectOnly:
    res = {
        verb: 'convert',
        rawVerbMod: 'convert>nmod:tmod>Weeks>nummod>837,convert>nmod:into>Seconds',
        verbModWho: 'Weeks>nummod>837',
        verbModWhat: 'Seconds',
        verbMod: 'convert'
    };
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));

});