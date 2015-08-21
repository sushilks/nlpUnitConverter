'use strict';

var Utils = require('../nodes_utils');
var Jsnx = require('jsnetworkx');
var BaseExp = require('./base_exp.js');

//var assert = require('assert');

/*
*/

class QConvert extends BaseExp {
    constructor(nodes, matchResult) {
        super(nodes, matchResult);
        this.name = 'QConv';
    }

    static getMatchToken() {
        return ['VerbBase'];
    }

    exec(gr) {
        //console.log('Adding to graph:' + this.getName());
        //console.log('Graph name:' + this.getUnitsFor());

        let nFrom = this.result.convFrom.replace(/s$/,'');
        let nTo = this.result.convTo.replace(/s$/,'');
        for (let k in gr) {
            let g = gr[k];
            //console.log('LOOKING FOR [' + nFrom + '] [' + nTo + ']');
            if (g.hasNode(nFrom) && g.hasNode(nTo)) {
                //console.log("FOUDN NODES 1");
                let sp = Jsnx.shortestPath(g, {source: nFrom, target: nTo});
                if (this.dbg) {
                    console.log('SHORTEST PATH From:' + nFrom + ' TO:' + nTo +
                        ' is [' + sp + ']');
                }
                let currentNode = nFrom;
                sp.shift();
                let val = Utils.textToNumber(this.result.fromValue);
                for (let nextNode of sp) {
                    let ed = g.getEdgeData(currentNode, nextNode);
                    if (this.dbg) {
                        console.log('\t' + currentNode + '->' + nextNode + 'E[' + JSON.stringify(ed) + ']');
                    }
                    val = val * ed.conv;
                    currentNode = nextNode;
                }
                console.log('\t\t' + this.getName() + '::Converted ' + this.result.fromValue + ' ' + nFrom + ' to ' +
                    nTo + ' Value = ' + val);
                //g.addEdge(nFrom, nTo, {conv: this.getConv()});
                //g.addEdge(nTo, nFrom, {conv: 1.0/this.getConv()});
                return;
            }
        }
        console.log(this.getName() + ' :: ERROR Unable to find nodes [' + nFrom + '] [' + nTo + ']');
    }
    static checkValid(gr) {
        const VerbMatch = ['is', 'are', 'make', 'convert', 'Convert'];
        // check if there is a subject + object and they are connected by regex
        let nodes = gr.nodes;
        let vb = gr.dict();
        if (gr.dbg) {
            console.log('     verb:' + vb.verb + ' RES: ' + JSON.stringify(vb) + ']');
        }

        if (!Utils.checkMatchAny(vb.verb, VerbMatch)) {
            return [false, {}];
        }
        //Grammar IDX = 3 :: Grammar Type [VerbBase] Matched Text  ::VerbBase verb=[make]
        // Subj=[Minutes>mod>many>mod>How] Object=[Day>nummod>1]
        // SubjOnly:Minutes>mod>many>mod>How ObjectOnly:Day>nummod>1
        //Grammar IDX = 3 :: Grammar Type [VerbBase] Matched Text  ::VerbBase verb=[are]
        // Subj=[Hours>mod>many>mod>How] Object=[Week>nummod>12]
        // SubjOnly:Hours>mod>many>mod>How ObjectOnly:Week>nummod>12

        {
            let re1 = Utils.kMatch(vb, 'subj', /([^>,]*).*many.*how/i);
            let re2 = Utils.kMatch(vb, 'obj', /([^>,]*)>nummod>([^>,]*)/i);

            if (re1 && re2) {
                let r = [true, {'convTo': re1[1], 'convFrom': re2[1], 'fromValue': re2[2]}];
                //console.log("RETURNING r=" + JSON.stringify(r));
                return r;
            }
        }
        {
            //ubjOnly:WeDeks ObjectOnly:there>dep>many>mod>How ObjectWhat:Hours>nummod>three million
            let re1 = Utils.kMatch(vb, 'obj', /([^,>]*)>mod>how,([^,>]*)>mod>many/i);
            let re2 = Utils.kMatch(vb, 'subj', /([^>,]*)>nummod>([^>,]*)/i);
            if (re1 && re2) {
                let r = [true, {'convTo': re1[1], 'convFrom': re2[1], 'fromValue': re2[2]}];
                //console.log("RETURNING r=" + JSON.stringify(r));
                return r;
            }
            if (re2 && Utils.kMatch(vb, 'obj', /what/i) && vb.subjWhat !== '') {
                let r = [true, {'convTo': vb.subjWhat, 'convFrom': re2[1], 'fromValue': re2[2]}];
                //console.log("RETURNING r=" + JSON.stringify(r));
                return r;
            }
        }
        {
            //ubjOnly:Weeks ObjectOnly:there>dep>many>mod>How ObjectWhat:Hours>nummod>three million
            let re1 = Utils.kMatch(vb, 'obj', /.*many.*how/i);
            let re2 = Utils.kMatch(vb, 'subjWhat', /([^>,]*)>nummod>([^>,]*)/i);
            if (re1  && re2) {
                let r = [true, {'convTo': vb.subj, 'convFrom': re2[1], 'fromValue': re2[2]}];
                //console.log("RETURNING r=" + JSON.stringify(r));
                return r;
            }
        }
        {
            let re1 = Utils.kMatch(vb, 'verbModWhat', /([^>,]*)>nummod>([^>,]*)/i);
            let re2 = Utils.kMatch(vb, 'rawVerbAdvMod', /([^>,]*)>mod>many/i);
            if (re1 && re2) {
                let r = [true, {'convTo': re2[1], 'convFrom': re1[1], 'fromValue': re1[2]}];
                //console.log("RETURNING r=" + JSON.stringify(r));
                return r;
            }
        }
        {
            //How many Inch are there in 30 Foot?
            //{"verb":"are","rawVerbMod":"are>nmod:in>30 Foot","verbModWhat":"30 Foot","verbMod":"are","rawSubj":"many>mod>How,many Inch","subj":"many>mod>How,many Inch"}
            let re1 = Utils.kMatch(vb, 'subj', /many ([^,>]*)/i);
            let re2 = Utils.kMatch(vb, 'verbModWhat', /(.*) ([^ ]*)$/)
            let re3 = Utils.kMatch(vb, 'verbModWhat', /([^>,]*)>nummod>([^>,]*)/i);

            if (Utils.kMatch(vb, 'subj', /many>mod>how/i) && re1 && (re2 || re3)) {
                let r;
                if (re2) {
                    r = [true, {'convTo': re1[1], 'convFrom': re2[2], 'fromValue': Utils.textToNumber(re2[1])}];
                } else {
                    r = [true, {'convTo': re1[1], 'convFrom': re3[1], 'fromValue': Utils.textToNumber(re3[2])}];
                }
                return r;
            }
        }
        {
            let re1 = Utils.kMatch(vb, 'verbDep', /(much|many).*how/i);
            let re2 = Utils.kMatch(vb, 'subj', /([^>,]*)>nummod>([^>,]*)/i);
            if (re1 && re2 && 'subjWhat' in vb) {
                let r = [true, {'convTo': vb.subjWhat, 'convFrom': re2[1], 'fromValue': Utils.textToNumber(re2[2])}];
                return r;
            }
        }


        if (vb.verb.match(/convert/i) && ('verbModWho' in vb || 'verbModWhat' in vb)) {
            //convert 29 thousand Chain in to  Foot.
            let re1 = Utils.kMatch(vb, 'obj', /([^>,]*)>nummod>([^>,]*)/i);
            if (!re1 && 'verbModWho' in vb && 'verbModWhat' in vb) {
                re1 = Utils.kMatch(vb, 'verbModWho', /([^>,]*)>nummod>([^>,]*)/i);
            }
            if (re1) {
                let r = [true, {'convTo': ('verbModWhat' in vb)?vb.verbModWhat:vb.verbModWho,
                    'convFrom': re1[1], 'fromValue': re1[2]}];
                return r;
            }
        }

        return [false, {}];
    }
}

export default QConvert;
