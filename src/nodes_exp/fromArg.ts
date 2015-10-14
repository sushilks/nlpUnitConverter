/// <reference path="../nodes.d.ts" />
/// <reference path="base_exp.d.ts" />
import {NodeStringDecoder} from "string_decoder";
'use strict';

import * as Utils from '../nodes_utils';
import BaseExp from './base_exp';
var assert = require('assert');
var dbg = require('debug')('node:exp:default');


class FromArg extends BaseExp {
    constructor(nodes: Nodes, matchResult: ExpMatch) {
        super(nodes, matchResult);
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

    exec(gr: NodeGraph): boolean {
        //console.log('\t IMPLEMENT THIS :: Adding to graph:' + this.getName());
        //console.log(' MATCH = ' + JSON.stringify(this.result));
        let r = {};
        //r[this.result.args.fromArg.listStr[0]] = this.result.args.fromArgValue.listStr[0];
        r[this.result.getArgStr('fromArg')] = this.result.getArgStr('fromArgValue');
        dbg('fromArg::EXEC = ' + JSON.stringify(r));
        return true;
    }
}

export default FromArg;