'use strict';

//import * as utils from './node_utils';
var Utils = require('../nodes_utils');
var assert = require('assert');
var GrBase = require('./base_gr');
var NMod = require('./nmod');
var AdvMod = require('./advmod');
var DEP = require('./dep');
var dbg = require('debug')('node:gr:verb');


/*
NN----(subj)---->VB(is/defined)---xcomp/nmod--->NN
NN1---(subj)--->NN2 with NN2--cop->VBZ(is)

ADD

 -- Add TO VerbBase (Wh-Clauses)
 - Who
 - What
 - when
 - where
 - which
 - whose
 - why / how

 Subject : part of the sentence that commonly indicates
    - What it is about
    - Who or what performs the action (that is the agent)
 Object : A noun.. that is affected by the action of a verb
    or that completes the meaning of a preposition
 Marie wrote a poem
      Object(direct) = Poem
      Subj = Marie
      Verb = Wrote
 Marie sent me an email.
     object(dobj) = email
     object(iobj) = me
     subj = Marie
     Verb = sent
  Complement : A word that completes the predicate in a sentence.
 My glass is empty (subject complemt)
 We find them very pleasant. (Object complement)
     http://grammar.about.com/od/c/g/complterm.htm

 How much is 10 Foot in Meters?
   "How much" - verbDep...
    "10 Foot" - Subject
    "Meters" - SubjectWhat


 // by default water is in liquid state.
 //  subj/Who - Water
 //  Object/what  - State->Liquid
 //  when - default (nmod:by->obj)


 // default state of water is liquid.
  // subj/what : state -> default
 // Object : Liquid
 // who  : Water (nmod:of -> subj)


 Time is defined to be a type of Measure.
 The default unit for foo is Zque.
 By default time is expressed in minutes.

 */

class VerbBase extends GrBase {
    constructor(nodes, fromNode, linkType, toNode, matchResult) {
        super(nodes, fromNode, linkType, toNode, matchResult);
        this.name = 'VerbBase';
    }
    static getMatchToken() {
        //return ['define:VB.*', 'is:VB.*', 'defined:VB.*'];
        //return ['.*:VB.*'];
        //return [{name:'verb-1', toPOS:'VB.*', edge:'((?!cop).)*'} ];
        return [{name:'verb-1', toPOS:'VB.*', edge:'((?!cop).)*'},
            {name:'verb-2', toPOS:'VB.*', edge:'cop', applyToParent:true}];
        //return [{name:'verb-1', toPOS:'VB.*'];
    }
    /*
    getValues() {;
        return this.match.verb;//this.nodes.getTokens().getToken(this.verb);
    }*/
    dict() {
        let r =  this.processNode();
        return r;
        return this.match.vb;
    }
    text() {
        return this.name + ':: ' + JSON.stringify(this.match);
    }
    getVerb() {
        return this.match.verb;//this.nodes.getNodeMap(this.verb).getValues();
    }

    getValues(tagged=false) {
        let res = [];
        if (this.linkType === 'cop'){
            let children = this.fromNode.getChildren();
            for(let child in children) {
                let c = this.fromNode.getChild(child);
                if (this.toNode.getTokenId() !== c.node.getTokenId()) {
                    res.push(c.node.getValues(tagged));
                }
            }
            res.push(this.fromNode.getToken());
            //console.log('  \t\t getValues::Verb called for id ' + this.toNode.getTokenId() + ' reeturning :' + res.join(' '));
            res = res.join(' ');
            if (tagged) {
                res =  'obj::<' + res + '>';
                res = this.getName() + '::' + this.toNode.getValues(tagged) + ' ' + res;
            } else {
                res = this.toNode.getValues(tagged) + ' ' + res;
            }
            return res;
        } else {
            return super.getValues(tagged);
        }
    }

    processNode() {
        let node = this.toNode;
        let nodeList = this.nodes;
        let copNode = 'cop';

        if (this.linkType === copNode) {
            node = this.fromNode;
        }
        // check all the child nodes
        let children = node.getChildren();
        //let dbg = nodeList.dbg;
        for (let child in children) {
            let ch = children[child];
        }
        let ret = {};
        // process the verb node
        if (this.linkType === copNode) {
            // ret.verb = {tokenId:this.toNode.getTokenId(), obj : {tokenId: this.fromNode.getTokenId()}};
            //ret.verb = {tokenId: this.fromNode.getTokenId(), cop : {tokenId:this.toNode.getTokenId()}};
            ret['verb:' + this.linkType] = {tokenId: this.fromNode.getTokenId(), cop : {tokenId:this.toNode.getTokenId()}};
        } else {
            //ret.verb = {tokenId:this.toNode.getTokenId()};
            ret['verb:' + this.linkType] = {tokenId:this.toNode.getTokenId()};
        }

        ret = super.processNode(ret);
        if (false) console.log(' ---[' + this.linkType + ']-->> ' + JSON.stringify(ret));
        return ret;
    }
    static checkValid(nodeList, fromNode, linkType, toNode) {
        let dbg = nodeList.dbg;
        return [true, {}];
    }
}

export default VerbBase;