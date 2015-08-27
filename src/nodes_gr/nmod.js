'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');
var dbg = require('debug')('node:gr:dep');

class NMod {
    constructor(nodes, matchResult) {
        this.nodes = nodes;
        this.nmodList = matchResult.nmodList;
        //this.nmodToken = matchResult.nmodNode;
        //this.nmodLink = matchResult.nmodLink;
        this.selfNodeId = matchResult.selfNode;
        this.dbg = nodes.dbg;
    }
    getName() {
        return 'nmod';
    }
    getValues() {
        let r = [];
        //console.log(this.nmodList);
        //console.log(this.nmodList.length);
        for (let dt of this.nmodList) {
            r.push(this.nodes.getTokens().getToken(this.selfNodeId) + '>' + dt.nmodLink + '>' +
                this.nodes.getNodeMap(dt.nmodToken).getValues());
        }
        return r.join(',');
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
            //assert.equal(t1.length,1,'Un-Implemented.' + t1.length);
            let ndToken = node.getToken();
            //let ndPOS = nodeList.getNodeMap(t1[0]).getTokenPOS();
            //if (ndPOS.match(/(NN|JJ|CD)/)) {
            let r = [];
            for (let tkn_ of t1) {
                dbg('  - nmod [' + ndToken + ']: to [' + node.nodes.getTokens().getToken(tkn_)
                        + ']:' + tkn_);
                let c1 = node.getChild(tkn_);
                r.push({nmodToken: tkn_, nmodLink: c1.type});
            }
            return [true, {'selfNode': node.getTokenId(), 'nmodList': r}];
            //}
        }
        return [false, {}];
    }
}

export default NMod;