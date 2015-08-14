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

describe('Grammar Type:Define Test', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });

    it('Time is  defined to be a Measure.', ()=>{
        return process(nlp, 'Time is  defined to be a Measure.')
            .then(function(res) {
                assert.equal(res, 'DefineMeasure [Time] to be of type [Measure]');
            });
    });

    it('Time is a Measure.', ()=>{
        return process(nlp, 'Time is a Measure.')
            .then(function(res) {
                assert.equal(res, 'DefineMeasure [Time] to be of type [Measure]');
            });
    });
    it('Time is defined as a Measure.', ()=>{
        return process(nlp, 'Time is defined as a Measure.')
            .then(function(res) {
                assert.equal(res, 'DefineMeasure [Time] to be of type [Measure]');
            });
    });
    it('Time is a type of Measure.', ()=>{
        return process(nlp, 'Time is a type of Measure.')
            .then(function(res) {
                assert.equal(res, 'DefineMeasure [Time] to be of type [Measure]');
            });
    });
    it('Time is of type Measure.', ()=>{
        return process(nlp, 'Time is of type Measure.')
            .then(function(res) {
                assert.equal(res, 'DefineMeasure [Time] to be of type [Measure]');
            });
    });
    it('Time is defined to be a type of measure.', ()=>{
        return process(nlp, 'Time is defined to be a type of measure.')
            .then(function(res) {
                assert.equal(res, 'DefineMeasure [Time] to be of type [measure]');
            });
    });
    it('Time is defined to be a type of Unit.', ()=>{
        return process(nlp, 'Time is defined to be a type of Unit.')
            .then(function(res) {
                assert.equal(res, '');
            });
    });
    it('Measuring Time is fun.', ()=>{
        return process(nlp, 'Measuring time is fun.')
            .then(function(res) {
                assert.equal(res, '');
            });
    });
    it('today is a rainy day.', ()=>{
        return process(nlp, 'today is a rainy day.')
            .then(function(res) {
                assert.equal(res, '');
            });
    });

});