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

    it('By default time is in seconds.', ()=>{
        return process(nlp, 'By default time is in seconds.')
            .then(function(res) {
                assert.equal(res, '');
            });
    });
    it('By default time is expressed in minutes.', ()=>{
        return process(nlp, 'By default time is expressed in minutes.')
            .then(function(res) {
                assert.equal(res, 'Default [unit] for [time] is [minutes]');
            });
    });
    it('The default unit for foo is Zque.', ()=>{
        return process(nlp, 'The default unit for foo is Zque.')
            .then(function(res) {
                assert.equal(res[0], 'Default [unit] for [foo] is [Zque]');
            });
    });
    it('The default state of water is liquid.', ()=>{
        return process(nlp, 'The default state of water is liquid.')
            .then(function(res) {
                assert.equal(res, 'Default [state] for [water] is [liquid]');
            });
    });
    it('default state of water is liquid.', ()=>{
        return process(nlp, 'default state of water is liquid.')
            .then(function(res) {
                assert.equal(res, 'Default [state] for [water] is [liquid]');
            });
    });
    it('Default state of ZWater is pLiquid.', ()=>{
        return process(nlp, 'Default state of ZWater is pLiquid.')
            .then(function(res) {
                assert.equal(res, 'Default [state] for [ZWater] is [pLiquid]');
            });
    });
    it('neg-2', ()=>{
        return process(nlp, 'By default water is in liquid state.')
            .then(function(res) {
                assert.equal(res, '');
            });
    });
    it('the default nature of people is to be good.', ()=>{
        return process(nlp, 'the default nature of people is to be good.')
            .then(function(res) {
                assert.equal(res, 'Default [nature] for [people] is [good]');
            });
    });

    it('By default Time is in specified in Minutes.', ()=>{
        return process(nlp, 'By default Time is in specified in Minutes.')
            .then(function(res) {
                assert.equal(res, 'Default [unit] for [Time] is [Minutes]');
            });
    });


});