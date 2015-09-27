'use strict';
var BaseNode = require('./base_node.js');
var Utils = require('../nodes_utils');
/*
NN connected with VB as "cop" link is to be identified and the verb to be propegrated
NN connected with NN as "nmod:of" also needs to be propegated
// ignore "det" for now
// ignore "case" for now
// ignore "mark"
//
*/

class NNNode extends BaseNode {
    constructor(nodes, tknId, level) {
        super(nodes, tknId, level);
    }
    static getMatchToken() {
        return 'NN.*';
    }


    addChild(tkn, type) {
        super.addChild(tkn, type);
    }
}

module.exports = NNNode;