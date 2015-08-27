'use strict';

var Utils = require('../nodes_utils');
var BaseExp = require('./base_exp.js');
var assert = require('assert');
var dbg = require('debug')('node:exp:default');


class DefaultUnit extends BaseExp {
    constructor(nodes, matchResult) {
        super(nodes, matchResult);
        this.name='DefaultValue'
    }

    static getMatchToken() {
        return ['VerbBase'];
    }

    exec(gr) {
        console.log('\t IMPLEMENT THIS :: Adding to graph:' + this.getName());
    }
    static checkValid(gr) {
        const VerbMatch = ['is', 'expressed', 'specified'];

        // check if there is a subject + object and they are connected by regex
        let nodes = gr.nodes;
        let vb = gr.dict();
        //dbg('     verb:' + vb.verb + ' RES: ' + JSON.stringify(vb) + ']');

        if (!Utils.checkMatchAny(vb.verb, VerbMatch)) {
            return [false, {}];
        }
        let re1 = vb.subj.match(/([^,>]*)>compound>(d|D)efault/);
        if (re1) {
            //assert.notEqual(verbWho,'','Un-Implemented.' + verbWho);
            let defaultFor = '';
            if ('subjWhat' in vb) {
                defaultFor = vb.subjWhat;
            } else if ('subjWho' in vb) {
                defaultFor = vb.subjWho;
            } else {
                defaultFor = vb.subj;
            }
            let obj = vb.obj;
            if (!('obj' in vb)) {
                if (!('comp' in vb)) {
                    return [false, {}];
                }
                let objTkn = vb.comp;
                obj = nodes.getNodeMap(objTkn).getValues();
            }
            let r = [true, {'defaultWhat': re1[1], 'defaultFor': defaultFor, 'default': obj}];
            dbg('Found-1 r=' + JSON.stringify(r));
            return r;
        }

        let def1 = '';
        if ('verbModWhen' in vb) {
            def1 = vb.verbModWhen;
        } else if ('verbModWho' in vb){
            def1 = vb.verbModWho;
        }
        if ('verbModWhat' in vb &&
            def1.match(/default/i) &&
            vb.verb.match(/(expressed|specified)/i)) {
            let r = [true, {'defaultWhat': 'unit', 'defaultFor': vb.subj, 'default': vb.verbModWhat}];
            dbg('Found-2 r=' + JSON.stringify(r));
            return r;
        }
        //dbg('Failed-to-find');

        return [false, {}];
    }
}

export default DefaultUnit;