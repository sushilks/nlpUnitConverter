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
        verb : 'are',
        subj : 'units>nmod:for>time',
        obj : 'hours,minutes,days,months,seconds',
        subjOnly : 'units',
        subjWho : 'time',
        subjWhat : '',
        objOnly : 'hours,minutes,days,months,seconds',
        objWhat : '',
        objWhen : '' };
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));
    txt = 'there is 60 sec in one min';
    res = {
        verb : 'is',
        subj : 'sec>nmod:in>min>nummod>one,sec>nummod>60',
        obj : 'min>nummod>one',
        subjOnly : 'sec>nummod>60',
        subjWho : '',
        subjWhat : 'min>nummod>one',
        objOnly : 'min>nummod>one',
        objWhat : '',
        objWhen : '' };
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));

    txt = 'in one minute there is 60 seconds';
    res = {
        verb : 'is',
        subj : 'seconds>nummod>60',
        obj : 'minute>nummod>one',
        subjOnly : 'seconds>nummod>60',
        subjWho : '',
        subjWhat : '',
        objOnly : 'minute>nummod>one',
        objWhat : '',
        objWhen : '' };
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));

    txt = 'there are 60 sec in a min.';
    res = {
        verb : 'are',
        subj : 'sec>nmod:in>min,sec>nummod>60',
        obj : 'min',
        subjOnly : 'sec>nummod>60',
        subjWho : '',
        subjWhat : 'min',
        objOnly : 'min',
        objWhat : '',
        objWhen : '' };
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));

    txt = '60 Seconds is equal to one Minute.';
    res = {
        verb : 'is',
        subj : 'Seconds>nummod>60',
        obj : 'equal>nmod:to>Minute>nummod>one',
        subjOnly : 'Seconds>nummod>60',
        subjWho : '',
        subjWhat : '',
        objOnly : 'equal>nmod:to>Minute>nummod>one',
        objWhat : '',
        objWhen : '' };
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));

    txt = '60 Seconds makes one Minute.';
    //verb=[makes] Subj=[] Object=[] SubjOnly: ObjectOnly:
    res = {
        verb : 'makes',
        subj : 'Seconds>nummod>60',
        obj : 'Minute>nummod>one',
        subjOnly : 'Seconds>nummod>60',
        subjWho : '',
        subjWhat : '',
        objOnly : 'Minute>nummod>one',
        objWhat : '',
        objWhen : '' };
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));

});