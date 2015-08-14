'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');

/*
*/

class DefaultUnit {
    constructor(nodes, matchResult) {
        this.defaultFor = matchResult.defaultFor;
        this.defaultWhat = matchResult.defaultWhat;
        this.defaultUnit = matchResult.default;
        this.nodes = nodes;
        this.dbg = nodes.dbg;
        this.name='DefaultValue'
    }

    static getMatchToken() {
        return ['VerbBase'];
    }

    getName() {
        return this.name;
    }
    getDefaultFor() {
        return this.defaultFor;
    }
    getDefaultUnit() {
        return this.defaultUnit;
    }
    getDefaultWhat() {
        return this.defaultWhat;
    }
    text() {
        return 'Default [' + this.getDefaultWhat() + '] for [' + this.getDefaultFor() +
            '] is [' +
            this.getDefaultUnit() + ']';
    }
    exec(gr) {
        console.log('Adding to graph:' + this.getName());
    }
    static checkValid(gr) {
        const VerbMatch = ['is', 'expressed', 'specified'];

        // check if there is a subject + object and they are connected by regex
        if (false  && gr.dbg) {
            console.log('     verb:' + gr.verb +
                ' subj:' + gr.verbSubj +
                ' obj:' + gr.verbObj);
        }
        let nodes = gr.nodes;
        let verb = gr.getVerb(); //nodes.getNodeMap(gr.verb).getValues();
        let verbSubj = gr.getSubjectOnly(); //nodes.getNodeMap(gr.verbSubj).getValues();
        let verbObj = gr.getObjectOnly(); //nodes.getNodeMap(gr.verbObj).getValues();
        let verbWho = gr.getSubjectWho();
        let verbWhen = gr.getObjectWhen();
        let verbWhat = gr.getObjectWhat();

        if (gr.dbg) {
            console.log('     verb:' + verb + ' SUBJ:' + gr.getSubject() + ' OBJ:' + gr.getObject());
            console.log('     subjOnly:' + gr.getSubjectOnly() + ' WHO:' + gr.getSubjectWho());
            console.log('     objOnly:' + gr.getObjectOnly() + ' WHEN:' + gr.getObjectWhen()
            + ' WHAT:' + gr.getObjectWhat());
        }
        if (!Utils.checkMatchAny(verb, VerbMatch)) {
            return [false, {}];
        }
        let re1 = verbSubj.match(/([^,>]*)>compound>(d|D)efault/);
        if (re1) {
            assert.notEqual(verbWho,'','Un-Implemented.' + verbWho);
            let r = [true, {'defaultWhat': re1[1], 'defaultFor': verbWho, 'default' : verbObj}];
            //console.log("RETURNING r=" + JSON.stringify(r));
            return r;
        }


        let re = verbObj.match(/(d|D)efault,([^,>]*)/);
        if (re) {
            assert.equal(re.length,3,'Un-Implemented.' + re.length);
            if (verb === 'expressed' || verb === 'specified') {
                let r = [true, {'defaultWhat' : 'unit', 'defaultFor': verbSubj, 'default': re[2]}];
                //console.log("RETURNING r=" + JSON.stringify(r));
                return r;
            }
        }

        if (verbWhen.match(/default/i) && verbWhat !== '' && verbObj.match(/(specified)|(expressed)/i)) {
            let r = [true, {'defaultWhat' : 'unit', 'defaultFor': verbSubj, 'default': verbWhat}];
            return r;
        }
        /*
        re = verbObj.match(/([^,>]*)>nmod[^,>]*>default/);
        if (re) {
            assert.equal(re.length,2,'Un-Implemented.' + re.length);
            return [true, {'defaultFor': verbSubj, 'defaultUnit' : re[1]}];
        }*/
        return [false, {}];
    }
}

export default DefaultUnit;