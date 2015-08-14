'use strict';

//import * as utils from './node_utils';
var Utils = require('../nodes_utils');
var assert = require('assert');

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


 // by default water is in liquid state.
 //  subj/Who - Water
 //  Object/what  - State->Liquid
 //  when - default (nmod:by->obj)


 // default state of water is liquid.
  // subj/what : state -> default
 // Object : Liquid
 // who  : Water (nmod:of -> subj)


*/

class VerbBase {
    constructor(nodes, matchResult) {
        this.name = 'VerbBase'
        this.verbSubj = matchResult.verbSubj;
        this.verbObj = matchResult.verbObj;
        this.verb = matchResult.verb;
        this.nodes = nodes;
        this.dbg = nodes.dbg;
    }
    static getMatchToken() {
        //return ['define:VB.*', 'is:VB.*', 'defined:VB.*'];
        return ['.*:VB.*'];
    }
    getValues() {
        return this.nodes.getTokens().getToken(this.verb);
    }
    getName() {
        return this.name;
    }
    dict() {
        let r = {};
        r.verb = this.getVerb();
        r.subj = this.getSubject();
        r.obj = this.getObject();
        r.subjOnly = this.getSubjectOnly();
        r.subjWho = this.getSubjectWho();
        r.objOnly = this.getObjectOnly();
        r.objWhat = this.getObjectWhat();
        r.objWhen = this.getObjectWhen();
        return r;
    }
    text() {
        let r = 'VerbBase verb=[' + this.getVerb() + '] Subj=[' + this.getSubject() +
        '] Object=[' + this.getObject() + ']';
        if (this.getSubjectOnly()) {
            r = r + ' SubjOnly:' + this.getSubjectOnly();
        }
        if (this.getSubjectWho()) {
            r = r + ' SubjWho:' + this.getSubjectWho();
        }
        if (this.getObjectOnly()) {
            r = r + ' ObjectOnly:' + this.getObjectOnly();
        }
        if (this.getObjectWhat()) {
            r = r + ' ObjectWhat:' + this.getObjectWhat();
        }
        if (this.getObjectWhen()) {
            r = r + ' ObjectWhen:' + this.getObjectWhen();
        }
        return r;
    }
    getVerb() {
        return this.nodes.getNodeMap(this.verb).getValues();
    }
    getSubject() {
        return this.nodes.getNodeMap(this.verbSubj).getValues();
    }
    getSubjectWho() {
        let subj = this.getSubject();
        let re = subj.match(/[^,]*>nmod:(of|for)>([^,]*)/);
        if (re && re.length) {
            return re[2];
        }
        return '';
    }
    getSubjectOnly() {
        let subj = this.getSubject().split(',');
        let ret = [];
        let nd = '';
        for (let dt of subj) {
            let re = dt.match(/([^,>]*)>nmod:/);
            if (!re) {
                ret.push(dt);
            } else {
                nd = re[1];
            }
        }
        let r = ret.join(',');
        if (r === '') {
            r = nd;
        }
        return r;
    }
    getObject() {
        let r;
        // check the link types,
        // if link type has nmod then add the nmod as part of returned
        // value.
        if (this.verbObj.length == 1) {
            let linkType =Utils.getChildLink(this.nodes, this.verb, this.verbObj);
            r = this.nodes.getNodeMap(this.verbObj).getValues();
            if (linkType.match(/nmod:/)){
                r = this.getVerb() + '>' + linkType + '>' + r;
            }
            return r;
        } else {
            r = [];
            for (var idx of this.verbObj) {
                let nd = this.nodes.getNodeMap(idx);
                let linkType =Utils.getChildLink(this.nodes, this.verb, idx);
                if (linkType.match(/nmod:/)){
                    r.push(this.getVerb() + '>' + linkType + '>' + nd.getValues());
                } else {
                    r.push(nd.getValues());
                }
            }
            return r.join(',');
        }
    }
    getObjectOnly() {
        let subj = this.getObject().split(',');
        let ret = [];
        let nd='';
        for (let dt of subj) {
            let re = dt.match(/([^,>]*)>nmod:(by|agent|in)/);
            if (!re) {
                ret.push(dt);
            } else {
                nd = re[1];
            }
        }
        let r = ret.join(',');
        if (r === '') {
            r = nd;
        }
        return r;
    }
    getObjectWhen() {
        let subj = this.getObject();
        let re = subj.match(/[^,]*>nmod:(by|agent)>([^,]*)/);
        if (re && re.length) {
            return re[2];
        }
        return '';
    }

