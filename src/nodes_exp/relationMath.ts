/// <reference path="../nodes.d.ts" />
/// <reference path="base_exp.d.ts" />
/// <reference path="relationMath.d.ts" />

'use strict';

import * as Utils from '../nodes_utils';
import BaseExp from './base_exp';
var dbg = require('debug')('node:exp:rel');
var assert = require('assert');


class relationMath extends BaseExp {
    myResult: RelationMathResult;

    constructor(nodes: Nodes, matchResult: ExpMatch) {
        super(nodes, matchResult);
        //console.log(" ----> " + JSON.stringify(matchResult));
        assert.equal(1, matchResult.getArgExpLength('nodeFrom'));
        assert.equal(1, matchResult.getArgExpLength('nodeTo'));
        this.myResult = {
            nodeFrom: matchResult.getArgExp('nodeFrom').getArgStr('fromArg'),
            nodeTo: matchResult.getArgExp('nodeTo').getArgStr('toArg'),
            convD: matchResult.getArgExp('nodeFrom').getArgStr('fromArgValue'),
            convN: matchResult.getArgExp('nodeTo').getArgStr('toArgValue')
        };
       //console.log(" ----> " + JSON.stringify(this.myResult));
        //matchResult.convD = (matchResult['convD'])?matchResult['convD'] : 1;
        //matchResult.convN = (matchResult['convN'])?matchResult['convN'] : 1;
        this.name = relationMath.getName();
    }
    static getName(): string {
        return 'Relation';
    }
    static getMatchToken(): Array<string> {
        return ['VerbBase'];
    }
    static getArgs(): {[key: string]: ExpArgType} {
        return {
            'nodeFrom': {type: 'node', extractionNode: 'fromArg'},
            'nodeTo': {type: 'node', extractionNode: 'toArg'}
        };
    }
    exec(gr: NodeGraph): boolean {
//        console.log('Adding to graph:' + this.getName());
        let resData = this.myResult;
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
    static checkValidArguments(nodes: Nodes, match: ExpMatch, graphDB: NodeGraph) {
        // console.log(' ------------------- ' + graphDB+ " :: " + Object.keys(graphDB));
        //let e = new Error().stack;
        // console.log(' match2 = ' + JSON.stringify(match));
        dbg('CheckValidArguments: nodeFrom=' + match.getArgExp('nodeFrom').getArgStr('fromArg') +
        ' nodeTo=' + match.getArgExp('nodeTo').getArgStr('toArg'));
        if( !match.isArgExpValid('nodeFrom') || !match.isArgExpValid('nodeTo')) {
            return false;
        }

        // check if from node is valid
        let found = false;
        for (let idx = 0 ; idx < match.getArgExpLength('nodeFrom'); ++idx) {
            let dt = match.getArgExp('nodeFrom', idx);
            if (found) break;
            if (!dt.isArgStrValid('fromArg')) continue;
            let argName = Utils.normalizeUnit(dt.getArgStr('fromArg', 0));
            for (let key in graphDB) {
                if (graphDB[key].hasNode(argName)) {
                    // found
                    //-- match.args['nodeFrom'] = dt;
                    match.args['nodeFrom'].listExp = [dt];
                    //console.log(' =====nodeFrom ' + JSON.stringify(match.args['nodeFrom'].listExp));
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            console.log(' missing Valid ArgFrom');
            return false;
        }
        found = false;
        for (let idx = 0 ; idx < match.getArgExpLength('nodeTo'); ++idx) {
            let dt = match.getArgExp('nodeTo', idx);
//        for (let dt of match.args['nodeTo'].listExp) {
            if (found) break;
//            if (dt.args['toArg'].listStr.length !== 1 || dt.args['toArg'].listStr[0] === undefined) continue;
            if (!dt.isArgStrValid('toArg')) continue;
            let argName = Utils.normalizeUnit(dt.getArgStr('toArg',0));
            for (let key in graphDB) {
                if (graphDB[key].hasNode(argName)) {
                    // found
                    //-- match.args['nodeTo'] = dt;
                    match.args['nodeTo'].listExp = [dt];
                    //console.log(' =====nodeTo ' + JSON.stringify(match.args['nodeTo'].listExp));
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
           console.log(' missing Valid ArgTo');
            return false;
        }
        if (match.isDefaultUsed('nodeFrom') && match.isDefaultUsed('nodeTo'))
            return false;
        dbg('CheckValidArguments: returning [' + found + ']');
        return found;
    }

}

export default relationMath;
