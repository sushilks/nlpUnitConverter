/// <reference path="../nodes.d.ts" />
/// <reference path="base_exp.d.ts" />
'use strict';

import * as Utils from '../nodes_utils';
import BaseExp from './base_exp';
var dbg = require('debug')('node:exp:variables');


class FormatComma extends BaseExp {
    varName: string;
    varValue: any;
    constructor(nodes: Nodes, matchResult: ExpMatch) {
        super(nodes, matchResult);
        this.varName = this.result.getArgStr('varName');
        this.varValue = this.result.getArgStr('varValue');
    }
    static getName(): string {
        return 'Variable';
    }
    static getArgs(): ExpArgType {
        return {
            input: {
                varName: { type: 'string'},
                varValue: { type: 'string'}
            },
            output: {
            }
        };
    }

    exec(globalBucket: GlobalBucket): ExpExecReturn {
        // count backwart from the end and insert a comma every
        if (!globalBucket.var)
            globalBucket.var = {};
        globalBucket.var[this.varName] = this.varValue;
        // 3 characters
        return {};
    }

}

export default FormatComma;