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
    let nd = new Nodes(pp.getSentenceDep(0), dbg);
    nd.processAllGrammar();
    res = [];
    for (let idx in nd.grMatches) {
        if (false) {
            console.log('\t Grammar IDX = ' + idx + ' :: GR Type [' + nd.grMatches[idx].getName()
                + '] Matched Text  ::' + nd.grMatches[idx].text());
        }
        if (nd.grMatches[idx].getName().match(/nummod/)) {
            res.push(nd.grMatches[idx].text());
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

describe('Grammar nummod Test ::', function() {
    var nlp ;

    before(()=>{
        nlp = new NLPClient();
    });

    var txt, res;

    txt = 'There are sixty Seconds in two hundred parsec.';
    res =['[Seconds>nummod>sixty]','[parsec>nummod>two hundred]'];
    it(txt, (function(txt, res) {
        return process(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'There are sixty nine Seconds in two hundred parsec.';
    res =['[Seconds>nummod>sixty nine]','[parsec>nummod>two hundred]'];
    it(txt, (function(txt, res) {
        return process(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'I walked 3,490 steps today.';
    res =['[steps>nummod>3,490]'];
    it(txt, (function(txt, res) {
        return process(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(ret, res);
            });
    }).bind(null, txt, res));


    txt = 'There are 52 weeks or 365 days in a year.';
    res =['[weeks>nummod>52]', '[days>nummod>365]'];
    it(txt, (function(txt, res) {
        return process(nlp, txt)
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