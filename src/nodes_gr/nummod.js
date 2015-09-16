'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');
var dbg = require('debug')('node:gr:nummod');
var GrBase = require('./base_gr');

class NumMod extends GrBase {
    constructor(nodes, fromNode, linkType, toNode, matchResult) {
        super(nodes, fromNode, linkType, toNode, matchResult);
        this.name = 'nummod';
    }
    text() {
        return '[' + this.getValues() + ']';
    }
    static getMatchToken() {
        //return ['.*:NN.*'];
        return [{name:'nummod-1', edge:'nummod', toPOS: 'CD'}];
    }

    processNode() {
        let ret = {};
        ret.numnode = {tokenId: this.toNode.getTokenId()};

        // identify all the compund nodes and pass it on
        // every thing else is unresolved.
        return super.processNode(ret);

        let children = this.toNode.getChildren();
        for(let child in children) {
            let c = this.toNode.getChild(child);
            console.log(' CHILD = ' + c .type);
        }
        var findNode;
        findNode = Utils.checkChildLinks(this.toNode, 'nummod');
        console.log(' findComp ' + find.length);
        if (findNode.length) {
            for (let comp of findNode) {
                let c  = this.toNode.getChild(comp);
                console.log(' --->>> type=' + c.type + ' token=' + c.nd );
            }
        }
        return ret;
    }


//    static checkValid(nodeList, node) {
    static checkValid(nodeList, fromNode, linkType, toNode) {
        if (toNode.getPOS().match(/CD/)) {
            return [true, {}];
        }
        return [false, {}];

        let t1 = Utils.checkChildLinks(node, 'nummod');
        if (t1 && t1.length) {
            //assert.equal(t1.length,1,'Un-Implemented.' + t1.length);
            let ndToken = node.getToken();
            let res = [];
            let link = '';
            for (let idx in t1) {
                let ndPOS = nodeList.getNodeMap(t1[idx]).getTokenPOS();
                if (ndPOS.match(/CD/)) {
                    dbg('  - NUMMOD[' + ndToken + ']: to [' + node.nodes.getTokens().getToken(t1[idx])
                        + ']:' + t1[idx]);
                    let c1 = node.getChild(t1[idx]);
                    link = c1.type;
                    res.push(t1[idx]);
                }
            }
            return [true, {'selfNodeId': node.getTokenId(), 'nummodToken': res, 'nummodLink': link }];
        }
        return [false, {}];
    }
}

export default NumMod;