'use strict';
import { install } from 'source-map-support';
install();


var NLPClient = require('./../src/nlp_client.js');
var NLPPP = require('./../src/nlp_pp');
var Nodes = require('./../src/nodes.js');
var assert = require('assert');
var port = 8990;


function parse(data, dbg = false) {
    var pp = new NLPPP();
    var res = pp.read(data.body);
    //let rt = pp.getSentenceDep(0).getRootToken();
    //console.log('Processing :: ' + pp.getSentence(0) + ' ROOT:' + rt + '[' + pp.getTokens(0).getToken(rt) + ']');
    let nd = new Nodes(pp.getSentenceDep(0), dbg);
    nd.processAllGrammar();
    res = [];
    /*
    for (let idx in nd.grMatches) {
        if (false) {
            console.log('\tFOUND Grammar IDX = ' + idx + ' :: Grammar Type [' + nd.grMatches[idx].grName()
                + '] Matched Text  ::' + nd.grMatches[idx].text());
        }
     res.push(nd.grMatches[idx].text());
    }*/
    for (let idx in nd.grMatches) {
        if (false) {
            console.log('\t Grammar IDX = ' + idx + ' :: GR Type [' + nd.grMatches[idx].getName()
                + '] Matched Text  ::' + nd.grMatches[idx].text());
        }
        if (nd.grMatches[idx].getName().match(/VerbBase/)) {
            res.push(nd.grMatches[idx].dict());
        }
    }
    return res;
}


function process(client, txt, dbg = false) {
    return new Promise(
        function(resolve, reject) {
            client.req(txt).then(function(res) {
                return parse(res, dbg);
            }, function(err) {
                reject(err);
            }).then(function(res) {
                resolve(res);
            }, function(err) {
                console.log('ERROR when processing request :: ' + err.stack);
            });
        });
}

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
        objOnly : 'hours,minutes,days,months,seconds',
        objWhat : '',
        objWhen : '' };
    it(txt, (function(txt, res) {
        return process(nlp, txt)
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
        objOnly : 'min>nummod>one',
        objWhat : '',
        objWhen : '' };
    it(txt, (function(txt, res) {
        return process(nlp, txt)
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
        objOnly : 'minute>nummod>one',
        objWhat : '',
        objWhen : '' };
    it(txt, (function(txt, res) {
        return process(nlp, txt)
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
        objOnly : 'min>nummod>one',
        objWhat : '',
        objWhen : '' };
    it(txt, (function(txt, res) {
        return process(nlp, txt)
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
        objOnly : 'equal>nmod:to>Minute>nummod>one',
        objWhat : '',
        objWhen : '' };
    it(txt, (function(txt, res) {
        return process(nlp, txt)
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
        objOnly : 'Minute>nummod>one',
        objWhat : '',
        objWhen : '' };
    it(txt, (function(txt, res) {
        return process(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(ret[0], res);
            });
    }).bind(null, txt, res));

});