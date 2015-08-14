'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');

class NMod {
    constructor(nodes, matchResult) {
        this.nodes = nodes;
        this.nmodToken = matchResult.nmodNode;
        this.selfNodeId = matchResult.selfNode
        this.nmodLink = matchResult.nmodLink;
        this.dbg = nodes.dbg;
    }
    getName() {
        return 'nmod';
    }
    getValues() {
        return this.nodes.getTokens().getToken(this.selfNodeId) + '>' + this.nmodLink + '>' +
            this.nodes.getNodeMap(this.nmodToken).getValues();
    }
    text() {
        return 'nmod [' + this.getValues() + ']';
    }
    static getMatchToken() {
        return ['.*:NN.*','.*:JJ.*', '.*:EX'];
    }

    static checkValid(nodeList, node) {
        let t1 = Utils.checkChildLinks(node, 'nmod.*');
        if (t1 && t1.length) {
            assert.equal(t1.length,1,'Un-Implemented.' + t1.length);
            let ndToken = node.getToken();
            let ndPOS = nodeList.getNodeMap(t1[0]).getTokenPOS();
            if (ndPOS.match(/(NN|JJ)/)) {
                if (nodeList.dbg) {
                    console.log('  - COMPOUND[' + ndToken + ']: to [' + node.nodes.getTokens().getToken(t1[0])
                        + ']:' + t1[0] );
                }
                let c1 = node.getChild(t1[0]);

                return [true, {'selfNode': node.getTokenId(), 'nmodNode': t1[0], 'nmodLink': c1.type }];
            }
        }
        return [false, {}];
    }
}

export default NMod;