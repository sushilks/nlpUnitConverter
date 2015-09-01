'use strict';
var TUtils = require('./test_utils.js');
var NLPClient = require('./../src/nlp_client.js');
var assert = require('assert');


describe('Grammar Type:Default Test::', function() {
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
                assert.equal(res, 'Default Data [{"defaultWhat":"unit","defaultFor":"time","default":"minutes"}]');
            });
    });
    it('The default unit for foo is Zque.', ()=>{
        return TUtils.processExp(nlp, 'The default unit for foo is Zque.')
            .then(function(res) {
                assert.equal(res[0], 'Default Data [{"defaultWhat":"unit","defaultFor":"foo","default":"Zque"}]');
            });
    });
    it('The default state of water is liquid.', ()=>{
        return TUtils.processExp(nlp, 'The default state of water is liquid.')
            .then(function(res) {
                assert.equal(res, 'Default Data [{"defaultWhat":"state","defaultFor":"water","default":"liquid"}]');
            });
    });
    it('default state of water is liquid.', ()=>{
        return TUtils.processExp(nlp, 'default state of water is liquid.')
            .then(function(res) {
                assert.equal(res, 'Default Data [{"defaultWhat":"state","defaultFor":"water","default":"liquid"}]');
            });
    });
    it('Default state of ZWater is pLiquid.', ()=>{
        return TUtils.processExp(nlp, 'Default state of ZWater is pLiquid.')
            .then(function(res) {
                assert.equal(res, 'Default Data [{"defaultWhat":"state","defaultFor":"ZWater","default":"pLiquid"}]');
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
                assert.equal(res, 'Default Data [{"defaultWhat":"nature","defaultFor":"people","default":"good"}]');
            });
    });

    it('By default Time is specified in Minutes.', ()=>{
        return TUtils.processExp(nlp, 'By default Time is specified in Minutes.')
            .then(function(res) {
                assert.equal(res, 'Default Data [{"defaultWhat":"unit","defaultFor":"Time","default":"Minutes"}]');
            });
    });


});