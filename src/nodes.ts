/// <reference path="nodes.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <re ference path="../build/ts/src/exp_learn_utils.d.ts" />

'use strict';
// require('source-map-support').install();

// declare function require(name: string);

import * as assert from 'assert';
import * as FS from 'fs';
// require('typescript-require');
import Tokens from './tokens';
import Dependency from './dependency';
import ExpDB from './expdb';
import * as Utils from './nodes_utils';
// var LearnUtils = require('./exp_learn_utils');
import * as LearnUtils from './exp_learn_utils';
import GrBase from './nodes_gr/base_gr';

let gNodeMapper:  NodeMapperType = {}; /** To hold different node types */
let gGrMapper: GrMapperType = {};   /** To hold different grammer rules */
let gExpMapper: ExpMapperType  = {fnMap: {}, match: {}};   /** To hold different grammer rules */

declare var __dirname: string;
let normalizedPath: string = require('path').join(__dirname);
// import * as Debug from 'debug';
let dbg = require('debug')('nodes:base');
let dbgdb = require('debug')('nodes:base:db');
let dbgdbm = require('debug')('nodes:base:db:match');
let dbgexp = require('debug')('nodes:base:exp');

const DEFAULT = 'DEFAULT';

/** Load and init the nodes */
FS.readdirSync(normalizedPath + '/nodes_pos').forEach(function(file: string): void {
    if (file.match(/\.js$/)) {
        Utils.nodeInit(gNodeMapper, require('./nodes_pos/' + file));
    }
});

/** Load and init the grammer rules */
FS.readdirSync(normalizedPath + '/nodes_gr').forEach(function(file: string): void {
    if (file.match(/\.js$/)) {
        Utils.nodeInitGr(gGrMapper, require('./nodes_gr/' + file));
    }
});

