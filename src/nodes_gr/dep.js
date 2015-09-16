'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');
var dbg = require('debug')('node:gr:dep');
var GrBase = require('./base_gr');

class DEP extends GrBase {
    constructor(nodes, fromNode, linkType, toNode, matchResult) {
        super(nodes, fromNode, linkType, toNode, matchResult);
        this.name = 'dep';
    }
    /*
    getValues() {
        let nd = this.nodes.getNodeMap(this.match.selfNodeId).getToken();
        let val = [];
        for (let tid of this.match.depList) {
            val.push(nd + '>dep>' + this.nodes.getNodeMap(tid).getValues());
        }
        return val.join(',');
    }
*/
    text() {
        return this.getName() + ' [' + this.getValues() + ']';
    }
    static getMatchToken() {
        return [{name:'dep-1', edge:'dep'}];
        return ['.*:WRB', '.*:JJ.*', '.*:NN.*', '.*:EX'];
    }

    static checkValid(nodeList, node) {
        return [true, {}];
        let t1 = Utils.checkChildLinks(node, 'dep');
        if (t1 && t1.length) {
            let retList = [];
            let ndToken = node.getToken();
            for (let tid of t1) {
                let ndPOS = nodeList.getNodeMap(tid).getTokenPOS();
                if (ndPOS.match(/(JJ|WRB|NN.*)/)) {
                    dbg('  -     DEP[' + ndToken + ']: to [' + node.nodes.getTokens().getToken(tid)
                        + ']:' + tid);
                    retList.push(tid)
                }
            }
            return [retList.length > 0, {'selfNodeId': node.getTokenId(), 'depList': retList}];
        }
        return [false, {}];
    }
}

export default DEP;