'use strict';

var Utils = require('../nodes_utils');
//var assert = require('assert');

/*
*/

class Units {
    constructor(nodes, matchResult) {
        this.unitsFor = matchResult.unitsFor;
        this.units = matchResult.units;
        this.nodes = nodes;
        this.dbg = nodes.dbg;
        this.name = 'Units';
    }

    static getMatchToken() {
        return ['VerbBase'];
    }

    getName() {
        return this.name;
    }
    getUnitsFor() {
        return this.unitsFor;
    }
    getUnits() {
        return this.units;
    }
    text() {
        return this.getName() + ' for [' + this.getUnitsFor() + '] are [' +
            this.getUnits() + ']';
    }
    exec(gr) {
        //console.log('Adding to graph:' + this.getName());
        //console.log('Graph name:' + this.getUnitsFor());
        let nm = this.getUnitsFor();
        let g = gr[nm];
        if (!g) {
            console.trace('ERROR: Dont know about [' + nm + ']');
        }
        let units = this.getUnits();
        units.forEach(function(x) {
            //console.log(' UNIT =  ' + x)
            let r = x.replace(/s$/,'');
            g.addNode( r, {unitFor: nm});
        });
    }
    static checkValid(gr) {
        const VerbMatch = ['is', 'expressed', 'are'];

        // check if there is a subject + object and they are connected by regex
        if (false && gr.dbg) {
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
        let re1 = verbSubj.match(/unit/i);
        if (re1 && verbWho !== '' && verbObj !== '') {
            let r = [true, {'unitsFor': verbWho, 'units' : verbObj.split(',')}];
            //console.log("RETURNING r=" + JSON.stringify(r));
            return r;
        }

        return [false, {}];
    }
}

export default Units;
