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
        assert.equal(1, matchResult.args['nodeFrom'].listExp.length);
        assert.equal(1, matchResult.args['nodeTo'].listExp.length);
        this.myResult = {
            nodeFrom: matchResult.args['nodeFrom'].listExp[0].args['fromArg'].listStr[0],
            nodeTo: matchResult.args['nodeTo'].listExp[0].args['toArg'].listStr[0],
            convD: matchResult.args['nodeFrom'].listExp[0].args['fromArgValue'].listStr[0],
            convN: matchResult.args['nodeTo'].listExp[0].args['toArgValue'].listStr[0]
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
        if( !match.isArgExpValid('nodeFrom') || !match.isArgExpValid('nodeTo')) {
            return false;
        }

        //if (!(match.args['nodeFrom'].listExp.length >= 1 &&
//            match.args['nodeTo'].listExp.length >= 1)) {
//            return false;
//        }

        // check if from node is valid
        let found = false;
        for (let idx = 0 ; idx < match.getArgExpLength('nodeFrom'); ++idx) {
            let dt = match.getArgExp('nodeFrom', idx);
//        }
//        for (let dt of match.args['nodeFrom'].listExp) {
            if (found) break;
            //if (dt.args['fromArg'].listStr.length !== 1 || dt.args['fromArg'].listStr[0] === undefined) continue;
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
        } else {
            //console.log('  foundItem = ' + foundItem);
            // remove all the other arguments
            /*
            for (let dt of  match.args['nodeFrom'].listExp) {
                let argName = Utils.normalizeUnit(dt.args['fromArg']);
                if (argName === foundItem) {
             match.args['nodeFrom'].listExp = [dt];
                    break;
                }
            }
            console.log('  args nodeFrom = ' + JSON.stringify(match.args['nodeFrom']));
            */
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
        } else {
            /*
            // remove all the other arguments
            for (let dt of  match.args['nodeTo'].listExp) {
                let argName = Utils.normalizeUnit(dt.args['toArg']);
                if (argName === foundItem) {
                    match.args['nodeTo'].listExp = [dt];
                    break;
                }
            }*/
        }
        if (match.isDefaultUsed('nodeFrom') && match.isDefaultUsed('nodeTo'))
            return false;
        return found;
    }

}

export default relationMath;
