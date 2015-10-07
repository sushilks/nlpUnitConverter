'use strict';
var TUtils = require('./util/test_utils.js');
var NLPClient = require('./../nlp_client.js');
var assert = require('assert');

describe('Grammar VerbBase Test ::', function() {
    var nlp ;

    before(()=>{
        nlp = new NLPClient();
    });

    var txt, res;

    txt = 'units for time are hours, minutes, days, months and seconds.';
    res = {
        verb : {
            obj: {
                dataValueTagged: 'obj::<appos::<minutes> appos::<days> appos::<months> appos::<seconds> hours>'
            },
            subj: {
                dataValueTagged: 'subj::<Who::<<for> time> units>'
            }
        }
    };
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                console.log(' RET = ' + JSON.stringify(ret));
                assert.deepEqual(ret[0].verb.obj.dataValueTagged, res.verb.obj.dataValueTagged);
                assert.deepEqual(ret[0].verb.subj.dataValueTagged, res.verb.subj.dataValueTagged);
            });
    }).bind(null, txt, res));
    txt = 'there is 60 sec in one min.';
    res = {
        verb : {
            dataValueTagged: 'VerbBase::<<there> subj::<nummod::<60> nmod:in::<<in> nummod::<one> min> sec> is>'
        }
    };

    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0].verb.dataValueTagged, res.verb.dataValueTagged);
            });
    }).bind(null, txt, res));

    txt = 'in one minute there is 60 seconds.';
    res = { verb : {
        dataValueTagged: 'VerbBase::<what::<<in> nummod::<one> minute> <there> subj::<nummod::<60> seconds> is>'
    }};
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0].verb.dataValueTagged, res.verb.dataValueTagged);
            });
    }).bind(null, txt, res));

    txt = 'there are 60 sec in a min.';
    res = { verb : {
        token: 'are',
        dataValueTagged: 'VerbBase::<<there> subj::<nummod::<60> what::<<in> <a> min> sec> are>'
    }};
    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0].verb.dataValueTagged, res.verb.dataValueTagged);
                assert.deepEqual(ret[0].verb.token, res.verb.token);
            });
    }).bind(null, txt, res));

    txt = '60 Seconds is equal to one Minute.';
    res = {
        verb : {
            token : 'is',
            obj: {
                dataValueTagged: 'obj::<Who::<<to> nummod::<one> Minute> equal>'
            },
            subj: {
                dataValueTagged: 'subj::<nummod::<60> Seconds>'
            }
        }
    };

    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                assert.deepEqual(ret[0].verb.token, res.verb.token);
                assert.deepEqual(ret[0].verb.obj.dataValueTagged, res.verb.obj.dataValueTagged);
                assert.deepEqual(ret[0].verb.subj.dataValueTagged, res.verb.subj.dataValueTagged);
            });
    }).bind(null, txt, res));

    txt = '60 Seconds makes one Minute.';
    //verb=[makes] Subj=[] Object=[] SubjOnly: ObjectOnly:
    res = { verb : {
        token: 'makes',
        dataValueTagged: 'VerbBase::<subj::<nummod::<60> Seconds> obj::<nummod::<one> Minute> makes>'
    }};

    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                //console.log('ret[0] = ' + JSON.stringify(ret[0]));
                //console.log('RES    = ' + JSON.stringify(res));
                assert.deepEqual(ret[0].verb.dataValueTagged, res.verb.dataValueTagged);
                assert.deepEqual(ret[0].verb.token, res.verb.token);
            });
    }).bind(null, txt, res));

    txt = 'convert 837 Weeks into Seconds.';
    //verb=[makes] Subj=[] Object=[] SubjOnly: ObjectOnly:
    res = { verb : {
        token: 'convert',
        dataValueTagged: 'VerbBase::<Who::<nummod::<837> Weeks> what::<<into> Seconds> convert>'
    }};

    it(txt, (function(txt, res) {
        return TUtils.processGrDict(nlp, txt, /VerbBase/)
            .then(function(ret) {
                //console.log('ret[0] = ' + JSON.stringify(ret[0]));
                //console.log('RES    = ' + JSON.stringify(res));
                //assert.deepEqual(ret[0], res);
                assert.deepEqual(ret[0].verb.dataValueTagged, res.verb.dataValueTagged);
                assert.deepEqual(ret[0].verb.token, res.verb.token);
            });
    }).bind(null, txt, res));

});