'use strict';

var Utils = require('../nodes_utils');
var BaseExp = require('./base_exp.js');
var dbg = require('debug')('node:exp:rel');


class relationMath extends BaseExp {
    constructor(nodes, matchResult) {
        //console.trace(" ----> " + JSON.stringify(matchResult));
        matchResult.r = {};
        matchResult.r.nodeFrom = matchResult.args.nodeFrom.args.fromArg;
        matchResult.r.nodeTo = matchResult.args.nodeTo.args.toArg;
        matchResult.r.convD = matchResult.args.nodeFrom.args.fromArgValue;
        matchResult.r.convN = matchResult.args.nodeTo.args.toArgValue;
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
        console.log('ERROR Unable to add relation between [' + nFrom + '] and [' + nTo + '], one of these nodes is not defined');
    }
    static checkValidArguments(nodes, match, graphDB) {
        // console.log(' ------------------- ' + graphDB+ " :: " + Object.keys(graphDB));
        //let e = new Error().stack;
        //console.log(' match2 = ' + JSON.stringify(match));
        if (!(match.args.nodeFrom &&
            match.args.nodeTo)) {
            return false;
        }

        // check if from node is valid
        let found = false;
        for (let dt of match.args.nodeFrom) {
            if (found) break;
            let argName = Utils.normalizeUnit(dt.args.fromArg);
            for (let key in graphDB) {
                if (graphDB[key].hasNode(argName)) {
                    // found
                    match.args.nodeFrom = dt;
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            //console.log(' missing Valid ArgFrom');
            return false;
        }
        found = false;
        for (let dt of match.args.nodeTo) {
            if (found) break;
            let argName = Utils.normalizeUnit(dt.args.toArg);
            for (let key in graphDB) {
                if (graphDB[key].hasNode(argName)) {
                    // found
                    match.args.nodeTo = dt;
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
           // console.log(' missing Valid ArgTo');
            return false;
        }


        //console.log(e);
        if (match.args.nodeFrom &&
            match.args.nodeTo &&
            match.defaultUsed.indexOf('nodeFrom') !== -1 &&
            match.defaultUsed.indexOf('nodeTo') !== -1) {
            return false;
        }
        return found;
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
    }

}

export default relationMath;
