'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');
var dbg = require('debug')('node:gr:appos');

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
    getValues(r = '') {
        let val = (r !== '') ? r : this.nodes.getNodeMap(this.selfNodeId).getToken();
        for (let tid of this.apposList) {
            val = val + ' ' + this.nodes.getNodeMap(tid).getValues();
        }
        return val;
    }
    text() {
        return 'apppos [' + this.getValues() + ']';
    }
    static getMatchToken() {
        return ['.*:NN.*', '.*:CD.*', '.*:JJ.*'];
    }

    static checkValid(nodeList, node) {
        //Utils.checkAndProcessChildNodeGrammar(nodeList, node);
        let t1 = Utils.checkChildLinks(node, 'appos|conj:and');
        if (t1 && t1.length) {
            let retList = [];
            let ndToken = node.getToken();
            for (let tid of t1) {
                let ndPOS = nodeList.getNodeMap(tid).getTokenPOS();
                if (ndPOS.match(/NN/)) {
                    dbg('  -     APPOS[' + ndToken + ']: to [' + node.nodes.getTokens().getToken(tid)
                        + ']:' + tid);
                    retList.push(tid)
                }
            }
            return [retList.length > 0, {'selfNode': node.getTokenId(), 'appos': retList}];
        }
        return [false, {}];
    }
}

export default APPOS;