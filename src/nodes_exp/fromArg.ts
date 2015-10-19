/// <reference path="../nodes.d.ts" />
/// <reference path="base_exp.d.ts" />
'use strict';

import * as Utils from '../nodes_utils';
import BaseExp from './base_exp';
var assert = require('assert');
var dbg = require('debug')('node:exp:default');


class FromArg extends BaseExp {
    fromArg: string;
    fromArgValue: string;
    constructor(nodes: Nodes, matchResult: ExpMatch) {
        super(nodes, matchResult);
        this.fromArg = this.result.getArgStr('fromArg');
        this.fromArgValue = this.result.getArgStr('fromArgValue');
        this.name = FromArg.getName();
    }
    static getName(): string {
        return 'fromArg';
    }
    static getArgs(): ExpArgType {
        return {
            input: {
                'fromArg': {type: 'string'},
                'fromArgValue': {
                    type: 'Number',
                    extractionNode: 'fromArg',
                    default: 1
                }
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
        let r = {};
        r[this.fromArg] = this.fromArgValue;
        dbg('fromArg::EXEC = ' + JSON.stringify(r));
        return r;
    }
}

export default FromArg;