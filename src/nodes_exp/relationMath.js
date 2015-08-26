'use strict';

var Utils = require('../nodes_utils');
var BaseExp = require('./base_exp.js');


class relationMath extends BaseExp {
    constructor(nodes, matchResult) {
        super(nodes, matchResult);
        this.name = 'Relation';
    }

    static getMatchToken() {
        return ['VerbBase'];
    }
    exec(gr) {
//        console.log('Adding to graph:' + this.getName());
        let nFrom = Utils.normalizeUnit(this.result.nodeFrom);
        let nTo = Utils.normalizeUnit(this.result.nodeTo);
        for (let k in gr) {
            let g = gr[k];
            if (g.hasNode(nFrom) && g.hasNode(nTo)) {
                if (this.dbg) {
                    console.log(this.getName() + ' :: Adding to graph From: ' +
                        nFrom + ' TO: ' + nTo + ' Conv : ' + this.getConv());
                }
                g.addEdge(nFrom, nTo, {conv: this.result.conv});
                g.addEdge(nTo, nFrom, {conv: 1.0/this.result.conv});
                return;
            }
        }
        console.log('ERROR Unable to add relation between [' + nFrom + '] and [' + nTo + '], one of these nodes are defined');
    }

    static checkValid(gr) {
        const VerbMatch = ['is', 'are', 'make', 'makes', 'equals'];

        let nodes = gr.nodes;
        let vb = gr.dict(); //nodes.getNodeMap(gr.verb).getValues();
        if (gr.dbg) {
            console.log('     verb:' + vb.verb + ' RES: ' + JSON.stringify(vb) + ']');
        }

        if (!Utils.checkMatchAny(vb.verb, VerbMatch)) {
            return [false, {}];
        }

        if (!('subj' in vb)) {
            return [false, {}];
        }

        let re1 = vb.subj.match(/([^,>]*)(>nummod>)([^,>]*)/);
        let n1Name, n1Cnt = 1, n2Name, n2Cnt = 1;
        if (re1) {
            n1Name = re1[1];
            n1Cnt = Utils.textToNumber(re1[3]);
        } else return [false, {}];

        let dt2;

        if ('obj' in vb && vb.obj.match(/equal/) && 'objWho' in vb) {
            dt2 = vb.objWho;
        } else if (vb.verb.match(/(equal|make|is)/i) && 'obj' in vb) {
            dt2 = vb.obj;
        } else if ('subjWhat' in vb && !('verbDep' in vb)) {
            //There are 60 Seconds in a Minute.
            //{"verb":"are","rawSubj":"Seconds>nmod:in>Minute,Seconds>nummod>60","subjWhat":"Minute","subj":"Seconds>nummod>60"}
            dt2 = vb.subjWhat;
        } else return [false, {}];

        let re2 = dt2.match(/([^,>]*)>nummod>([^,>]*)/);
        if(re2) {
            n2Name = re2[1];
            n2Cnt = Utils.textToNumber(re2[2]);
        } else if (dt2 != '') {
            // check for 'Twenty Moo is equal to 4 hundred Boo.'
            let rdt2 = dt2.match(/(.*) ([^ ]*)$/);
            if (rdt2) {
                n2Cnt = Utils.textToNumber(rdt2[1]);
                n2Name = rdt2[2];
            } else {
                n2Name = dt2;
                n2Cnt = 1;
            }
        }
        if (n1Name === '' || n2Name === '') {
            return [false, {}];
        }
        return [true, { 'nodeFrom' : n1Name, 'nodeTo' : n2Name, 'conv' : n2Cnt/n1Cnt}]
    }
}

export default relationMath;
