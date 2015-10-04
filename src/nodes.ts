/// <reference path="nodes.d.ts" />
/// <re ference path="../build/ts/src/exp_learn_utils.d.ts" />

'use strict';

declare function require(name:string);

var assert = require('assert');
var FS = require('fs');
//require('typescript-require');
import Tokens from './tokens';
import Dependency from './dependency';
import ExpDB from './expdb';
import * as Utils from './nodes_utils';
//var LearnUtils = require('./exp_learn_utils');
import * as LearnUtils from './exp_learn_utils';
import GrBase from './nodes_gr/base_gr';

var gNodeMapper:  NodeMapperType= {}; /** To hold different node types */
var gGrMapper: GrMapperType = {};   /** To hold different grammer rules */
var gExpMapper: ExpMapperType  = {};   /** To hold different grammer rules */

declare var __dirname: any;
var normalizedPath = require('path').join(__dirname);
var dbg = require('debug')('nodes:base');
var dbgdb = require('debug')('nodes:base:db');
var dbgdbm = require('debug')('nodes:base:db:match');
var dbgexp = require('debug')('nodes:base:exp');

/** Load and init the nodes */
FS.readdirSync(normalizedPath + '/nodes_pos').forEach(function(file) {
    if (file.match(/\.js$/)) {
        Utils.nodeInit(gNodeMapper, require('./nodes_pos/' + file));
    }
});

/** Load and init the grammer rules */
FS.readdirSync(normalizedPath + '/nodes_gr').forEach(function(file) {
    if (file.match(/\.js$/)) {
        Utils.nodeInitGr(gGrMapper, require('./nodes_gr/' + file));
    }
});

/** Load and init the explanation/meanign rules */
FS.readdirSync(normalizedPath + '/nodes_exp').forEach(function(file) {
    if (file.match(/\.js$/)) {
        Utils.nodeInit(gExpMapper, require('./nodes_exp/' + file));
    }
});

/**
    * Class to hold all the nodes and
    *  This will be used for parsing the tree
    *  node to token mapping is held here
    *  on contruction pass the dependency tree to the class
    *  it will walk the tree and create a node map.
    */

class Nodes {
    dep: Dependency;
    tknNodeMap: {[key:number]:BaseNode};
    rootToken : number;
    tkn : Tokens;
    nd: BaseNode;
    grMatches: Array<GrBase>;
    expMatches: Array<ExpBase>;
  //  diGraph: ;
    constructor(dep: Dependency) {
        this.tknNodeMap = {};
        this.dep = dep;
        this.rootToken = dep.getRootToken();
        this.tkn = dep.getTokens();
        this.nd = this.process(this.rootToken, 1);
        this.grMatches = []; /** store all the grammar matches **/
        this.expMatches = [];
//        this.diGraph = {};
    }
//    createGraph(name, attr = {}) {
//    }
//    getGraph(name) {
//        console.log("getGraph [" + name + "] = " + this.diGraph[name]);
//
//        return this.diGraph[name];
//    }
    static getGlobalExpMapper(): {[key:string]: Array<typeof ExpBase>} {
        return gExpMapper;
    }
    getTokens(): Tokens {
        return this.tkn;
    }
    setNodeMap(tknId: number, node: BaseNode) {
        this.tknNodeMap[tknId] = node;
    }
    getNodeMap(tknId: number): BaseNode {
        return this.tknNodeMap[tknId];
    }
    process(tknId: number, level: number): BaseNode {
       let pos = this.tkn.getTokenPOS(tknId);
        for (let rkey in Object.keys(gNodeMapper)) {
            let pat = Object.keys(gNodeMapper)[rkey];
            let found = pos.match(new RegExp('^' + pat + '$'));
            if (found) {
                return new gNodeMapper[pat][0](this, tknId, level);
            }
        }
        dbg('Unable to find a matching node for ' + pos + ' using default');
        return new gNodeMapper['DEFAULT'][0](this, tknId, level);
    }

