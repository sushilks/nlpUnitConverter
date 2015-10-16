/// <reference path="../nodes.d.ts" />
/// <reference path="base_exp.d.ts" />
'use strict';

import * as Utils from '../nodes_utils';
import BaseExp from './base_exp';
//var assert = require('assert');
var dbg = require('debug')('node:exp:units');
var assert = require('assert');

/*
*/

class Units extends BaseExp {
    unitsFor: string;
    units: Array<string>;
    constructor(nodes: Nodes, matchResult: ExpMatch) {
        super(nodes, matchResult);
        this.name = Units.getName();
        assert.equal(this.result.getArgStrLength('unitsFor'), 1);
        this.unitsFor = this.result.getArgStr('unitsFor');
        this.units = this.result.getArgStrArray('units');
    }
    static getName(): string {
        return 'Units';
    }

    static getMatchToken(): Array<string> {
        return ['VerbBase'];
    }
    static getArgs(): {[key: string]: ExpArgType} {
        return {
            'unitsFor': {type: ''},
            'units': {type: 'List'}
        };
    }
    exec(globalBucket: GlobalBucket): boolean {
        let gr = globalBucket.gr;
        //dbg('Adding to graph:' + this.getName());
        //dbg('Graph name:' + this.getUnitsFor());
        // console.log('units :: exec = ' + JSON.stringify(this.result));
        let g = gr[this.unitsFor];
        if (!g) {
            console.log('ERROR: Dont know about [' + this.unitsFor + ']');
        }
        dbg('UNIT = ' + JSON.stringify(this.units));
        this.units.forEach((function (this_, x) {
            g.addNode(Utils.normalizeUnit(x), {unitFor: this_.unitsFor});
        }).bind(null, this));
        return true;
    }
}

export default Units;
