'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');
var GrBase = require('./base_gr');
var dbg = require('debug')('node:gr:compound');

class Compound extends GrBase {
    constructor(nodes, fromNode, linkType, toNode, matchResult) {
        super(nodes, fromNode, linkType, toNode, matchResult);
        this.name = 'Compound';
    }
    /*
    getValues( r = '') {
        let val = (r !== '') ? r : this.nodes.getNodeMap(this.match.selfNodeId).getToken();
        if (this.match.isNumber) {
            return this.nodes.getNodeMap(this.match.compoundToken).getValues() + ' ' + val;
        } else {
            return val + '>compound>' +
                this.nodes.getNodeMap(this.match.compoundToken).getValues();
        }
    }*/
    text() {
        return 'Compound [' + this.getValues() + ']';
    }
    static getMatchToken() {
        //return ['.*:NN.*', '.*:CD.*'];
        return [{name:'compound-1', edge:'compound'}];
    }
     processNode() {
        let ret = {};
        ret.compound = {tokenId: this.toNode.getTokenId()};
        return super.processNode(ret);
    }
    static checkValid(nodeList, fromNode, linkType, toNode) {
       // Utils.checkAndProcessChildNodeGrammar(nodeList, node);
        return [true, {}];
        let t1 = Utils.checkChildLinks(node, 'compound');
        if (t1 && t1.length) {
            assert.equal(t1.length,1,'Un-Implemented.' + t1.length);
            let ndToken = node.getToken();
            let ndPOS = nodeList.getNodeMap(t1[0]).getTokenPOS();
            if (ndPOS.match(/(NN|CD)/)) {
                dbg('  - COMPOUND[' + ndToken + ']: to [' + node.nodes.getTokens().getToken(t1[0])
                    + ']:' + t1[0] );
                return [true, {'selfNodeId': node.getTokenId(), 'compoundToken': t1[0], 'isNumber':(ndPOS.match(/CD/)? true:false)}];
            }
        }
        return [false, {}];
    }
}

export default Compound;