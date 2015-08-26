'use strict';

var Utils = require('../nodes_utils');

class ExpBase {
    constructor(nodes, matchResult) {
        this.nodes = nodes;
        this.dbg = nodes.dbg;
        this.name = 'expBase';
        this.result = matchResult;
    }

    static getMatchToken() {
        return ['DEFAULT'];
    }

    getName() {
        return this.name;
    }
    getResult() {
        return this.result;
    }
    text() {
        return this.getName() + ' Data [' + JSON.stringify(this.result) + ']';
    }
    exec(gr) {
        //console.log('Adding to graph:' + this.getName());
        //console.log('Graph name:' + this.getUnitsFor());
        console.trace('IMPLEMENT ME PLEASE');
    }
    static checkValid(gr) {
        return [false, {}];
    }
}

export default ExpBase;
