/// <reference path="../nodes.d.ts" />
/// <reference path="base_exp.d.ts" />
'use strict';

import * as Utils from '../nodes_utils';
import BaseExp from './base_exp';
var assert = require('assert');
var dbg = require('debug')('node:exp:default');


class ToArg extends BaseExp {
    toArg: string;
    toArgValue: string;
    constructor(nodes: Nodes, matchResult: ExpMatch) {
        super(nodes, matchResult);
        this.name = ToArg.getName();
        this.toArg = this.result.getArgStr('toArg');
        this.toArgValue = this.result.getArgStr('toArgValue');
    }
    static getName(): string {
        return 'toArg';
    }
    static getMatchToken(): Array<string> {
        return ['VerbBase'];
    }
    static getArgs(): {[key: string]: ExpArgType} {
        return {
            'toArg': { type: ''},
            'toArgValue' : {
                type: 'Number',
                extractionNode: 'toArg',
                default: 1
            }
        };
    }
    static getProp(): ExpPropType {
        return {singleVerbEdge : true};
    }

    exec(globalBucket: GlobalBucket): boolean {
        //console.log('\t IMPLEMENT THIS :: Adding to graph:' + this.getName());
        let r = {};
        //r[this.result.args.toArg.listStr[0]] = this.result.args.toArgValue.listStr[0];
        r[this.toArg] = this.toArgValue;
        dbg('fromArg::EXEC = ' + JSON.stringify(r));
        return true;
    }
}

export default ToArg;