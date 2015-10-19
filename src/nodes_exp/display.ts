/// <reference path="../nodes.d.ts" />
/// <reference path="base_exp.d.ts" />
'use strict';

import * as Utils from '../nodes_utils';
import BaseExp from './base_exp';
var dbg = require('debug')('node:exp:display');


class FormatComma extends BaseExp {
    dataIn: string;
    constructor(nodes: Nodes, matchResult: ExpMatch) {
        super(nodes, matchResult);
        this.dataIn = this.result.getArgStr('data');
    }
    static getName(): string {
        return 'FormatComma';
    }
    static getArgs(): ExpArgType {
        return {
            input: {
                data: { type: 'string'}
            },
            output: {
            }
        };
    }

    exec(globalBucket: GlobalBucket): ExpExecReturn {
        console.log('::' + this.dataIn);
        return {};
    }

}

export default FormatComma;