    getObjectWhat() {
        let subj = this.getObject();
        let re = subj.match(/[^,]*>nmod:(in)>([^,]*)/);
        if (re && re.length) {
            return re[2];
        }
        return '';
    }

    static checkValid(nodeList, node) {
        let dbg = nodeList.dbg;
        // should not be needed
        // as the trigger is based on match token
        /*
        if (!node.getPOS().match(/^VB/)) {
            return [false, {}];
        }
        if (!Utils.checkNodeValuesMatchAny(node, ['is', 'define', 'defined'])) {
            return [false, {}];
        }
        */
        // Make sure all child nodes are processed
        Utils.checkAndProcessChildNodeGrammar(nodeList, node);

        // check pattern 1
        // NN----(subj)---->VB(is/defined)---xcomp/nmod--->NN
        let m0subj = Utils.checkChildLinks(node, '[nc]subj(pass)?');
        let m1comp = Utils.checkChildLinks(node, '[xc]comp');
        let m2mod  = Utils.checkChildLinks(node, '(n|adv)mod:.*');
        let m3 = Utils.checkChildLinks(node, 'dobj');
        if (m0subj.length && (m1comp.length || m2mod.length || m3.length)) {
            assert.equal(m0subj.length,1,'Un-Implemented.' + m0subj.length);
            //assert((m1comp.length === 0 || m1comp.length === 1) &&
            //    (m2mod.length === 0 || m2mod.length === 1), 'Un-Implemented.' + m1comp.length + '.' + m2mod.length);
            let subj = m0subj[0];
            let obj;
            if (m1comp.length) {
                obj = m1comp;
            } else if(m2mod.length) {
                obj = m2mod;
            } else {
                obj = m3;
            }
            if (dbg) {
                console.log('  - SUBJ: ' + subj + ' obj: ' + obj);
                let objStr = '';
                for (let obj_ of obj) {
                    objStr += node.nodes.getNodeMap(obj_).getToken() + ',';
                }
                console.log('  - VerbBase['+node.getToken()+'] subj:' + node.nodes.getNodeMap(subj).getToken() +
                    ' of obj :' + objStr);
            }
            return [ true, {'verb' : node.getTokenId(),'verbSubj': subj, 'verbObj': obj}];
        }
        // check if only subj
        if (m0subj.length) {
            // check if subj is connected by nmod:in
            assert.equal(m0subj.length,1,'Un-Implemented.' + m0subj.length);
            let subjNode = node.nodes.getNodeMap(m0subj[0]);
            let m1nmod = Utils.checkChildLinks(subjNode, 'nmod:in');

            if (m1nmod.length) {
                assert.equal(m1nmod.length,1,'Un-Implemented.' + m1nmod.length);
                let obj = m1nmod;
                return [ true, {'verb' : node.getTokenId(),'verbSubj': m0subj[0], 'verbObj': obj}];
            }
        }



        // check if parent is connected as cop:NN
        {
            let p = node.getParent();
            if (p && p.type && p.type.match(/cop/)) {
                // make sure this nodes is processed before proceeding
                Utils.checkAndProcessNodeGrammar(nodeList, p.node);
                let m0subj = Utils.checkChildLinks(p.node, '[nc]subj(pass)?');
                /*
                 let mWho = [];
                 if (m0subj.length){
                 mWho = Utils.checkChildLinks(node.nodes.getNodeMap(m0subj[0]), 'nmod:of');
                 if (mWho.length) {
                 console.log(" mWHO = " + node.nodes.getNodeMap(mWho[0]).getValues());
                 }
                 }
                let mWhen = Utils.checkChildLinks(p.node, 'nmod:by');
                if (mWhen.length) {
                    console.log(" mWhen = " + node.nodes.getNodeMap(mWhen[0]).getValues());
                }
*/
                if (p.node.getPOS().match(/^(NN|JJ)/) &&
                    m0subj.length) {
                    assert.equal(m0subj.length,1,'Un-Implemented.' + m0subj.length);
                    let subj = m0subj[0];
                    let obj;

                    obj = p.node.getValues();
                    if (dbg) {
                        console.log('  - VerbBase2['+node.getToken()+'] subj :' + node.nodes.getNodeMap(subj).getToken() +
                            ' of obj : ' + obj);
                    }
                    return [true, {'verb' : node.getTokenId(), 'verbSubj': subj, 'verbObj': [p.node.getTokenId()] }];
                }
            }
        }
        if (dbg) {
            console.log('  - VerbBase : Did not find a match.');
        }
        return [false, {}];
    }
}

export default VerbBase;