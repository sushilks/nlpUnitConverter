'use strict';
var TUtils = require('./test_utils.js');
var NLPClient = require('./../src/nlp_client.js');
var assert = require('assert');

describe('Explanation Type:RelationMath Test ::', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });


    var txt, res;

    txt = 'There are 60 Seconds in a Minute.';
    res = 'Relation Data [{"nodeFrom":"Seconds","nodeTo":"Minute","convD":"60","convN":"1"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));
    txt = 'There is 2 FOA in Five Dal.';
    res = 'Relation Data [{"nodeFrom":"FOA","nodeTo":"Dal","convD":"2","convN":"Five"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'Twenty Moo equals 40 Boo.';
    res = 'Relation Data [{"nodeFrom":"Moo","nodeTo":"Boo","convD":"Twenty","convN":"40"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'Twenty Moo is equal to 4 hundred Boo.';
    res = 'Relation Data [{"nodeFrom":"Moo","nodeTo":"Boo","convD":"Twenty","convN":"4 hundred"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'twenty thousand Moo makes 4000 Boo.';
    res = 'Relation Data [{"nodeFrom":"Moo","nodeTo":"Boo","convD":"twenty thousand","convN":"4000"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = '4 quarters makes one Dollar.';
    res = 'Relation Data [{"nodeFrom":"quarters","nodeTo":"Dollar","convD":"4","convN":"one"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'Four quarters makes a Dollar.';
    res = 'Relation Data [{"nodeFrom":"quarters","nodeTo":"Dollar","convD":"Four","convN":"1"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = '4 quarters is one Dollar.';
    res = 'Relation Data [{"nodeFrom":"quarters","nodeTo":"Dollar","convD":"4","convN":"one"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'five quarters is 1.25 Dollar.';
    res = 'Relation Data [{"nodeFrom":"quarters","nodeTo":"Dollar","convD":"five","convN":"1.25"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = '4 quarters is equal to one Dollar.';
    res = 'Relation Data [{"nodeFrom":"quarters","nodeTo":"Dollar","convD":"4","convN":"one"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'One Dollar is equal to four quarters.';
    res = 'Relation Data [{"nodeFrom":"Dollar","nodeTo":"quarters","convD":"One","convN":"four"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));


});