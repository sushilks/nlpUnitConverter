'use strict';

var Utils = require('../nodes_utils');
var BaseExp = require('./base_exp.js');
//var assert = require('assert');
var dbg = require('debug')('node:exp:units');

/*
*/

class Units extends BaseExp {
    constructor(nodes, matchResult) {
        super(nodes, matchResult);
        this.name = Units.getName();
    }
    static getName() {
        return 'Units';
    }

    static getMatchToken() {
        return ['VerbBase'];
    }
    static getArgs() {
        return ['unitsFor', 'units'];
    }
    exec(gr) {
        //dbg('Adding to graph:' + this.getName());
        //dbg('Graph name:' + this.getUnitsFor());
        let nm = this.result.unitsFor;
        let g = gr[nm];
        if (!g) {
            console.trace('ERROR: Dont know about [' + nm + ']');
        }
        let units = this.result.units;
        //console.log('UNIT = ' + units);
        if (Array.isArray(units)) {
            units.forEach(function (x) {
                //dbg(' UNIT =  ' + x)
                g.addNode(Utils.normalizeUnit(x), {unitFor: nm});
            });
        } else {
            g.addNode(Utils.normalizeUnit(units), {unitFor: nm});
        }
    }
    static checkValid(gr) {
        const VerbMatch = ['is', 'expressed', 'are'];
        //return [false, {}];
        // check if there is a subject + object and they are connected by regex
        let nodes = gr.nodes;
        let vb = gr.dict();
        //console.log('     verb:' + vb.verb + ' RES: ' + JSON.stringify(vb) + ']');
        if (!Utils.checkMatchAny(vb.verb, VerbMatch)) {
            //dbg('Failed-to-find');
            return [false, {}];
        }
        let re1 = Utils.kMatch(vb, 'subj', /unit/i);
        if (re1 && 'subjWho' in vb && 'obj' in vb) {
            //let rep1 = vb.obj.match(',([^,>]*)>compound>');
            if (Utils.kMatch(vb, 'subj', />compound>default/i)) {
                return [false, {}];
            }
            let vo = vb.obj.replace('>compound>', ' ');
            vo = vo.toLowerCase();
            let voa = vo.split(' ');
            for(let idx in voa) {
                voa[idx] = Utils.normalizeUnit(voa[idx]);
            }
            let r = [true, {'unitsFor': vb.subjWho, 'units' : voa}];
            dbg('Found r=' + JSON.stringify(r));
            return r;
        }

        //dbg('Failed-to-find');
        return [false, {}];
    }
}

export default Units;
