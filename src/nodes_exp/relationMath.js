'use strict';

var Utils = require('../nodes_utils');
//var assert = require('assert');

/*
*/

class relationMath {
    constructor(nodes, matchResult) {
        this.nodeFrom = matchResult.nodeFrom;
        this.nodeTo = matchResult.nodeTo;
        this.conv = matchResult.conv;
        this.nodes = nodes;
        this.dbg = nodes.dbg;
        this.name = 'Relation';
    }

    static getMatchToken() {
        return ['VerbBase'];
    }

    getName() {
        return this.name;
    }
    getNodeFrom() {
        return this.nodeFrom;
    }
    getNodeTo() {
        return this.nodeTo;
    }
    getConv() {
        return this.conv;
    }
    text() {
        return this.getName() + ' from [' + this.getNodeFrom() + '] to [' +
            this.getNodeTo() + '] conversionFactor:' + this.getConv();
    }
    exec(gr) {
//        console.log('Adding to graph:' + this.getName());
        let nFrom = this.getNodeFrom().replace(/s$/,'');
        let nTo = this.getNodeTo().replace(/s$/,'');
        for (let k in gr) {
            let g = gr[k];
            if (g.hasNode(nFrom) && g.hasNode(nTo)) {
                if (this.dbg) {
                    console.log(this.getName() + ' :: Adding to graph From: ' +
                        nFrom + ' TO: ' + nTo + ' Conv : ' + this.getConv());
                }
                g.addEdge(nFrom, nTo, {conv: this.getConv()});
                g.addEdge(nTo, nFrom, {conv: 1.0/this.getConv()});
                return;
            }
        }
        console.log('ERROR Unable to add relation between [' + nFrom + '] and [' + nTo + '], one of these nodes are defined');
    }
    static checkValid(gr) {
        const VerbMatch = ['is', 'are', 'make', 'makes', 'equals'];

        /*
         Grammar IDX = 2 :: Grammar Type [VerbBase] Matched Text  ::VerbBase verb=[is]
                Subj=[minute>nummod>one]
                Object=[equal>nmod:to>seconds>nummod>60]
                SubjOnly:minute>nummod>one
                ObjectOnly:equal>nmod:to>seconds>nummod>60

         Grammar IDX = 2 :: Grammar Type [VerbBase] Matched Text  ::VerbBase verb=[are]
                 Subj=[seconds>nmod:in>minute>nummod>one,seconds>nummod>60]
                 Object=[minute>nummod>one]
                 SubjOnly:seconds>nummod>60
                 ObjectOnly:minute>nummod>one

        */

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
        let verbSubjWhat = gr.getSubjectWhat();

        if (gr.dbg) {
            console.log('     verb:' + verb + ' SUBJ:' + gr.getSubject() + ' OBJ:' + gr.getObject());
            console.log('     subjOnly:' + gr.getSubjectOnly() + ' WHO:' + gr.getSubjectWho());
            console.log('     objOnly:' + gr.getObjectOnly() + ' WHEN:' + gr.getObjectWhen()
            + ' WHAT:' + gr.getObjectWhat());
        }
        if (!Utils.checkMatchAny(verb, VerbMatch)) {
            return [false, {}];
        }
        let re1 = verbSubj.match(/([^,>]*)(>nummod>)([^,>]*)/);
        let re2 = verbObj.match(/([^,>]*)(>nummod>)([^,>]*)/);
        if (re1 && re2) {
            let num1, num2;
            let nd1, nd2;
            if (re1[2] === ',') {
                num1 = Utils.textToNumber(re1[1]);
                nd1 = re1[3];
            } else {
                num1 = Utils.textToNumber(re1[3]);
                nd1 = re1[1];
            }

            if (re2[2] === ',') {
                num2 = Utils.textToNumber(re2[1]);
                nd2 = re2[3];
            } else {
                num2 = Utils.textToNumber(re2[3]);
                nd2 = re2[1];
            }
            return [true, { 'nodeFrom' : nd1, 'nodeTo' : nd2, 'conv' : num2/num1}]
        }

        re1 = verbSubj.match(/([^,>]*)(>nummod>)([^,>]*)/)
        re2 = verbObj.match(/([^,>]*)(>nummod>)([^,>]*)/);

        if ((re1 && !re2 && verbObj !== '') || (!re1 && re2 && verbSubj !== '')) {
            let num1, num2;
            let nd1, nd2;
            if (re1) {
                if (re1[2] === ',') {
                    num1 = Utils.textToNumber(re1[1]);
                    nd1 = re1[3];
                } else {
                    num1 = Utils.textToNumber(re1[3]);
                    nd1 = re1[1];
                }
                nd2 = verbObj;
                let objRe = nd2.match(/equal>nmod:to>([^,>]*)/);
                if (objRe) {
                    nd2 = objRe[1];
                } else if (nd2.match(/>/) || (verbSubjWhat !== '' && verbSubjWhat !== verbObj)) {
                    // if the object has any modifier
                    // safe to ignore it.
                    return [false, {}];
                }
                num2 = 1;
            } else {
                nd1 = verbSubj;
                num1 = 1;
                if (re2[2] === ',') {
                    num2 = Utils.textToNumber(re2[1]);
                    nd2 = re2[3];
                } else {
                    num2 = Utils.textToNumber(re2[3]);
                    nd2 = re2[1];
                }

            }
            return [true, { 'nodeFrom' : nd1, 'nodeTo' : nd2, 'conv' : num2/num1}]
        }


        return [false, {}];
    }
}

export default relationMath;