/** Load and init the explanation/meanign rules */
FS.readdirSync(normalizedPath + '/nodes_exp').forEach(function(file: string): void {
    if (file.match(/\.js$/)) {
        Utils.nodeInitExp(gExpMapper, require('./nodes_exp/' + file));
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
    public grMatches: Array<GrBase>;
    public expMatches: Array<ExpBase>;
    private dep: Dependency;
    private tknNodeMap: {[key: number]: BaseNode};
    private rootToken: number;
    private tkn: Tokens;
    private nd: BaseNode;
    //  diGraph:  ;
    constructor(dep: Dependency) {
        this.tknNodeMap = {};
        this.dep = dep;
        this.rootToken = dep.getRootToken();
        this.tkn = dep.getTokens();
        this.nd = this.process(this.rootToken, 1);
        this.grMatches = [];
        /* store all the grammar matches */
        this.expMatches = [];
    }

    public static getGlobalExpMapper(): ExpMapperType {
        return gExpMapper;
    }

    public getTokens(): Tokens {
        return this.tkn;
    }

    public setNodeMap(tknId: number, node: BaseNode): void {
        this.tknNodeMap[tknId] = node;
    }

    public getNodeMap(tknId: number): BaseNode {
        return this.tknNodeMap[tknId];
    }

    public process(tknId: number, level: number): BaseNode {
        let pos: string = this.tkn.getTokenPOS(tknId);
        for (let rkey in Object.keys(gNodeMapper)) {
            let pat: string = Object.keys(gNodeMapper)[rkey];
            let found: RegExpMatchArray = pos.match(new RegExp('^' + pat + '$'));
            if (found) {
                return new gNodeMapper[pat](this, tknId, level, false);
            }
        }
        dbg('Unable to find a matching node for ' + pos + ' using default');
        return new gNodeMapper[DEFAULT](this, tknId, level, false);
        //return new gNodeMapper[DEFAULT][0](this, tknId, level);
    }

    public async processAllExpDB_(result, root: GrProcessNodeValueMap, db: ExpDB, globalBucket: GlobalBucket, mHistory: Array<string>,
                                  cnt: number = 0): Promise<boolean> {
        if (cnt > 20) {
            assert.equal(0, 1, 'Too much recurstion');
        }
        let dt: {[key: string] : any} = await db.find({});
        //console.log(' TEST - DB - dt = ' + JSON.stringify(dt));
         let found: boolean = false;
        try {
            for (let dbItemKey in  Object.keys(dt)) {
                let dbItem: DBItem = dt[dbItemKey];
                let match: VerbDBMatchRet = LearnUtils.verbDBMatch(dbgdbm, root, result.expMatches, dbItem);
                if (match.matchType !== '') {
                    dbgexp('Found a match dbItem [' + JSON.stringify(match) + '] ');
                    dbgdb('Matching DB Entry:' + JSON.stringify(dbItem));
                    let fn: typeof ExpBase = gExpMapper.fnMap[match.matchType];
                    // call validity check on the expression-node
                    if (fn.checkValidArguments(this, match.matchResult, globalBucket)) {
                        dbgexp(' Match Succeded with arguments [' + JSON.stringify(match));
                        // check if the new expression is not already present
                        let alreadyFound: boolean = false;
                        // let cnt: number = 0;
                        for (let exp of mHistory) {
                            // console.log('processAllExp Checking [' + JSON.stringify([match.matchType, match.matchResult.args]) +
                            // '] with Prior Expression [' + exp + ']' );
                            if (!alreadyFound) {
                                // cnt++;
                                if (exp === JSON.stringify([match.matchType, match.matchResult.args])) {
                                    alreadyFound = true;
                                    dbgexp(' Match Already Processed');
                                    break;
                                }
                            }
                        }
                        if (!alreadyFound)  {
                            dbgexp('EXP MATCH FOUND for [' + match.matchType + ']');
                            mHistory.push(JSON.stringify([match.matchType, match.matchResult.args]));
                            match.matchResult.dbId = match.dbId;
                            let expHandle: ExpBase = new fn(this, match.matchResult);
                            // todo: The exp matches are stored in a flat structure
                            // there is no tie in to the structure of the sentense
                            // Change to store in hierarcial structure corresponding to the
                            // structur of the sentense.
                            // Verb is a common root , in the case of verb it may be
                            // good to store the matches in a node-edge combo ...
                            // or a node-(edge list) type structure.
                            result.expMatches.push(expHandle);
                            found = true;
                        }
                    } else {
                        dbgexp(' Match Failed with arguments [' + JSON.stringify(match));
                    }
                }
            }
            if (!found) {
                // resolve(true);
                return true;
            } else {
                return await this.processAllExpDB_(result, root, db, globalBucket, mHistory, cnt + 1);
            }
        } catch (e) {
            console.log('Error :: ' + e);
            console.log(e.stack);
            // resolve(false);
            return false;
        }

    }

    public async processAllExpDB(db: ExpDB, globalBucket: GlobalBucket) {
        let mHistory: Array<string> = [];
        let root: GrProcessNodeValueMap = {};
        if (this.grMatches.length) {
            root = this.grMatches[0].processNode(root);
        } else {
            return false;
        }
        dbgdb(' - ROOT - ::' + JSON.stringify(root));
        let res = {expMatches: []};
        // todo::
        // there should be a full crawl of the tree
        // making sure not to do repeated work
        // maybe a depth first type search is needed.
        await this.processAllExpDB_(res, root, db, globalBucket, mHistory);
        this.expMatches = res.expMatches;
    }

    public processAllExp(): void {
        for (let idx in this.grMatches) {
            let gr: GrBase = this.grMatches[idx];
            let grName: string = gr.getName();
            let grMatchToken: string = grName;
            let expList: Array<typeof ExpBase> = gExpMapper.match[grMatchToken];
            // console.log('  - GR Name = ' + grName);
            if (expList && expList.length) {
                for (let exp of expList) {
                    /*
                    let found: [boolean, ExpMatch] = exp.checkValid(gr);
                    if (found[0]) {
                        let expHandle: ExpBase = new exp(this, found[1]);
                        this.expMatches.push(expHandle);
                        dbg('  - Found Exp[' + expHandle.getName() + '] : ' + found[0] + ' :: ' + found[1]);
                    }*/
                }
            }
        }
    }

    public populateGrammarTree(treeTop: GrTreeTop, grTree: GrTree, tokenId: number, type: string, followChildren: boolean = true) {
        let node: BaseNode = this.getNodeMap(tokenId);
        // grTree.node = node;
        grTree = {
            tokenId: tokenId,
            pos: node.getPOS(),
            type: type,
            children: null,
            getNode: (function (node: BaseNode): BaseNode {
                return node;
            }).bind(null, node)
        };
        if (!followChildren) {
            return grTree;
        }
        let children = this.dep.getChildNodes(tokenId);
        treeTop.processedTokens.push(tokenId);
        for (let tkn of children) {
            if (!('children' in grTree) || !grTree.children) {
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
                grTree.children[tkn.tokenIdx] =
                    this.populateGrammarTree(treeTop, grTree.children[tkn.tokenIdx], tkn.tokenIdx, tkn.type);
            } else {
                grTree.children[tkn.tokenIdx] =
                    this.populateGrammarTree(treeTop, grTree.children[tkn.tokenIdx], tkn.tokenIdx, tkn.type, false);
            }
        }
        return grTree;
    }

    /** Process all the tokens in order
     *  Try to match all the grammar rules
     *
     */
    public processAllGrammar() {
        let rootNode: number = this.dep.getRootToken();
        let grTree: GrTreeTop = {root: null, processedTokens: []};
        grTree.root = this.populateGrammarTree(grTree, grTree.root, rootNode, 'root');
        // console.log(' ---- > ' + JSON.stringify(grTree));
        let matchedRules = Utils.findGrammarRules(gGrMapper, null, 'root', grTree.root.getNode());
        if (matchedRules.length) {
            for (let mrule of matchedRules) {
                let v = mrule.fn.checkValid(this, null, 'root', grTree.root.getNode());
                if (v[0]) {
                    let grHandle = new mrule.fn(this, null, 'root', grTree.root.getNode(), <GrBaseMatch>v[1]);
                    // console.log('FOUND :: ' + grHandle.getName());
                    grTree.root.getNode().addGrammarMatch(grHandle);
                }
            }
        }
        this.processNodeGrammar(grTree.root.getNode())
        this.grMatches = grTree.root.getNode().getGrammarMatches();
        //console.log(' After Process Gr:' + this.grMatches.length);
        if (this.grMatches.length) {
            //let r =
                this.grMatches[0].processNode(null);
             //console.log(' r= ' + JSON.stringify(r));
        }
    }


    public processNodeGrammar(nd: BaseNode) {
        // find all the children and recurse
        var children:{[idx: number]: LinkedNode} = nd.getChildren();
        var loc:any;
        // let fromNodePOS = nd.getPOS();
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
                        //console.log('FOUND :: ' + grHandle.getName() + ' adding to node:' + c.node.name + ' attach type ' + mrule.attachType);
                        if (mrule.attachType === 'parent') {
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
}


export default Nodes;