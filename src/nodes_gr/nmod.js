'use strict';

var Utils = require('../nodes_utils');
var assert = require('assert');
var dbg = require('debug')('node:gr:dep');
var GrBase = require('./base_gr');

class NMod extends GrBase {
    constructor(nodes, fromNode, linkType, toNode, matchResult) {
        super(nodes, fromNode, linkType, toNode, matchResult);
        this.name = 'nmod';
    }
    getName() {
        return 'nmod';
    }
    /*
    getValues() {
        let r = [];
        //console.log(this.nmodList);
        //console.log(this.nmodList.length);
        for (let dt of this.match.nmodList) {
            r.push(this.nodes.getTokens().getToken(this.match.selfNodeId) + '>' + dt.nmodLink + '>' +
                this.nodes.getNodeMap(dt.nmodToken).getValues());
        }
        return r.join(',');
    }
    */
    text() {
        return 'nmod [' + this.getValues() + ']';
    }
    static getMatchToken() {
        return [{name:'nmod-1', edge:'nmod.*'}];
       // return ['.*:NN.*','.*:JJ.*', '.*:EX'];
    }

    processNode() {
        let ret = {};
        ret[this.match.type] = {tokenId:this.toNode.getTokenId()};
        return super.processNode(ret);
    }
    //static checkValid(nodeList, node) {
    static checkValid(nodeList, fromNode, linkType, toNode) {

        if (linkType.match(/nmod:agent/)){
            return [true, {type:'when'}];
        }
        if (linkType.match(/nmod:(for|by|to|tmod)/)){
            return [true, {type:'Who'}];
        }
        if(linkType.match(/nmod:(in|of|as|into)/)) {
            return [true, {type:'what'}];
        }
        return [ false, {}];
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
            return [true, {'selfNodeId': node.getTokenId(), 'nmodList': r}];
            //}
        }
        return [false, {}];
    }
}

export default NMod;