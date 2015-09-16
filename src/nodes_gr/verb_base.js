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

/*
    static _processNode(ntype, rawObj, ret) {
        let processed = '';
        {// When
            let marker = 'agent';
            processed = marker;
            let re = rawObj.match(new RegExp('[^,]*>nmod:(' + marker+ ')>([^,]*)'));
            if (re && re.length) {
                ret[ntype + 'When'] = re[2];
            }
        }
        {// Who
            let marker = 'for|by|to|tmod';
            processed = marker;
            let re = rawObj.match(new RegExp('[^,]*>nmod:(' + marker+ ')>([^,]*)'));
            if (re && re.length) {
                ret[ntype + 'Who'] = re[2];
            }
        }
        {//What
            let marker = 'in|of|as|into';
            processed += '|' + marker;
            let re = rawObj.match(new RegExp('[^,]*>nmod:(' + marker + ')>([^,]*)'));
            if (re && re.length) {
                ret[ntype + 'What'] = re[2];
            }
        }
        { //Only
            let obj = rawObj.split(',');
            let ret_ = [];
            let nd='';
            for (let dt of obj) {
                let re = dt.match(new RegExp('([^,>]*)>nmod:(' + processed + ')'));
                if (!re) {
                    ret_.push(dt);
                } else {
                    nd = re[1];
                }
            }
            let r = ret_.join(',');
            if (r === '') {
                r = nd;
            }
            if (r !== '' && r.length != 0) {
                ret[ntype] = r;
            }
        }
    }
*/
    /*
    _childLinkMatch(node, re) {
        let match = [];
        for (let ch in node.getChildren()) {
            let c = node.getChild(loc);
            let r = c.type.match(re);
            if(r) {
                match.push(r);
            }
        }
        return match;
    }
    _addToArray(arr, key, dt) {
        if (!arr[key]) {
            arr[key] = [];
        }
        arr[key].push(dt);
    }
    _processNode2(ntype, node, rawObj, ret, processed = []) {
        {// When
            let key = ntype + 'When';
            let marker = 'nmod:agent';
            let m = Utils.checkChildLinks(node, marker);
            for (let itm of m) {
                let c = node.getChild(itm);
                this.addToArray(ret, key, {tokenId:c.node.getTokenId(), type:c.type});
                processed.push(itm);
            }
        }
        {// Who
            let key = ntype + 'Who';
            let marker = 'nmod:(for|by|to|tmod)';
            let m = Utils.checkChildLinks(node, marker);
            for (let itm of m) {
                let c = node.getChild(itm);
                this.addToArray(ret, key, {tokenId:c.node.getTokenId(), type:c.type});
                processed.push(itm);
            }
        }
        {//What
            let key = ntype + 'What';
            let marker = 'nmod:(in|of|as|into)';
            let m = Utils.checkChildLinks(node, marker);
            for (let itm of m) {
                let c = node.getChild(itm);
                this.addToArray(ret, key, {tokenId:c.node.getTokenId(), type:c.type});
                processed.push(itm);
            }
        }
        {//Unresolved
            let key = ntype + 'Unresolved';
            let marker = '.*';
            let m = Utils.checkChildLinks(node, marker);
            for (let itm of m) {
                if (processed.indexOf(itm) === -1) {
                    let c = node.getChild(itm);
                    this.addToArray(ret, key, {tokenId:c.node.getTokenId(), type:c.type});
                    //processed.push(itm);
                }
            }
        }
    }*/
