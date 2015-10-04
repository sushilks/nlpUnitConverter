'use strict';

var Utils = require('../nodes_utils');
var BaseExp = require('./base_exp.js');
//var assert = require('assert');
var dbg = require('debug')('node:exp:units');

/*
*/

class Units extends BaseExp {
    constructor(nodes, matchResult) {
        super(nodes, matchResult);
        this.name = Units.getName();
    }
    static getName() {
        return 'Units';
    }

    static getMatchToken() {
        return ['VerbBase'];
    }
    static getArgs() {
        //return ['unitsFor', 'List:units'];
        return {
            'unitsFor': {},
            'units': {type: 'List'}
        };
    }
    exec(gr) {
        //dbg('Adding to graph:' + this.getName());
        //dbg('Graph name:' + this.getUnitsFor());
        //console.log('units :: exec = ' + JSON.stringify(this.result));
        let nm = this.result.args.unitsFor;
        let g = gr[nm];
        if (!g) {
            console.trace('ERROR: Dont know about [' + nm + ']');
        }
        let units = this.result.args['units'];
        // console.log('UNIT = ' + units);
        if (Array.isArray(units)) {
            units.forEach(function (x) {
                //dbg(' UNIT =  ' + x)
                g.addNode(Utils.normalizeUnit(x), {unitFor: nm});
            });
        } else {
            g.addNode(Utils.normalizeUnit(units), {unitFor: nm});
        }
    }
    /*
     function definition of Units:
     Units accepts the following argument.
     - argument units-for of type string, indicating who the unit is for.
     - argument 'units' of type list, a list of units that are getting defined.
    when called :
    exec(gr) {
        //dbg('Adding to graph:' + this.getName());
        //dbg('Graph name:' + this.getUnitsFor());
        let nm = this.result.unitsFor;
        let g = gr[nm];
        if (!g) {
            console.trace('ERROR: Dont know about [' + nm + ']');
        }
        let units = this.result['units'];
        //console.log('UNIT = ' + units);
        if (Array.isArray(units)) {
            units.forEach(function (x) {
                //dbg(' UNIT =  ' + x)
                g.addNode(Utils.normalizeUnit(x), {unitFor: nm});
            });
        } else {
            g.addNode(Utils.normalizeUnit(units), {unitFor: nm});
        }
    }

    */
}

export default Units;
