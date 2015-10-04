/// <reference path="base_exp.d.ts" />

'use strict';
declare function require(name:string);
import * as Utils from '../nodes_utils';
var dbg = require('debug')('node:exp:base');
var assert = require('assert');
class ExpBase {
    nodes: any;
    result: ExpBaseMatch;
    name: string;

    constructor(nodes: any, matchResult: ExpBaseMatch) {
        this.nodes = (function(nd) { return nd; }).bind(null, nodes);
        //this.dbg = nodes.dbg;
        this.name = 'expBase';
        //"matchResult":{"args":
        //               {"toArgValue":1,"toArg":"dollar"},
        //              "defaultUsed":["toArgValue"],
        //              "_keys":{"toArgValue":"verb.subj.nmod:in.numnode.dataValue",
        //                       "toArg":"verb.subj.nmod:in.token"}}
        this.result = matchResult;
    }

    static getMatchToken(): ExpTokenType {
        return {'DEFAULT': {} };
    }
    static getProp(): ExpPropType {
        return null;
    }

    getName(): string {
        return this.name;
    }
    getResult(): ExpBaseMatch {
        return this.result;
    }
    getArgs(): ExpArgType {
        console.log('Implement getArgs().');
        assert(1,0);
        return null;
    }
    text(): string {
        return this.getName() + ' Data [' + JSON.stringify(this.result) + ']';
    }
    exec(gr) {
        //console.log('Adding to graph:' + this.getName());
        //console.log('Graph name:' + this.getUnitsFor());
        console.log('IMPLEMENT ME PLEASE');
        assert(1,0);
    }
    static checkValid(gr): [boolean, ExpBaseMatch] {
        return [false, {args: null}];
    }
    static checkValidArguments(nodes, match) {
        return true;
    }
}

export default ExpBase;
