/// <reference path="../nodes.d.ts" />
/// <reference path="base_exp.d.ts" />

'use strict';
import * as Utils from '../nodes_utils';
var dbg = require('debug')('node:exp:base');
var assert = require('assert');
class ExpBase {
    nodes: any;
    result: ExpMatch;
    name: string;

    constructor(nodes: Nodes, matchResult: ExpMatch) {
        this.nodes = (function(nd: Nodes): Nodes { return nd; }).bind(null, nodes);
        // this.dbg = nodes.dbg;
        this.name = 'expBase';
        // "matchResult":{"args":
        //               {"toArgValue":1,"toArg":"dollar"},
        //              "defaultUsed":["toArgValue"],
        //              "_keys":{"toArgValue":"verb.subj.nmod:in.numnode.dataValue",
        //                       "toArg":"verb.subj.nmod:in.token"}}
        this.result = matchResult;
    }

    static getMatchToken(): ExpTokenType {
        return ['VerbBase'];
//        return ['DEFAULT_'];//{'DEFAULT': {} };
    }
    static getProp(): ExpPropType {
        return null;
    }

    static getName(): string {
        return 'DEFAULT_';//this.name;
    }

    getName(): string {
        return this.name;
    }

    getResult(): ExpMatch {
        return this.result;
    }
    static getArgs(): ExpArgType {
        console.log('Implement getArgs().');
        assert(1,0);
        return null;
    }
    text(): string {
        return this.name + ' Data [' + JSON.stringify(this.result) + ']';
    }
    exec(globalBucket: GlobalBucket): ExpExecReturn {
        //console.log('Adding to graph:' + this.getName());
        //console.log('Graph name:' + this.getUnitsFor());
        console.log('IMPLEMENT ME PLEASE');
        assert(1,0);
        return {};
    }
/*
    static checkValid(gr: NodeGraph): [boolean, ExpMatch] {
        // deprecated/
        return [false, null];
    }
*/
    static checkValidArguments(nodes: Nodes, match: ExpMatch, graphDB: GlobalBucket) {
        return true;
    }
}

export default ExpBase;
