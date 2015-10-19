/// <reference path="../nodes.d.ts" />
/// <reference path="base_exp.d.ts" />
'use strict';

import * as Utils from '../nodes_utils';
import BaseExp from './base_exp';
var assert = require('assert');
var dbg = require('debug')('node:exp:default');


class DefaultUnit extends BaseExp {
    constructor(nodes: Nodes, matchResult: ExpMatch) {
        super(nodes, matchResult);
        this.name=DefaultUnit.getName();
    }
    static getName(): string {
        return 'Default';
    }
    static getArgs(): ExpArgType {
        return {
            input: {
                defaultWhat: { type: 'string'},
                defaultFor: { type: 'string'},
                default:{ type: 'string'}
            },
            output: {
            }
        };
    }

    exec(globalBucket: GlobalBucket): ExpExecReturn {
        // console.log('\t IMPLEMENT THIS :: Adding to graph:' + this.getName());
        return {};
    }
}

export default DefaultUnit;