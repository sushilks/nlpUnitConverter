'use strict';
var BaseNode = require('./base.js');
var Utils = require('../nodes_utils');
/*
NN connected with VB as "cop" link is to be identified and the verb to be propegrated
NN connected with NN as "nmod:of" also needs to be propegated
// ignore "det" for now
// ignore "case" for now
// ignore "mark"
//
*/

class CDNode extends BaseNode {
    constructor(nodes, tknId, level) {
        super(nodes, tknId, level);
    }

    getToken() {
        let tkn = super.getToken();
        return tkn.replace(/,/g,'');

    }
    static getMatchToken() {
        return 'CD.*';
    }

}

module.exports = CDNode;