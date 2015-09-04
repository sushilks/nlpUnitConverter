'use strict';

var Utils = require('../nodes_utils');
var BaseExp = require('./base_exp.js');
var dbg = require('debug')('node:exp:rel');


class relationMath extends BaseExp {
    constructor(nodes, matchResult) {
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
        return ['nodeFrom', 'nodeTo', 'convD', 'convN'];
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
}

export default relationMath;
