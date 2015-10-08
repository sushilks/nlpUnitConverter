'use strict';
var TUtils = require('./util/test_utils.js');
var NLPClient = require('./../nlp_client.js');
var assert = require('assert');

function getDefineRes(ret) {
    for (let itm of ret) {
        let d = itm.substr(itm.indexOf('['));
        let n = itm.substr(0,itm.indexOf('['));
        let dj = JSON.parse(d)[0];
        if (n.match(/Define/)) {
            delete dj._keys;
            return dj.args;
        }
    }
    return;
}

describe('Grammar Type:Define Test::', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });
    var res, txt;
    res = {"subj":"Time","type":"Measure"};
    txt = 'Time is  defined to be a Measure.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getDefineRes(ret), res);
            });
    }).bind(null, txt, res));

    /*
        it('Time is a Measure.', ()=>{
            return TUtils.processExp(nlp, 'Time is a Measure.')
                .then(function(res) {
                    assert.equal(res, 'Define Data [{"subj":"Time","type":"Measure"}]');
                });
        });*/
    res = {"subj":"Time","type":"Measure"};
    txt = 'Time is defined as a Measure.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                //console.log(JSON.stringify(getDefineRes(ret)));
                //console.log(JSON.stringify(res));
                assert.deepEqual(getDefineRes(ret), res);
            });
    }).bind(null, txt, res));


    res = {"subj":"Time","type":"Measure"};
    txt = 'Time is a type of Measure.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getDefineRes(ret), res);
            });
    }).bind(null, txt, res));

    res = {"subj":"Time","type":"Measure"};
    txt = 'Time is of type Measure.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getDefineRes(ret), res);
            });
    }).bind(null, txt, res));

    res = {"subj":"Time","type":"measure"};
    txt = 'Time is defined to be a type of measure.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getDefineRes(ret), res);
            });
    }).bind(null, txt, res));

    res = {"subj":"Time","type":"Unit"};
    txt = 'Time is defined to be a type of Unit.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getDefineRes(ret), res);
            });
    }).bind(null, txt, res));

    res = undefined;
    txt ='Measuring Time is fun.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getDefineRes(ret), res);
            });
    }).bind(null, txt, res));

    res = undefined;
    txt = 'today is a rainy day.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getDefineRes(ret), res);
            });
    }).bind(null, txt, res));

});