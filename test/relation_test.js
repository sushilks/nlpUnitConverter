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
    res = 'Relation Data [{"convD":"60","convN":1,"nodeFrom":"Seconds","nodeTo":"Minute"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));
    txt = 'There is 2 FOA in Five Dal.';
    res = 'Relation Data [{"convD":"2","convN":"Five","nodeFrom":"FOA","nodeTo":"Dal"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'Twenty Moo equals 40 Boo.';
    res = 'Relation Data [{"convD":"Twenty","convN":"40","nodeFrom":"Moo","nodeTo":"Boo"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'Twenty Moo is equal to 4 hundred Boo.';
    res = 'Relation Data [{"convD":"Twenty","convN":"4 hundred","nodeFrom":"Moo","nodeTo":"Boo"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'twenty thousand Moo makes 4000 Boo.';
    res = 'Relation Data [{"convD":"twenty thousand","convN":"4000","nodeFrom":"Moo","nodeTo":"Boo"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = '4 quarters makes one Dollar.';
    res = 'Relation Data [{"convD":"4","convN":"one","nodeFrom":"quarters","nodeTo":"Dollar"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'Four quarters makes a Dollar.';
    res = 'Relation Data [{"convD":"Four","convN":1,"nodeFrom":"quarters","nodeTo":"Dollar"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = '4 quarters is one Dollar.';
    res = 'Relation Data [{"convD":"4","convN":"one","nodeFrom":"quarters","nodeTo":"Dollar"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'five quarters is 1.25 Dollar.';
    res = 'Relation Data [{"convD":"five","convN":"1.25","nodeFrom":"quarters","nodeTo":"Dollar"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = '4 quarters is equal to one Dollar.';
    res = 'Relation Data [{"convD":"4","convN":"one","nodeFrom":"quarters","nodeTo":"Dollar"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));

    txt = 'One Dollar is equal to four quarters.';
    res = 'Relation Data [{"convD":"One","convN":"four","nodeFrom":"Dollar","nodeTo":"quarters"}]';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.equal(ret, res);
            });
    }).bind(null, txt, res));


});