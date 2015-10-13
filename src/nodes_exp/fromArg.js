'use strict';

var Utils = require('../nodes_utils');
var BaseExp = require('./base_exp.js');
var assert = require('assert');
var dbg = require('debug')('node:exp:default');


class FromArg extends BaseExp {
    constructor(nodes, matchResult) {
        super(nodes, matchResult);
        this.name=FromArg.getName();
    }
    static getName() {
        return 'fromArg';
    }
    static getMatchToken() {
        return ['VerbBase'];
    }
    static getArgs() {
        return {
            'fromArg': {},
            'fromArgValue' : {
                type: 'Number',
                extractionNode: 'fromArg',
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
        r[this.result.args.fromArg.listStr[0]] = this.result.args.fromArgValue.listStr[0];
        return r;
    }
}

export default FromArg;