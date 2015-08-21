'use strict';
var TUtils = require('./test_utils.js');
var NLPClient = require('./../src/nlp_client.js');
var assert = require('assert');

describe('Explanation Type:RelationMath Test', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });


    var txt, res;

    txt = 'There are 60 Seconds in a Minute.';
    res = 'Relation Data [{"nodeFrom":"Seconds","nodeTo":"Minute","conv":0.016666666666666666}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));
    txt = 'There is 2 FOA in Five Dal.';
    res = 'Relation Data [{"nodeFrom":"FOA","nodeTo":"Dal","conv":2.5}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'Twenty Moo equals 40 Boo.';
    res = 'Relation Data [{"nodeFrom":"Moo","nodeTo":"Boo","conv":2}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'Twenty Moo is equal to 4 hundred Boo.';
    res = 'Relation Data [{"nodeFrom":"Moo","nodeTo":"Boo","conv":0.05}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'twenty thousand Moo makes 4000 Boo.';
    res = 'Relation Data [{"nodeFrom":"Moo","nodeTo":"Boo","conv":0.2}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = '4 quarters makes one Dollar.';
    res = 'Relation Data [{"nodeFrom":"quarters","nodeTo":"Dollar","conv":0.25}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'Four quarters makes a Dollar.';
    res = 'Relation Data [{"nodeFrom":"quarters","nodeTo":"Dollar","conv":0.25}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = '4 quarters is one Dollar.';
    res = 'Relation Data [{"nodeFrom":"quarters","nodeTo":"Dollar","conv":0.25}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'five quarters is a Dollar.';
    res = 'Relation Data [{"nodeFrom":"quarters","nodeTo":"Dollar","conv":0.2}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = '4 quarters is equal to one Dollar.';
    res = 'Relation Data [{"nodeFrom":"quarters","nodeTo":"Dollar","conv":0.25}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'One Dollar is equal to four quarters.';
    res = 'Relation Data [{"nodeFrom":"Dollar","nodeTo":"quarters","conv":4}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));


});