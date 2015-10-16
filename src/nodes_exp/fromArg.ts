/// <reference path="../nodes.d.ts" />
/// <reference path="base_exp.d.ts" />
import {NodeStringDecoder} from "string_decoder";
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
    static getMatchToken(): Array<string> {
        return ['VerbBase'];
    }
    static getArgs(): {[key: string]: ExpArgType} {
        return {
            'fromArg': { type: ''},
            'fromArgValue' : {
                type: 'Number',
                extractionNode: 'fromArg',
                default: 1
            }
        };
    }
    static getProp(): ExpPropType {
        return {singleVerbEdge : true};
    }

    exec(globalBucket: GlobalBucket): boolean {
        let r = {};
        r[this.fromArg] = this.fromArgValue;
        dbg('fromArg::EXEC = ' + JSON.stringify(r));
        return true;
    }
}

export default FromArg;