'use strict';
var TUtils = require('./util/test_utils.js');
var NLPClient = require('./../nlp_client.js');
var assert = require('assert');

function getRelationRes(ret) {
    for (let itm of ret) {
        let d = itm.substr(itm.indexOf('['));
        let n = itm.substr(0,itm.indexOf('['));
        //console.log(' itm ' + itm);
        //console.log('  d ' + d);
        //console.log('  n ' + n);
        let dj = JSON.parse(d)[0];
        if (n.match(/Relation/)) {
            return dj.r;
        }
    }
    return;
}
describe('Explanation Type:RelationMath Test ::', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();


    });

    var txt, res = '';
    txt = 'ZEQtest is a type of measure.';
    it(txt, (function (txt, res) {
        return TUtils.processExp(nlp, txt);
    }).bind(null, txt, res));;


    txt = 'Units for ZEQtest are seconds, minutes, FOA, Dal, boo, moo, quarter, dollar.';
    it(txt, (function (txt, res) {
        return TUtils.processExp(nlp, txt);
    }).bind(null, txt, res));

    txt = 'There are 60 Seconds in a Minute.';
    res = {"convD":"60","convN":1,"nodeFrom":"Seconds","nodeTo":"Minute"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                //console.log(' = ' + JSON.stringify((ret)));
                assert.deepEqual(getRelationRes(ret), res);
            });
    }).bind(null, txt, res));
    txt = 'There is 2 FOA in Five Dal.';
    res = {"convD":"2","convN":"Five","nodeFrom":"FOA","nodeTo":"Dal"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRelationRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'Twenty moo equals 40 boo.';
    res = {"convD":"Twenty","convN":"40","nodeFrom":"moo","nodeTo":"boo"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRelationRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'Twenty moo is equal to 4 hundred boo.';
    res = {"convD":"Twenty","convN":"4 hundred","nodeFrom":"moo","nodeTo":"boo"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRelationRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'twenty thousand Moo makes 4000 Boo.';
    res = {"convD":"twenty thousand","convN":"4000","nodeFrom":"Moo","nodeTo":"Boo"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRelationRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = '4 quarters makes one Dollar.';
    res = {"convD":"4","convN":"one","nodeFrom":"quarters","nodeTo":"Dollar"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRelationRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'Four quarters makes a Dollar.';
    res = {"convD":"Four","convN":1,"nodeFrom":"quarters","nodeTo":"Dollar"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRelationRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = '4 quarters is one Dollar.';
    res = {"convD":"4","convN":"one","nodeFrom":"quarters","nodeTo":"Dollar"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                //console.log(' RET = ' + JSON.stringify(ret));
                assert.deepEqual(getRelationRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'five quarters is 1.25 Dollar.';
    res = {"convD":"five","convN":"1.25","nodeFrom":"quarters","nodeTo":"Dollar"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRelationRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = '4 quarters is equal to one Dollar.';
    res = {"convD":"4","convN":"one","nodeFrom":"quarters","nodeTo":"Dollar"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRelationRes(ret), res);
            });
    }).bind(null, txt, res));

    txt = 'One Dollar is equal to four quarters.';
    res = {"convD":"One","convN":"four","nodeFrom":"Dollar","nodeTo":"quarters"};
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRelationRes(ret), res);
            });
    }).bind(null, txt, res));


});