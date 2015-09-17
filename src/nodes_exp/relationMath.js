'use strict';

var Utils = require('../nodes_utils');
var BaseExp = require('./base_exp.js');
var dbg = require('debug')('node:exp:rel');


class relationMath extends BaseExp {
    constructor(nodes, matchResult) {
        matchResult.convD = (matchResult['convD'])?matchResult['convD'] : 1;
        matchResult.convN = (matchResult['convN'])?matchResult['convN'] : 1;
        super(nodes, matchResult);
        this.name = relationMath.getName();
    }
    static getName() {
        return 'Relation';
    }
    static getMatchToken() {
        return ['VerbBase'];
    }
    static getArgs() {
        //return ['nodeFrom', 'nodeTo', 'convD', 'convN'];
        //return ['nodeFrom', 'nodeTo', 'Number:nodeFrom', 'Number:nodeTo'];
        return {
            'nodeFrom': {},
            'nodeTo': {},
            'convD': {type: 'Number', extractionNode: 'nodeFrom', default: 1},
            'convN': {type: 'Number', extractionNode: 'nodeTo', default: 1}
        };
    }
    exec(gr) {
//        console.log('Adding to graph:' + this.getName());
        let nFrom = Utils.normalizeUnit(this.result.nodeFrom);
        let nTo = Utils.normalizeUnit(this.result.nodeTo);
        for (let k in gr) {
            let g = gr[k];
            if (g.hasNode(nFrom) && g.hasNode(nTo)) {
                let conv = Utils.textToNumber(this.result.convN)/Utils.textToNumber(this.result.convD);
                dbg(this.getName() + ' :: Adding to graph From: ' +
                    nFrom + ' TO: ' + nTo + ' Conv : ' + conv);
                g.addEdge(nFrom, nTo, {conv: conv});
                g.addEdge(nTo, nFrom, {conv: 1.0/conv});
                return;
            }
        }
        console.log('ERROR Unable to add relation between [' + nFrom + '] and [' + nTo + '], one of these nodes are defined');
    }
    static checkValidArguments(nodes, match) {
        if (match.defaultUsed !== undefined && match.defaultUsed.indexOf('convD') !== -1 &&
            match.defaultUsed.indexOf('convN') !== -1) {
            return false;
        }
        if ((!(match.convD)) && (!(match.convN))) return false;
        // should check for node being present.
        return true;
    }

}

export default relationMath;
