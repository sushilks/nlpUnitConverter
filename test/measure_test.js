'use strict';
var TUtils = require('./test_utils.js');
var NLPClient = require('./../src/nlp_client.js');
var assert = require('assert');


describe('Grammar Type:Define Test::', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });

    it('Time is  defined to be a Measure.', ()=>{
        return TUtils.processExp(nlp, 'Time is  defined to be a Measure.')
            .then(function(res) {
                assert.equal(res, 'DefineMeasure Data [{"subj":"Time","type":"Measure"}]');
            });
    });

    it('Time is a Measure.', ()=>{
        return TUtils.processExp(nlp, 'Time is a Measure.')
            .then(function(res) {
                assert.equal(res, 'DefineMeasure Data [{"subj":"Time","type":"Measure"}]');
            });
    });
    it('Time is defined as a Measure.', ()=>{
        return TUtils.processExp(nlp, 'Time is defined as a Measure.')
            .then(function(res) {
                assert.equal(res, 'DefineMeasure Data [{"subj":"Time","type":"Measure"}]');
            });
    });
    it('Time is a type of Measure.', ()=>{
        return TUtils.processExp(nlp, 'Time is a type of Measure.')
            .then(function(res) {
                assert.equal(res, 'DefineMeasure Data [{"subj":"Time","type":"Measure"}]');
            });
    });
    it('Time is of type Measure.', ()=>{
        return TUtils.processExp(nlp, 'Time is of type Measure.')
            .then(function(res) {
                assert.equal(res, 'DefineMeasure Data [{"subj":"Time","type":"Measure"}]');
            });
    });
    it('Time is defined to be a type of measure.', ()=>{
        return TUtils.processExp(nlp, 'Time is defined to be a type of measure.')
            .then(function(res) {
                assert.equal(res, 'DefineMeasure Data [{"subj":"Time","type":"measure"}]');
            });
    });
    it('Time is defined to be a type of Unit.', ()=>{
        return TUtils.processExp(nlp, 'Time is defined to be a type of Unit.')
            .then(function(res) {
                assert.equal(res, '');
            });
    });
    it('Measuring Time is fun.', ()=>{
        return TUtils.processExp(nlp, 'Measuring time is fun.')
            .then(function(res) {
                assert.equal(res, '');
            });
    });
    it('today is a rainy day.', ()=>{
        return TUtils.processExp(nlp, 'today is a rainy day.')
            .then(function(res) {
                assert.equal(res, '');
            });
    });

});