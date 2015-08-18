'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');

class MOD {
    constructor(nodes, matchResult) {
        this.nodes = nodes;
        this.modList = matchResult.mod;
        this.selfNodeId = matchResult.selfNode
        this.dbg = nodes.dbg;
    }
    getName() {
        return 'mod';
    }
    getValues() {
        let nd = this.nodes.getNodeMap(this.selfNodeId).getToken();
        let val = [];
        for (let tid of this.modList) {
            val.push(nd + '>mod>' + this.nodes.getNodeMap(tid).getValues());
        }
        return val.join(',');
    }
    text() {
        return this.getName() + ' [' + this.getValues() + ']';
    }
    static getMatchToken() {
        return ['.*:WRB', '.*:JJ.*', '.*:NN.*'];
    }

    static checkValid(nodeList, node) {
        let t1 = Utils.checkChildLinks(node, 'amod|advmod');
        if (t1 && t1.length) {
            let retList = [];
            let ndToken = node.getToken();
            for (let tid of t1) {
                let ndPOS = nodeList.getNodeMap(tid).getTokenPOS();
                //if (ndPOS.match(/(JJ|WRB)/)) {
                if (true) {
                    if (nodeList.dbg) {
                        console.log('  -     MOD[' + ndToken + ']: to [' + node.nodes.getTokens().getToken(tid)
                            + ']:' + tid);
                    }
                    retList.push(tid)
                }
            }
            return [retList.length > 0, {'selfNode': node.getTokenId(), 'mod': retList}];
        }
        return [false, {}];
    }
}

export default MOD;