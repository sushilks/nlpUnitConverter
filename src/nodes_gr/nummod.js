'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');

class NumMod {
    constructor(nodes, matchResult) {
        this.nodes = nodes;
        this.nummodToken = matchResult.nummodNode;
        this.selfNodeId = matchResult.selfNode
        this.nummodLink = matchResult.nummodLink;
        this.dbg = nodes.dbg;
    }
    getName() {
        return 'nummod';
    }
    getValues() {
        let r = [];
        for (let itm of this.nummodToken) {
            r.push(this.nodes.getNodeMap(itm).getValues());
        }
        return this.nodes.getTokens().getToken(this.selfNodeId) + '>' + this.nummodLink + '>' +
            r.join(' ');
    }
    text() {
        return '[' + this.getValues() + ']';
    }
    static getMatchToken() {
        return ['.*:NN.*'];
    }

    static checkValid(nodeList, node) {
        let t1 = Utils.checkChildLinks(node, 'nummod');
        if (t1 && t1.length) {
            //assert.equal(t1.length,1,'Un-Implemented.' + t1.length);
            let ndToken = node.getToken();
            let res = [];
            let link = '';
            for (let idx in t1) {
                let ndPOS = nodeList.getNodeMap(t1[idx]).getTokenPOS();
                if (ndPOS.match(/CD/)) {
                    if (nodeList.dbg) {
                        console.log('  - NUMMOD[' + ndToken + ']: to [' + node.nodes.getTokens().getToken(t1[idx])
                            + ']:' + t1[idx]);
                    }
                    let c1 = node.getChild(t1[idx]);
                    link = c1.type;
                    res.push(t1[idx]);
                }
            }
            return [true, {'selfNode': node.getTokenId(), 'nummodNode': res, 'nummodLink': link }];
        }
        return [false, {}];
    }
}

export default NumMod;