    processAllExpDB_(verb: GrProcessNodeValueMap, db: ExpDB, graphDB, mHistory, resolve, cnt = 0) {
        if (cnt > 20) {
            assert(0,1, 'Too much recurstion');
        }
        db.find({})
            .then((function (_this, dt) {
                //console.log(' TEST - DB - dt = ' + JSON.stringify(dt));
                let found = false;
                for (let dbItem of dt) {
                    let match: VerbDBMatchRet = LearnUtils.verbDBMatch(dbgdbm, verb, _this.expMatches, dbItem);
                    if (match.matchType !== '') {
                        dbgexp('Found a match dbItem [' + JSON.stringify(match) + '] ');
                        dbgdb('Matching DB Entry:' + JSON.stringify(dbItem));
                        let fn = (<any>gExpMapper)._map[match.matchType];
                        // call validity check on the expression-node
                        if (fn.checkValidArguments(this, match.matchResult, graphDB)) {
                            dbgexp(' Match Succeded with arguments [' + JSON.stringify(match));
                            // check if the new expression is not already present
                            let alreadyFound = false;
                            let cnt = 0;
                            for (let exp of mHistory) {
                                //console.log('processAllExp Checking [' + JSON.stringify([match.matchType, match.matchResult.args]) + '] with Prior Expression [' + exp + ']' );
                                if (!alreadyFound) {
                                    cnt++;
                                    if (exp === JSON.stringify([match.matchType, match.matchResult.args])) {
                                        alreadyFound = true;
                                        dbgexp(' Match Already Processed');
                                        break;
                                    }
                                }
                            }
                            if (!alreadyFound) {
                                dbgexp('EXP MATCH FOUND for [' + match.matchType + ']');
                                mHistory.push(JSON.stringify([match.matchType, match.matchResult.args]));
                                let expHandle = new fn(_this, match.matchResult);
                                _this.expMatches.push(expHandle);
                                found = true;
                            }
                        } else {
                            dbgexp(' Match Failed with arguments [' + JSON.stringify(match));
                        }
                    }
                }
                if (!found) {
                    resolve(true);
                } else {
                    _this.processAllExpDB_(verb, db, graphDB,  mHistory, resolve, cnt + 1);
                }
            }).bind(null, this))
            .catch(function (e) {
                console.log("Error :: " + e);
                console.log(e.stack);
                resolve(false);
            });

    }

    processAllExpDB(db, graphDB) {
        let mHistory = [];
        return new Promise(
            (function(_this, resolve, reject) {

               // let nodeCnt = _this.tkn.tokenCount();

                let root = '';
                if (_this.grMatches.length) {
                    root = _this.grMatches[0].processNode();
                } else {
                    resolve(false);
                    return ;
                }
                dbgdb(' - ROOT - ::' + JSON.stringify(root));
                // TODO::
                // there should be a full crawl of the tree
                // making sure not to do repeated work
                _this.processAllExpDB_(root, db, graphDB, mHistory, (function(resolve,dt){
                    resolve(dt);
                }).bind(null, resolve));
            }).bind(null, this));
    }

    processAllExp() {
        for (let idx in this.grMatches) {
            let gr = this.grMatches[idx];
            let grName = gr.getName();
            let grMatchToken = grName;
            let expList = gExpMapper[grMatchToken];
            //console.log('  - GR Name = ' + grName);
            if (expList && expList.length) {
                for (let exp of expList) {
                    let found = exp.checkValid(gr);
                    if (found[0]) {
                        let expHandle = new exp(this, found[1]);
                        this.expMatches.push(expHandle);
                        dbg('  - Found Exp[' + expHandle.getName() + '] : ' + found[0] + ' :: ' + found[1]);
                    }
                }
            }
        }
    }

    populateGrammarTree(treeTop: GrTreeTop, grTree: GrTree, tokenId: number, type, followChildren: boolean = true) {
        let node = this.getNodeMap(tokenId);
        //grTree.node = node;
        grTree = {
            tokenId: tokenId,
            pos: node.getPOS(),
            type: type,
            children: null,
            getNode: (function (node) {
                return node;
            }).bind(null, node)
        };
        if (!followChildren) {
            return grTree;
        }
        let children = this.dep.getChildNodes(tokenId);
        treeTop.processedTokens.push(tokenId);
        for (let tkn of children) {
            if (!('children' in grTree) ||  !grTree.children) {
                grTree.children = {};
            }
            grTree.children[tkn.tokenIdx] = {
                tokenId: null,
                pos: null,
                type: null,
                children: null,
                getNode: null
            };
            if (treeTop.processedTokens.indexOf(tkn.tokenIdx) == -1) {
                grTree.children[tkn.tokenIdx] = this.populateGrammarTree(treeTop, grTree.children[tkn.tokenIdx], tkn.tokenIdx, tkn.type);
            } else {
                grTree.children[tkn.tokenIdx] = this.populateGrammarTree(treeTop, grTree.children[tkn.tokenIdx], tkn.tokenIdx, tkn.type, false);
            }
        }
        return grTree;
    }

