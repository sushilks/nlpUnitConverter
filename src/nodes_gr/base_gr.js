'use strict';
var Utils = require('../nodes_utils');
var assert = require('assert');
var dbg = require('debug')('node:gr:base');

class GrBase {
    constructor(nodes, fromNode, linkType, toNode, result){
        this.fromNode = fromNode;
        this.toNode = toNode;
        this.linkType = linkType;
        this.nodes = nodes;
        this.match = result;
        this.name = 'BASE';
    }
    getName() {
        return this.name;
    }
    static getMatchToken() {
        return ['BaseGr'];
    }


    resolveItem(itm) {
        if (!(('tokenId' in itm) && !('_processed' in itm))) {
            return;
        }
        itm._processed = true;
        // find any grammar associated with the node
        let nd = this.nodes.getNodeMap(itm.tokenId);
        let gr = nd.grMatches;
        for (let grItm of gr) {
            if (!('data' in itm)) {
                itm.data = [];
            }
            itm.data.push(grItm.processNode());
        }
        if (!('data' in itm)) {
            console.log('   Unable to find any Grammar on node ' + itm.tokenId + ' :: ' + nd.getToken() );
            itm.data = [{status:'ERROR: No Grammar [' + nd.getToken() + ']'}];
        }
    }
    resolveSubNodes(data) {
        let keys = Object.keys(data);
        //let resolveList = [];
        for (let k of keys) {
            //console.log('k1=' + k + ' array=' + Array.isArray(data[k]));
            if (k === 'tokenId') {
                let n = this.nodes.getNodeMap(data[k]);
                //console.log('   k2 = ' + data[k] + ' ::' + n.getToken());
                data.token = n.getToken();

                data.data = [];
                let children = n.getChildren();
                for (let loc in children) {
                    let c = children[loc];
                    let gr = c.node.getGrammarMatches();
                    //console.log('    children ' + loc + ' type = ' + c.type + ' name=' + c.node.name + ' gr.len = ' + gr.length);
                    if(gr.length)
                        for (let gritm of gr) {
                            data.data.push(gritm.processNode());
                        }
                }
                {
                    data.dataValue = n.getValues();
                    data.dataValueTagged = n.getValues(true);
                }
                //this.resolveItem(data);
            } else {
                if ('tokenId' in data[k]) {
                    this.resolveSubNodes(data[k]);

                }
            }
/*
            if (Array.isArray(data[k])) {
                //console.log('k = ' + k);
                for (let itm of data[k]) {
                    this.resolveItem(itm);
                }
            }
            */
        }
    }
    getValues(tagged=false) {
        let res = [];
        let children = this.toNode.getChildren();
        //console.log(' gr::getValues called ' + this.name );
        for(let child in children) {
            let c = this.toNode.getChild(child);
            // check if there is any grammar on the node
            res.push(c.node.getValues(tagged));
        }
        res.push(this.toNode.getToken());
        //console.log('  \t\t getValues::GrBase called for id ' + this.toNode.getTokenId() + ' reeturning :' + res.join(' '));
        res = res.join(' ');
        if (tagged) {
            if (this.match.type) {
                res = this.match.type + '::<' + res + '>';
            } else {
                res = this.getName() + '::<' + res + '>';
            }
        }
        return res;
    }
//--->> {"verb":{"tokenId":4,"type":"root","What":[{"tokenId":8,"type":"nmod:in","_processed":true}],"Unresolved":[{"tokenId":5,"type":"expl","_processed":true}],
// "_processed":true},"subj":{"tokenId":"3","type":"nsubj","Unresolved":[{"tokenId":2,"type":"amod","_processed":true}],"_processed":true}}
    processNode(ret) {
        if (ret === undefined) {
            ret = {};
            ret[this.getName()] = {tokenId: this.toNode.getTokenId()};
            //return {implementMe:this.getName()};
        }
        //console.log('Implement ME');
        for (let itm in ret)
            this.resolveSubNodes(ret[itm]);
        return ret;
    }

}

export default GrBase;