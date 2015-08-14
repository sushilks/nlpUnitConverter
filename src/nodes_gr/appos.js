'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');

class APPOS {
    constructor(nodes, matchResult) {
        this.nodes = nodes;
        this.apposList = matchResult.appos;
        this.selfNodeId = matchResult.selfNode
        this.dbg = nodes.dbg;
    }
    getName() {
        return 'appos';
    }
    getValues() {
        let val = this.nodes.getNodeMap(this.selfNodeId).getToken();
        for (let tid of this.apposList) {
            val = val + ',' + this.nodes.getNodeMap(tid).getValues();
        }
        return val;
    }
    text() {
        return 'apppos [' + this.getValues() + ']';
    }
    static getMatchToken() {
        return ['.*:NN.*', '.*:CD.*'];
    }

    static checkValid(nodeList, node) {
        let t1 = Utils.checkChildLinks(node, 'appos|conj:and');
        if (t1 && t1.length) {
            let retList = [];
            let ndToken = node.getToken();
            for (let tid of t1) {
                let ndPOS = nodeList.getNodeMap(tid).getTokenPOS();
                if (ndPOS.match(/NN/)) {
                    if (nodeList.dbg) {
                        console.log('  -     APPOS[' + ndToken + ']: to [' + node.nodes.getTokens().getToken(tid)
                            + ']:' + tid);
                    }
                    retList.push(tid)
                }
            }
            return [retList.length > 0, {'selfNode': node.getTokenId(), 'appos': retList}];
        }
        return [false, {}];
    }
}

export default APPOS;