    /** Process all the tokens in order
     *  Try to match all the grammar rules
     *
     */
    processAllGrammar() {
        let rootNode: number = this.dep.getRootToken();
        let grTree: GrTreeTop = {root : null, processedTokens:[] };
        grTree.root = this.populateGrammarTree(grTree, grTree.root, rootNode, 'root');
        //console.log(' ---- > ' + JSON.stringify(grTree));

        let matchedRules =  Utils.findGrammarRules(gGrMapper, null, 'root', grTree.root.getNode());
        if (matchedRules.length) {
            for (let mrule of matchedRules) {
                let v = mrule.fn.checkValid(this, null, 'root', grTree.root.getNode());
                if (v[0]) {
                    let grHandle = new mrule.fn(this, null, 'root', grTree.root.getNode(), <GrBaseMatch>v[1]);
                    //console.log('FOUND :: ' + grHandle.getName());
                    grTree.root.getNode().addGrammarMatch(grHandle);
                }
            }
        }
        this.processNodeGrammar(grTree.root.getNode())


        this.grMatches = grTree.root.getNode().getGrammarMatches();

        //console.log(' After Process Gr:' + gm.length);
        if (this.grMatches.length) {
            let r = this.grMatches[0].processNode(null);
            //console.log(' r= ' + JSON.stringify(r));
        }
    }

    processNodeGrammar(nd: BaseNode) {
        // find all the children and recurse
        var children = nd.getChildren();
        var loc;
        let fromNodePOS = nd.getPOS();
        for (loc in children) {
            let c = children[loc];
            let type = c.type;
            let toNode = c.node;
            let toNodePOS = toNode.getPOS();
            //console.log(' -- type = ' + type + ' fromNodePOS ' + fromNodePOS + ' toNodePOS ' + toNodePOS);
            let matchedRules = Utils.findGrammarRules(gGrMapper, nd, c.type, c.node);
            //console.log('\t\t matchRules.length=' + matchedRules.length);
            if (matchedRules.length) {
                for (let mrule of matchedRules) {
                    let v = mrule.fn.checkValid(this, nd, c.type, c.node);
                    if (v[0]) {
                        let grHandle = new mrule.fn(this, nd, c.type, c.node, <GrBaseMatch>v[1]);
                        //console.log('FOUND :: ' + grHandle.getName() + ' adding to node:' + c.node.name + ' attach type ' + mrule.type);
                        if (mrule.type === 'parent') {
                            nd.addGrammarMatch(grHandle);
                        } else {
                            c.node.addGrammarMatch(grHandle);
                        }
                    }
                }
            }
            this.processNodeGrammar(c.node);
        }
    }

    /** Process only one token "tknId" for grammar match
     * @param tknId - Specify the token to process
     * @returns {*} - return [true if match was found, grammar that matched]
     */
    processGr(tknId: number): boolean {
        let tkn = this.tkn.getToken(tknId);
        let pos = this.tkn.getTokenPOS(tknId);
        let nd = this.getNodeMap(tknId);
        if (nd.grProcessingOngoing) return false;
        nd.grProcessingOngoing = true;
        //console.trace("processGr:"+tknId);
        assert(0,1); // the call below needs to be migrated to new fromat
        /*
        let GRRules = Utils.findGrammarRules(gGrMapper, tkn, pos);
        let ruleHitCount = 0;
        if (GRRules.length) {
            for (let GRM of GRRules)
            {
                let found = GRM.fn.checkValid(this, nd);
                if (found[0]) {
                    dbg('  - gGrMapper Checking with tkn [' + tkn + ']');
                    dbg('\tFound ' + JSON.stringify(found[1]));
                }
                if (found[0]) {
                    let grHandle = new GRM.fn(this, nd, found[1]);
                    dbg('\tAdding Grammar Node:' + grHandle.getName());
                    nd.addGrammarMatch(grHandle);
                    this.grMatches.push(grHandle);
                    ruleHitCount++;
                }
            }
            nd.setGrammarProcessingDone();
            nd.grProcessingOngoing = false;
            dbg('processGr:' + tknId + ' RETURN.');
            return (ruleHitCount > 0);
        } else {
            dbg('  - gGrMapper no hit found for tkn [' + tkn + ']');
            nd.setGrammarProcessingDone();
            nd.grProcessingOngoing = false;
            return false;
        }*/
    }
}


export default Nodes;