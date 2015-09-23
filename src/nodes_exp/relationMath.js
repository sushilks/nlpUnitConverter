'use strict';

var Utils = require('../nodes_utils');
var BaseExp = require('./base_exp.js');
var dbg = require('debug')('node:exp:rel');


class relationMath extends BaseExp {
    constructor(nodes, matchResult) {
        //console.trace(" ----> " + JSON.stringify(matchResult));
        matchResult.r = {};
        matchResult.r.nodeFrom = matchResult.nodeFrom.fromArg;
        matchResult.r.nodeTo = matchResult.nodeTo.toArg;
        matchResult.r.convD = matchResult.nodeFrom.fromArgValue;
        matchResult.r.convN = matchResult.nodeTo.toArgValue;
       // console.trace(" ----> " + JSON.stringify(matchResult));
        //matchResult.convD = (matchResult['convD'])?matchResult['convD'] : 1;
        //matchResult.convN = (matchResult['convN'])?matchResult['convN'] : 1;
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
            'nodeFrom': {type: 'node', extractionNode: 'fromArg'},
            'nodeTo': {type: 'node', extractionNode: 'toArg'}
//            'convD': {type: 'Number', extractionNode: 'nodeFrom', default: 1},
//            'convN': {type: 'Number', extractionNode: 'nodeTo', default: 1}
        };
    }
    exec(gr) {
        console.log
//        console.log('Adding to graph:' + this.getName());
        let resData = this.result.r;
        let nFrom = Utils.normalizeUnit(resData.nodeFrom);
        let nTo = Utils.normalizeUnit(resData.nodeTo);
        for (let k in gr) {
            let g = gr[k];
            if (g.hasNode(nFrom) && g.hasNode(nTo)) {
                let conv = Utils.textToNumber(resData.convN)/Utils.textToNumber(resData.convD);
                dbg(this.getName() + ' :: Adding to graph From: ' +
                    nFrom + ' TO: ' + nTo + ' Conv : ' + conv);
                g.addEdge(nFrom, nTo, {conv: conv});
                g.addEdge(nTo, nFrom, {conv: 1.0/conv});
                return;
            }
        }
        console.log('ERROR Unable to add relation between [' + nFrom + '] and [' + nTo + '], one of these nodes are defined');
    }
    static checkValidArguments(nodes, match, graphDB) {
        //console.log(' match = ' + JSON.stringify(match));
        if (match.nodeFrom &&
            match.nodeTo &&
            match.nodeFrom.defaultUsed &&
            match.nodeTo.defaultUsed) {
            return false;
        }
/*
        console.log(' ---> A1');
        if (match.defaultUsed !== undefined && match.defaultUsed.indexOf('convD') !== -1 &&
            match.defaultUsed.indexOf('convN') !== -1) {
            console.log(' ---> A2');
            return false;
        }
        if ((!(match.convD)) && (!(match.convN))) return false;
        // should check for node being present.
        console.log(' ---> A3');
*/
        return true;
    }

}

export default relationMath;
