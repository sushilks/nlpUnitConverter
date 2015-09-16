'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');
var dbg = require('debug')('node:gr:subj');
var GrBase = require('./base_gr');


class Obj extends GrBase {
    constructor(nodes, fromNode, linkType, toNode, matchResult) {
        super(nodes, fromNode, linkType, toNode, matchResult);
        this.name = 'obj';
    }

    static getMatchToken() {
        return [{name: 'obj-1', edge: '[di]obj'}];
    }

    processNode() {
        let ret = {};
        ret.obj = {tokenId: this.toNode.getTokenId()};
        return super.processNode(ret);
    }

    static checkValid(nodeList, fromNode, linkType, toNode) {
        if (linkType.match(/dobj/)) {
            return [true, {}];
        }
        return [false, {}];
    }
}
export default Obj;