'use strict';

//import * as utils from './node_utils';
var Utils = require('../nodes_utils');
var assert = require('assert');
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

class VerbBase {
    constructor(nodes, matchResult) {
        this.name = 'VerbBase'
        this.vb = matchResult.vb;
        /*
        verbSubj = matchResult.verbSubj;
        this.verbObj = matchResult.verbObj;
        this.verb = matchResult.verb;
        */
        this.nodes = nodes;
        this.dbg = nodes.dbg;
    }
    static getMatchToken() {
        //return ['define:VB.*', 'is:VB.*', 'defined:VB.*'];
        return ['.*:VB.*'];
    }
    getValues() {
        return this.vb.verb;//this.nodes.getTokens().getToken(this.verb);
    }
    getName() {
        return this.name;
    }
    dict() {
        return this.vb;
    }
    text() {
        let r = this.name + ':: ' + JSON.stringify(this.vb);
        return r;

    }
    getVerb() {
        return this.vb.verb;//this.nodes.getNodeMap(this.verb).getValues();
    }


    static processNode(ntype, rawObj, ret) {
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

    static checkValid(nodeList, node) {
        let dbg = nodeList.dbg;
        // Make sure all child nodes are processed
        Utils.checkAndProcessChildNodeGrammar(nodeList, node);

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
                ret.rawVerbMod = new NMod(vn.nodes, mr[1]).getValues();
                VerbBase.processNode('verbMod', ret.rawVerbMod, ret);
            }
            mr = AdvMod.checkValid(nodeList, vn);
            if (mr[0]) {
                ret.rawVerbAdvMod = new AdvMod(vn.nodes, mr[1]).getValues();
                VerbBase.processNode('verbMod', ret.rawVerbAdvMod, ret);
            }
            mr = DEP.checkValid(nodeList, vn);
            if (mr[0]) {
                ret.verbDep = new DEP(vn.nodes, mr[1]).getValues();
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
    }
}

export default VerbBase;