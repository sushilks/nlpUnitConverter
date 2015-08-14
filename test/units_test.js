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
    let rt = pp.getSentenceDep(0).getRootToken();
    //console.log('Processing :: ' + pp.getSentence(0) + ' ROOT:' + rt + '[' + pp.getTokens(0).getToken(rt) + ']');
    let nd = new Nodes(pp.getSentenceDep(0), dbg);
    nd.processAllGrammar();
    nd.processAllExp();
    res = [];
    /*
    for (let idx in nd.grMatches) {
        if (false) {
            console.log('\tFOUND Grammar IDX = ' + idx + ' :: Grammar Type [' + nd.grMatches[idx].grName()
                + '] Matched Text  ::' + nd.grMatches[idx].text());
        }
     res.push(nd.grMatches[idx].text());
    }*/
    for (let idx in nd.expMatches) {
        if (false) {
        console.log('\t Expresive IDX = ' + idx + ' :: Exp Type [' + nd.expMatches[idx].getName()
            + '] Matched Text  ::' + nd.expMatches[idx].text());
        }
        res.push(nd.expMatches[idx].text());
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

describe('Grammar Type:Default Test', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });


    var txt, res;

    txt = 'Units for zTime are Hours, Minutes, Seconds, Days, Weeks.';
    res = 'Units for [zTime] are [Hours,Minutes,Seconds,Days,Weeks]';
    it(txt, (function(txt, res) {
        return process(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'unit for zTime is Hours, Minutes, Seconds, Days and Weeks.';
    res = 'Units for [zTime] are [Hours,Minutes,Seconds,Days,Weeks]';
    it(txt, (function(txt, res) {
        return process(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'unit for zTime is Hours.';
    res = 'Units for [zTime] are [Hours]';
    it(txt, (function(txt, res) {
        return process(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    /*
    txt = 'unit for measuring zTime is Minutes, Hours.';
    res = 'Units for [zTime] are [Minutes, Hours]';
    it(txt, (function(txt, res) {
        return process(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));
*/

});