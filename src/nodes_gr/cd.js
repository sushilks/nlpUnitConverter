'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');

class CD {
    constructor(nodes, matchResult) {
        this.nodes = nodes;
        this.selfNodeId = matchResult.selfNode
        this.dbg = nodes.dbg;
    }
    getName() {
        return 'cd';
    }
    getValues() {
        let nd = this.nodes.getNodeMap(this.selfNodeId).getToken();
        return nd.replace(/,/g,'');
    }
    text() {
        return this.getName() + ' [' + this.getValues() + ']';
    }
    static getMatchToken() {
        return ['.*:CD'];
    }

    static checkValid(nodeList, node) {
        return [true, {'selfNode': node.getTokenId()}];
    }
}

export default CD;