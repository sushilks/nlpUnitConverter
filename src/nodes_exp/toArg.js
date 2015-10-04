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
        //console.log(' MATCH = ' + JSON.stringify(this.result));
        let r = {};
        r[this.result.args.toArg] = this.result.args.toArgValue;
        return r;
    }
}

export default ToArg;