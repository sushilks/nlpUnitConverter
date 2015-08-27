'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');
var dbg = require('debug')('node:gr:dep');

class DEP {
    constructor(nodes, matchResult) {
        this.nodes = nodes;
        this.depList = matchResult.dep;
        this.selfNodeId = matchResult.selfNode
        this.dbg = nodes.dbg;
    }
    getName() {
        return 'dep';
    }
    getValues() {
        let nd = this.nodes.getNodeMap(this.selfNodeId).getToken();
        let val = [];
        for (let tid of this.depList) {
            val.push(nd + '>dep>' + this.nodes.getNodeMap(tid).getValues());
        }
        return val.join(',');
    }
    text() {
        return this.getName() + ' [' + this.getValues() + ']';
    }
    static getMatchToken() {
        return ['.*:WRB', '.*:JJ.*', '.*:NN.*', '.*:EX'];
    }

    static checkValid(nodeList, node) {
        let t1 = Utils.checkChildLinks(node, 'dep');
        if (t1 && t1.length) {
            let retList = [];
            let ndToken = node.getToken();
            for (let tid of t1) {
                let ndPOS = nodeList.getNodeMap(tid).getTokenPOS();
                if (ndPOS.match(/(JJ|WRB|NN.*)/)) {
                    dbg('  -     DEP[' + ndToken + ']: to [' + node.nodes.getTokens().getToken(tid)
                        + ']:' + tid);
                    retList.push(tid)
                }
            }
            return [retList.length > 0, {'selfNode': node.getTokenId(), 'dep': retList}];
        }
        return [false, {}];
    }
}

export default DEP;