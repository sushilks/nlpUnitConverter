'use strict';

var Utils = require('../nodes_utils');
var BaseExp = require('./base_exp.js');
var assert = require('assert');
var dbg = require('debug')('node:exp:default');


class ToArg extends BaseExp {
    constructor(nodes, matchResult) {
        super(nodes, matchResult);
        this.name=ToArg.getName();
    }
    static getName() {
        return 'toArg';
    }
    static getMatchToken() {
        return ['VerbBase'];
    }
    static getArgs() {
        return {
            'toArg': {},
            'toArgValue' : {
                type: 'Number',
                extractionNode: 'toArg',
                default: 1
            }
        };
    }
    static getProp() {
        return {singleVerbEdge : true};
    }

    exec(gr) {
        //console.log('\t IMPLEMENT THIS :: Adding to graph:' + this.getName());
        let r = {};
        r[this.result.args.toArg.listStr[0]] = this.result.args.toArgValue.listStr[0];
        return r;
    }
}

export default ToArg;