'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');
var debug = require('debug');
var GrBase = require('./base_gr');
var dbg = require('debug')('node:gr:advmod');

class AdvMOD extends GrBase {
    constructor(nodes, fromNode, linkType, toNode, matchResult) {
        super(nodes, fromNode, linkType, toNode, matchResult);
        this.name = 'advmod';
    }
    /*
    getValues() {
        let nd = this.nodes.getNodeMap(this.match.selfNodeId).getToken();
        let val = [];
        for (let tid of this.match.mod) {
            val.push(nd + '>mod>' + this.nodes.getNodeMap(tid).getValues());
        }
        return val.join(',');
    }
    text() {
        return this.getName() + ' [' + this.getValues() + ']';
    }*/
    static getMatchToken() {
        return [{name:'advmod-1', edge:'advmod'}];
        return ['.*:WRB', '.*:JJ.*', '.*:NN.*'];
    }

    static checkValid(nodeList, node) {
        return [true, {}];
        let t1 = Utils.checkChildLinks(node, 'amod|advmod');
        if (t1 && t1.length) {
            let retList = [];
            let ndToken = node.getToken();
            for (let tid of t1) {
                let ndPOS = nodeList.getNodeMap(tid).getTokenPOS();
                //if (ndPOS.match(/(JJ|WRB)/)) {
                if (true) {
                    dbg('  -     MOD[' + ndToken + ']: to [' + node.nodes.getTokens().getToken(tid)
                        + ']:' + tid);
                    retList.push(tid)
                }
            }
            return [retList.length > 0, {'selfNodeId': node.getTokenId(), 'mod': retList}];
        }
        return [false, {}];
    }
}

export default AdvMOD;