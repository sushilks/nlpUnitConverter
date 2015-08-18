'use strict';
var TUtils = require('./test_utils.js');
var NLPClient = require('./../src/nlp_client.js');
var assert = require('assert');


describe('Grammar Type:Default Test', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });

    it('By default time is in seconds.', ()=>{
        return TUtils.processExp(nlp, 'By default time is in seconds.')
            .then(function(res) {
                assert.equal(res, '');
            });
    });
    it('By default time is expressed in minutes.', ()=>{
        return TUtils.processExp(nlp, 'By default time is expressed in minutes.')
            .then(function(res) {
                assert.equal(res, 'Default [unit] for [time] is [minutes]');
            });
    });
    it('The default unit for foo is Zque.', ()=>{
        return TUtils.processExp(nlp, 'The default unit for foo is Zque.')
            .then(function(res) {
                assert.equal(res[0], 'Default [unit] for [foo] is [Zque]');
            });
    });
    it('The default state of water is liquid.', ()=>{
        return TUtils.processExp(nlp, 'The default state of water is liquid.')
            .then(function(res) {
                assert.equal(res, 'Default [state] for [water] is [liquid]');
            });
    });
    it('default state of water is liquid.', ()=>{
        return TUtils.processExp(nlp, 'default state of water is liquid.')
            .then(function(res) {
                assert.equal(res, 'Default [state] for [water] is [liquid]');
            });
    });
    it('Default state of ZWater is pLiquid.', ()=>{
        return TUtils.processExp(nlp, 'Default state of ZWater is pLiquid.')
            .then(function(res) {
                assert.equal(res, 'Default [state] for [ZWater] is [pLiquid]');
            });
    });
    it('neg-2', ()=>{
        return TUtils.processExp(nlp, 'By default water is in liquid state.')
            .then(function(res) {
                assert.equal(res, '');
            });
    });
    it('the default nature of people is to be good.', ()=>{
        return TUtils.processExp(nlp, 'the default nature of people is to be good.')
            .then(function(res) {
                assert.equal(res, 'Default [nature] for [people] is [good]');
            });
    });

    it('By default Time is in specified in Minutes.', ()=>{
        return TUtils.processExp(nlp, 'By default Time is in specified in Minutes.')
            .then(function(res) {
                assert.equal(res, 'Default [unit] for [Time] is [Minutes]');
            });
    });


});