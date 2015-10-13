'use strict';
var TUtils = require('./util/test_utils.js');
var NLPClient = require('./../nlp_client.js');
var assert = require('assert');

function getRes(ret) {
    for (let itm of ret) {
        let d = itm.substr(itm.indexOf('['));
        let n = itm.substr(0,itm.indexOf('['));
        let dj = JSON.parse(d)[0];
        if (n.match(/Default/)) {
            delete dj._keys;
            return dj.args;
        }
    }
    return;
}

describe('Grammar Type:Default Test::', function() {
    let nlp ;

    before(()=>{
        nlp = new NLPClient();
    });
    var txt, res;


    res = {"defaultFor":{"listStr":["time"]},"default":{"listStr":["seconds"]},"defaultWhat":{"listStr":["unit"]}};
    txt =  'By default time is in seconds.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRes(ret), res);
            });
    }).bind(null, txt, res));

    res = {"defaultFor":{"listStr":["time"]},"default":{"listStr":["minutes"]},"defaultWhat":{"listStr":["unit"]}};
    txt = 'By default time is expressed in minutes.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRes(ret), res);
            });
    }).bind(null, txt, res));

    res = {"defaultWhat":{"listStr":["unit"]},"defaultFor":{"listStr":["foo"]},"default":{"listStr":["Zque"]}};
    txt = 'The default unit for foo is Zque.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRes(ret), res);
            });
    }).bind(null, txt, res));

    res = {"defaultWhat":{"listStr":["state"]},"defaultFor":{"listStr":["water"]},"default":{"listStr":["liquid"]}};
    txt = 'The default state of water is liquid.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRes(ret), res);
            });
    }).bind(null, txt, res));

    res = {"defaultWhat":{"listStr":["state"]},"defaultFor":{"listStr":["water"]},"default":{"listStr":["liquid"]}};
    txt = 'default state of water is liquid.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRes(ret), res);
            });
    }).bind(null, txt, res));

    res = {"defaultWhat":{"listStr":["state"]},"defaultFor":{"listStr":["ZWater"]},"default":{"listStr":["pLiquid"]}};
    txt = 'Default state of ZWater is pLiquid.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRes(ret), res);
            });
    }).bind(null, txt, res));

    res = undefined;
    txt = 'By nature water is in liquid state.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRes(ret), res);
            });
    }).bind(null, txt, res));
    /*
    it('the default nature of people is to be good.', ()=>{
        return TUtils.processExp(nlp, 'the default nature of people is to be good.')
            .then(function(res) {
                assert.equal(res, 'Default Data [{"defaultWhat":"nature","defaultFor":"people","default":"good"}]');
            });
    });
*/
    res = {"defaultFor":{"listStr":["Time"]},"default":{"listStr":["Minutes"]},"defaultWhat":{"listStr":["unit"]}};
    txt = 'By default Time is specified in Minutes.';
    it(txt, (function(txt, res) {
        return TUtils.processExp(nlp, txt)
            .then(function(ret) {
                assert.deepEqual(getRes(ret), res);
            });
    }).bind(null, txt, res));

});