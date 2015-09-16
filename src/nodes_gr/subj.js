'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');
var dbg = require('debug')('node:gr:subj');
var GrBase = require('./base_gr');


class Subj extends GrBase {
    constructor(nodes, fromNode, linkType, toNode, matchResult) {
        super(nodes, fromNode, linkType, toNode, matchResult);
        this.name = 'subj';
    }

    static getMatchToken() {
        return [{name: 'subj-1', edge: '[nc]subj(pass)?'}];
    }

    processNode() {
        let ret = {};
        ret.subj = {tokenId: this.toNode.getTokenId()};
        return super.processNode(ret);
    }

    static checkValid(nodeList, fromNode, linkType, toNode) {
        return [true, {}];
    }
}
export default Subj;