//    processNodeValue() {
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
        if (this.linkType === 'cop') {
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

        if (this.linkType === 'cop') {
            ret.verb = {tokenId:this.toNode.getTokenId(), obj : {tokenId: this.fromNode.getTokenId()}};
        } else {
            ret.verb = {tokenId:this.toNode.getTokenId()};
        }

        ret = super.processNode(ret);
        if (this.linkType === 'cop') {
            if (Object.keys(ret.verb).indexOf('obj') != -1) {
                for (let idx in  ret.verb.obj.data) {
                    //console.log(' DD = ' + Object.keys(ret.verb.obj.data[idx]));
                    if (Object.keys(ret.verb.obj.data[idx]).indexOf('subj') != -1) {
                        ret.verb.subj = ret.verb.obj.data[idx].subj;
                        ret.verb.obj.data.splice(idx, 1);
                        //ret.verb.subj = ret.verb.obj.subj;
                        //delete ret.verb.obj.subj;
                    }
                }
                ret.verb.obj.dataValue = [];
                ret.verb.obj.dataValueTagged = [];
                for (let idx in  ret.verb.obj.data) {
                    for (let idx2 in ret.verb.obj.data[idx]) {
                        //console.log(' ---DT=' + idx + ' idx2= ' + idx2)
                        ret.verb.obj.dataValue.push(ret.verb.obj.data[idx][idx2].dataValue);
                        ret.verb.obj.dataValueTagged.push(ret.verb.obj.data[idx][idx2].dataValueTagged);
                    }
                }
                ret.verb.obj.dataValue.push(ret.verb.obj.token);
                ret.verb.obj.dataValueTagged.push(ret.verb.obj.token);
                ret.verb.obj.dataValue = ret.verb.obj.dataValue.join(' ');
                ret.verb.obj.dataValueTagged = 'obj::<' + ret.verb.obj.dataValueTagged.join(' ') + '>';
                //}
            }
        }


        if (false) console.log(' --->> ' + JSON.stringify(ret));
        return ret;
    }
    static checkValid(nodeList, fromNode, linkType, toNode) {
        let dbg = nodeList.dbg;
        return [true, {}];

        /*

        // Make sure all child nodes are processed
        //Utils.checkAndProcessChildNodeGrammar(nodeList, node);

        let ret = {};

        let verbNode = node;
        let cop = null;
        // check if this is a verb connected to NN by 'cop'
        {
            let p = verbNode.getParent();
            if (p && p.type && p.type.match(/cop/)) {
                Utils.checkAndProcessNodeGrammar(nodeList, p.node);
                cop = verbNode;
                verbNode = p.node;
            }
        }
        // populate the verb
        ret.verb =  Utils.getNodeValues(nodeList, node.getTokenId());
        {
            let mr;
            let vn = node;
            mr = NMod.checkValid(nodeList, vn);
            if (mr[0]) {
                ret.rawVerbMod = new NMod(vn.nodes, vn, mr[1]).getValues();
                VerbBase.processNode('verbMod', ret.rawVerbMod, ret);
            }
            mr = AdvMod.checkValid(nodeList, vn);
            if (mr[0]) {
                ret.rawVerbAdvMod = new AdvMod(vn.nodes, vn, mr[1]).getValues();
                VerbBase.processNode('verbMod', ret.rawVerbAdvMod, ret);
            }
            mr = DEP.checkValid(nodeList, vn);
            if (mr[0]) {
                ret.verbDep = new DEP(vn.nodes, vn, mr[1]).getValues();
            }
        }

        // process subj
        let findSubj = Utils.checkChildLinks(verbNode, '[nc]subj(pass)?');
        if (findSubj.length) {
            assert.equal(findSubj.length,1,'More then one Subject is Un-Implemented.' + findSubj.length);
            ret.rawSubj = Utils.getNodeValues(nodeList, findSubj[0]);
            VerbBase.processNode('subj', ret.rawSubj, ret);
        }
        // process object
        let findDObj = Utils.checkChildLinks(verbNode, 'dobj');
        let findIObj = Utils.checkChildLinks(verbNode, 'iobj');
        assert.equal(findIObj.length,0,'Indirect object is Un-Implemented.');
        if (cop) {
            findDObj.push(verbNode.getTokenId());
        }
        if (findDObj.length) {
            let oval = [];
            for (let obj_ of findDObj) {
                oval.push(Utils.getNodeValues(nodeList, obj_));
            }
            ret.rawObj = oval.join(',');
            VerbBase.processNode('obj', ret.rawObj, ret);
        }
        // process [xc]comp
        let XCcomp = Utils.checkChildLinks(verbNode, '[xc]comp');
        if (XCcomp.length) {
            assert.equal(XCcomp.length, 1, 'more than one [xc]comp is Un-Implemented.' + XCcomp.length);
            ret.comp = XCcomp[0]; // this will be just a tokenID...
        }
        if (ret.rawSubj || ret.rawObj || (ret.rawVerbAdvMod && ret.rawVerbMod) || (ret.verbModWho && ret.verbModWhat)) {
            return [true, {vb: ret}];
        } else {
            return [false, {}];
        }
        */
    }
}

export default VerbBase;