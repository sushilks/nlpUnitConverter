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
    static getArgs(): ExpArgType {
        return {
            input: {
                'toArg': {type: ''},
                'toArgValue': {
                    type: 'Number',
                    extractionNode: 'toArg',
                    default: 1
                },
            },
            output: {
                dtName: { type: 'string' },
                dtValue: { type: 'Number' }
            }
        };
    }
    static getProp(): ExpPropType {
        return {singleVerbEdge : true};
    }

    exec(globalBucket: GlobalBucket): ExpExecReturn {
        //console.log('\t IMPLEMENT THIS :: Adding to graph:' + this.getName());
        let r = {};
        //r[this.result.args.toArg.listStr[0]] = this.result.args.toArgValue.listStr[0];
        r[this.toArg] = this.toArgValue;
        dbg('fromArg::EXEC = ' + JSON.stringify(r));
        return r;
    }
}

export default ToArg;