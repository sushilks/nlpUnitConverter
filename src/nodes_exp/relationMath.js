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
        this.name = 'Converter';
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

    static checkValid(gr) {
        const VerbMatch = ['is', 'are'];

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

        if (gr.dbg) {
            console.log('     verb:' + verb + ' SUBJ:' + gr.getSubject() + ' OBJ:' + gr.getObject());
            console.log('     subjOnly:' + gr.getSubjectOnly() + ' WHO:' + gr.getSubjectWho());
            console.log('     objOnly:' + gr.getObjectOnly() + ' WHEN:' + gr.getObjectWhen()
            + ' WHAT:' + gr.getObjectWhat());
        }
        if (!Utils.checkMatchAny(verb, VerbMatch)) {
            return [false, {}];
        }
        let re1 = verbSubj.match(/([^,>]*)(>nummod>|,)([^,>]*)/);
        let re2 = verbObj.match(/([^,>]*)(>nummod>|,)([^,>]*)/);
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
        return [false, {}];
    }
}

export default relationMath;
