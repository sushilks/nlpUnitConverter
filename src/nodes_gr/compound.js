'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');

class Compound {
    constructor(nodes, matchResult) {
        this.nodes = nodes;
        this.compoundToken = matchResult.compoundNode;
        this.selfNodeId = matchResult.selfNode
        this.isNumber = matchResult.isNumber;
        this.dbg = nodes.dbg;
    }
    getName() {
        return 'Compound';
    }
    getValues() {
        if (this.isNumber) {
            return this.nodes.getNodeMap(this.compoundToken).getValues() + ' ' +
                this.nodes.getTokens().getToken(this.selfNodeId);

        } else {
            return this.nodes.getTokens().getToken(this.selfNodeId) + '>compound>' +
                this.nodes.getNodeMap(this.compoundToken).getValues();

        }
    }
    text() {
        return 'Compound [' + this.getValues() + ']';
    }
    static getMatchToken() {
        return ['.*:NN.*', '.*:CD.*'];
    }

    static checkValid(nodeList, node) {
       // Utils.checkAndProcessChildNodeGrammar(nodeList, node);
        let t1 = Utils.checkChildLinks(node, 'compound');
        if (t1 && t1.length) {
            assert.equal(t1.length,1,'Un-Implemented.' + t1.length);
            let ndToken = node.getToken();
            let ndPOS = nodeList.getNodeMap(t1[0]).getTokenPOS();
            if (ndPOS.match(/(NN|CD)/)) {
                if (nodeList.dbg) {
                    console.log('  - COMPOUND[' + ndToken + ']: to [' + node.nodes.getTokens().getToken(t1[0])
                        + ']:' + t1[0] );
                }
                return [true, {'selfNode': node.getTokenId(), 'compoundNode': t1[0], 'isNumber':(ndPOS.match(/CD/)? true:false)}];
            }
        }
        return [false, {}];
    }
}

export default Compound;