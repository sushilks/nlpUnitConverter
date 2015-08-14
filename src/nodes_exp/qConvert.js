'use strict';

var Utils = require('../nodes_utils');
var Jsnx = require('jsnetworkx');
//var assert = require('assert');

/*
*/

class QConvert {
    constructor(nodes, matchResult) {
        this.convTo = matchResult.convTo;
        this.convFrom = matchResult.convFrom;
        this.fromValue = matchResult.fromValue;
        this.nodes = nodes;
        this.dbg = nodes.dbg;
        this.name = 'QConv';
    }

    static getMatchToken() {
        return ['VerbBase'];
    }

    getName() {
        return this.name;
    }
    text() {
        return this.getName() + ' Convert From [' + this.convFrom + '] Value [' +
            this.fromValue + '] TO [' + this.convTo + ']';
    }
    exec(gr) {
        //console.log('Adding to graph:' + this.getName());
        //console.log('Graph name:' + this.getUnitsFor());



        let nFrom = this.convFrom.replace(/s$/,'');
        let nTo = this.convTo.replace(/s$/,'');
        for (let k in gr) {
            let g = gr[k];
            if (g.hasNode(nFrom) && g.hasNode(nTo)) {
                let sp = Jsnx.shortestPath(g, {source: nFrom, target: nTo});
                if (this.dbg) {
                    console.log('SHORTEST PATH From:' + nFrom + ' TO:' + nTo +
                        ' is [' + sp + ']');
                }
                let currentNode = nFrom;
                sp.shift();
                let val = Utils.textToNumber(this.fromValue);
                for (let nextNode of sp) {
                    let ed = g.getEdgeData(currentNode, nextNode);
                    if (this.dbg) {
                        console.log('\t' + currentNode + '->' + nextNode + 'E[' + JSON.stringify(ed) + ']');
                    }
                    val = val * ed.conv;
                    currentNode = nextNode;
                }
                console.log('\t\t' + this.getName() + '::Converted ' + this.fromValue + ' ' + nFrom + ' to ' +
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
        //Grammar IDX = 3 :: Grammar Type [VerbBase] Matched Text  ::VerbBase verb=[make]
        // Subj=[Minutes>mod>many>mod>How] Object=[Day>nummod>1]
        // SubjOnly:Minutes>mod>many>mod>How ObjectOnly:Day>nummod>1
        //Grammar IDX = 3 :: Grammar Type [VerbBase] Matched Text  ::VerbBase verb=[are]
        // Subj=[Hours>mod>many>mod>How] Object=[Week>nummod>12]
        // SubjOnly:Hours>mod>many>mod>How ObjectOnly:Week>nummod>12

        {
            let re1 = verbSubj.match(/([^>,]*).*many.*how/i);
            let re2 = verbObj.match(/([^>,]*)>nummod>([^>,]*)/i);

            if (re1 && re2) {
                let r = [true, {'convTo': re1[1], 'convFrom': re2[1], 'fromValue': re2[2]}];
                //console.log("RETURNING r=" + JSON.stringify(r));
                return r;
            }
        }
        {
            //ubjOnly:Weeks ObjectOnly:there>dep>many>mod>How ObjectWhat:Hours>nummod>three million
            let re1 = verbObj.match(/.*many.*how/i);
            let re2 = verbWhat.match(/([^>,]*)>nummod>([^>,]*)/i);
            if (re1 && re2) {
                let r = [true, {'convTo': verbSubj, 'convFrom': re2[1], 'fromValue': re2[2]}];
                //console.log("RETURNING r=" + JSON.stringify(r));
                return r;
            }
        }
        if (verb.match(/convert/i)) {
            let re1 = verbObj.match(/([^>,]*)>nummod>([^>,]*)/i);
            if (re1) {
                let r = [true, {'convTo': verbSubj, 'convFrom': re1[1], 'fromValue': re1[2]}];
                return r;
            }
        }

        return [false, {}];
    }
}

export default QConvert;
