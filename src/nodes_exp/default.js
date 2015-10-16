'use strict';

var Utils = require('../nodes_utils');
var BaseExp = require('./base_exp.js');
var assert = require('assert');
var dbg = require('debug')('node:exp:default');


class DefaultUnit extends BaseExp {
    constructor(nodes, matchResult) {
        super(nodes, matchResult);
        this.name=DefaultUnit.getName();
    }
    static getName() {
        return 'Default';
    }
    static getMatchToken() {
        return ['VerbBase'];
    }
    static getArgs() {
        return {'defaultWhat': {}, 'defaultFor': {}, 'default':{}};
    }

    exec(globalBucket) {
        // console.log('\t IMPLEMENT THIS :: Adding to graph:' + this.getName());
    }
}

export default DefaultUnit;