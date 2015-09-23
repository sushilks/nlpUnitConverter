'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');
var dbg = require('debug')('node:gr:appos');
var GrBase = require('./base_gr');

class APPOS extends GrBase {
    constructor(nodes, fromNode, linkType, toNode, matchResult) {
        super(nodes, fromNode, linkType, toNode, matchResult);
        this.name = 'appos';
    }
    /*
    getValues(r = '') {
        let val = (r !== '') ? r : this.nodes.getNodeMap(this.match.selfNodeId).getToken();
        for (let tid of this.match.appos) {
            val = val + ' ' + this.nodes.getNodeMap(tid).getValues();
        }
        return val;
    }*/
    text() {
        return 'apppos [' + this.getValues() + ']';
    }
    static getMatchToken() {
        //return ['.*:NN.*', '.*:CD.*', '.*:JJ.*'];
        return [{name:'appos-1', edge:'appos'}, {name:'appos-2', edge:'conj:and'}];
    }


    // Take the datavaluelist  and push it to the parent as a list addition

    static checkValid(nodeList, node) {
        return [true, {}];
        //Utils.checkAndProcessChildNodeGrammar(nodeList, node);
        let t1 = Utils.checkChildLinks(node, 'appos|conj:and');
        if (t1 && t1.length) {
            let retList = [];
            let ndToken = node.getToken();
            for (let tid of t1) {
                let ndPOS = nodeList.getNodeMap(tid).getTokenPOS();
                if (ndPOS.match(/NN/)) {
                    dbg('  -     APPOS[' + ndToken + ']: to [' + node.nodes.getTokens().getToken(tid)
                        + ']:' + tid);
                    retList.push(tid)
                }
            }
            return [retList.length > 0, {'selfNodeId': node.getTokenId(), 'appos': retList}];
        }
        return [false, {}];
    }
}

export default APPOS;