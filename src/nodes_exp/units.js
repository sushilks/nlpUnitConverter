'use strict';

var Utils = require('../nodes_utils');
var BaseExp = require('./base_exp.js');
//var assert = require('assert');

/*
*/

class Units extends BaseExp {
    constructor(nodes, matchResult) {
        super(nodes, matchResult);
        this.name = 'Units';
    }

    static getMatchToken() {
        return ['VerbBase'];
    }
    exec(gr) {
        //console.log('Adding to graph:' + this.getName());
        //console.log('Graph name:' + this.getUnitsFor());
        let nm = this.result.unitsFor;
        let g = gr[nm];
        if (!g) {
            console.trace('ERROR: Dont know about [' + nm + ']');
        }
        let units = this.result.units;
        units.forEach(function(x) {
            //console.log(' UNIT =  ' + x)
            g.addNode( x, {unitFor: nm});
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
        let vb = gr.dict();
        if (gr.dbg) {
            console.log('     verb:' + vb.verb + ' RES: ' + JSON.stringify(vb) + ']');
        }
        if (!Utils.checkMatchAny(vb.verb, VerbMatch)) {
            return [false, {}];
        }
        let re1 = Utils.kMatch(vb, 'subj', /unit/i);
        if (re1 && 'subjWho' in vb && 'obj' in vb) {
            //let rep1 = vb.obj.match(',([^,>]*)>compound>');
            let vo = vb.obj.replace('>compound>', ' ');
            vo = vo.toLowerCase();
            let voa = vo.split(' ');
            for(let idx in voa) {
                voa[idx] = Utils.normalizeUnit(voa[idx]);
            }
            let r = [true, {'unitsFor': vb.subjWho, 'units' : voa}];
            //console.log("RETURNING r=" + JSON.stringify(r));
            return r;
        }

        return [false, {}];
    }
}

export default Units;
