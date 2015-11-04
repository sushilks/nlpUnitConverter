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
import ExpMatch from './exp_match';

let gNodeMapper:  NodeMapperType = {}; /** To hold different node types */
let gGrMapper: GrMapperType = {};   /** To hold different grammer rules */
let gExpMapper: ExpMapperType  = {fnMap: {}, match: {}};   /** To hold different grammer rules */

declare var __dirname: string;
let normalizedPath: string = require('path').join(__dirname);
// import * as Debug from 'debug';
let dbg = require('debug')('nodes:base');
let dbgdb = require('debug')('nodes:base:db');
let dbgdbm = require('debug')('nodes:base:db:match');
let dbgp = require('debug')('nodes:base:db:match:partial');
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
    public grMatches: Array<()=>GrBase>;
    public expMatches: Array<ExpBase>;
    private dep: Dependency;
    private tknNodeMap: {[key: number]: ()=>BaseNode};
    private rootToken: number;
    private tkn: Tokens;
    private nd: ()=>BaseNode;
    //  diGraph:  ;
    constructor(dep: Dependency) {
        this.tknNodeMap = {};
        this.dep = dep;
        this.rootToken = dep.getRootToken();
        this.tkn = dep.getTokens();
        this.nd = (function(node_){return node_;}).bind(null, this.process(this.rootToken, 1));
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
        this.tknNodeMap[tknId] = (function(nd) { return nd }).bind(null, node);
    }

    public getNodeMap(tknId: number): BaseNode {
        return this.tknNodeMap[tknId]();
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
    }

    public async processAllExpDBPartial_(res, root: GrProcessNodeValueMap, dbItem: DBItem,
                                         globalBucket: GlobalBucket, tree: any, path: string): Promise<boolean> {
        let treeType = Object.prototype.toString.call(tree);

        // check if the path is extractable from current location
        let extPossible = true;
        let matchPassed = true;
        let extEdge = '';
        let mr = new ExpMatch();
        if (treeType === '[object Object]' && (!path.match(/data\[\d+\]$/))) {
            for (let key in dbItem.extract) {
                let extPath = dbItem.extract[key].replace('.', '');
                if (extEdge === '')
                    extEdge = extPath.split('.')[0];
                let dt = LearnUtils.extractTreeValue(tree, extPath);
                dbgp('\t\textract[' + extPath + '] = ' + JSON.stringify(dt) + ' keyPath = ' + path);
                if (!dt) {
                    if (dbItem.args && dbItem.args.input[key] && dbItem.args.input[key].default) {
                        dt = dbItem.args.input[key].default;
                        mr.setDefaultUsed(key);
                    } else
                        extPossible = false;
                }
                mr.setArgStr(key, dt);
                mr.setArgPath(key, extPath);
            }
            if (extPossible) {
                // check if the match criteria is met
                for (let key in dbItem.match) {
                    let dt = LearnUtils.extractTreeValue(tree, key);
                    dbgp('Checking match[' + key + '] = ' + dt + ' Expected ' + dbItem.match[key]);
                    if (dbItem.match[key] !== dt) {
                        matchPassed = false;
                        break;
                    } else {

                    }
                }
            }
        } else {
            extPossible = false;
            matchPassed = false;
        }


        if (extPossible && matchPassed) {
            //dbgexp('Found a match Parial-dbItem [' + JSON.stringify(match) + '] ');
            dbgp('Matching partial DB Entry Path[' + path + ' :: ' + JSON.stringify(dbItem));
            //dbgp('extPossible = ' + extPossible + ' for PATH:' + path);
            // instart the result into the root database.
            //   exp = expdb[dbItem.type]
            // insertExptoDB(root,path, dbItem.type, exp);
            let fn: typeof ExpBase = gExpMapper.fnMap[dbItem.type];
            if (fn.checkValidArguments(this, mr, globalBucket)) {
                dbgp('Arguments accepted by exp type [' + dbItem.type + ']');
                let expHandle: ExpBase = new fn(this, mr);
                if (!tree.partialExp) {
                    tree.partialExp = [];
                }
                // check if the edge is not already processed and existing before pusing it
                let alreadyProcessed = false;
                for (let dt1 of tree.partialExp) {
                    if ((dt1.edgeList.length === 1) &&
                        (dt1.edgeList[0] === extEdge) &&
                        (dt1.exp.name === expHandle.name)
                    ) {
                        alreadyProcessed = true;
                        break;
                    }
                }
                if (!alreadyProcessed) {
                    tree.partialExp.push({
                        edgeList: [extEdge],
                        dbItem: dbItem._id,
                        exp: expHandle
                    });
                }
            }
        }
        //dbgp('\t treeType' + treeType);
        if (treeType === '[object Array]') {
            // array
            let ret = true;
            for (let idx in tree) {
                ret = ret && await this.processAllExpDBPartial_(res, root, dbItem, globalBucket, tree[idx], path + '[' + idx + ']');
            }
            return ret;
        } else if (treeType === '[object Object]') {
            let k1 = Object.keys(tree);
            let ret = true;
            //console.log(' k1 = ' + k1 + ' KEY = ' + key);
            // dbgp('\t KEY = ' + JSON.stringify(k1));
            for (let key of k1) {
                if (key.match(/tokenId/) ||
                key.match(/dataValue/) ||
                key.match(/dataValueTagged/) ||
                key.match(/token/) ||
                key.match(/partialExp/)) {
                  //  dbgp(' Skipping ' + key);
                } else {
                  //  dbgp(' Processing '  + key);
                    let rpath = (path === '') ? key : path + '.' + key ;
                    ret = ret && await this.processAllExpDBPartial_(res, root, dbItem, globalBucket, tree[key], rpath);
                }
            }
            return ret;
        }
        return true;
    }
    public async processAllExpDBPartial(res, root: GrProcessNodeValueMap, db: ExpDB, globalBucket: GlobalBucket): Promise<boolean> {
        let dt: {[key: string] : any} = await db.find({});
        let r;
        for (let dbItemKey in  Object.keys(dt)) {
            let dbItem:DBItem = dt[dbItemKey];
            if (!dbItem.prop || !dbItem.prop.singleVerbEdge) continue;
            // find the edges that are in the database
            //dbItem.match...
            //dbItem.extract...
            //find the minimum size.
            //    the prefix is the edge to anchor on
            //    all of them have to share the prefix..
            // do a depth first search on the NODES from root down for the
            // edge with the prefix
            // when found do a check on the match and extract fields
            // if found then attach the node to the right location in the tree.
            dbgp(' Processing DB Item ' + JSON.stringify(dbItem));
            r = await this.processAllExpDBPartial_(res, root, dbItem, globalBucket, root, '');
            dbgp(' PARTIAL RES ROOT = ' + JSON.stringify(root));
        }
        return r;
        return false;
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
                if (dbItem.prop && dbItem.prop.singleVerbEdge) continue;
                let match: VerbDBMatchRet = LearnUtils.verbDBMatch(dbgdbm, root, result.expMatches, dbItem);
                if (match.matchType !== '') {
                    dbgexp('Found a match dbItem [' + JSON.stringify(match) + '] ');
                    dbgdb('Matching DB Entry:' + JSON.stringify(dbItem));
                    let fn: typeof ExpBase = gExpMapper.fnMap[match.matchType];
                    // call validity check on the expression-node
                    if (fn.checkValidArguments(this, match.matchResult, globalBucket)) {
                        dbgexp(' Match Accepted the arguments [' + JSON.stringify(match));
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
                            // there is no tie-in to the structure of the sentence
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

    public async processAllExpDB(db: ExpDB, globalBucket: GlobalBucket): Promise<GrProcessNodeValueMap> {
        let mHistory: Array<string> = [];
        let root: GrProcessNodeValueMap = {};
        if (this.grMatches.length) {
            root = {
                root: {
                    tokenId : -1,
                    token: '',
                    data : [
                        this.grMatches[0]().processNode(root)
                    ],
                    dataValue: '',
                    dataValueTagged: ''
                }
            }
            //root = this.grMatches[0].processNode(root);
        } else {
            return root;
        }
        dbgexp(' - ROOT - ::' + JSON.stringify(root));
        let res = {expMatches: []};
        await this.processAllExpDBPartial(res, root, db, globalBucket);

        // todo::
        // there should be a full crawl of the tree
        // making sure not to do repeated work
        // maybe a depth first type search is needed.
        await this.processAllExpDB_(res, root, db, globalBucket, mHistory);
        this.expMatches = res.expMatches;
        return root;
    }

    public processAllExp(): void {
        for (let idx in this.grMatches) {
            let gr: GrBase = this.grMatches[idx]();
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
     * this populates the node.grMatches section
     */
    public processAllGrammar() {
        let rootNode: number = this.dep.getRootToken();
        let grTree: GrTreeTop = {root: null, processedTokens: []};
        grTree.root = this.populateGrammarTree(grTree, grTree.root, rootNode, 'root');
        //console.log(' ---- > ' + JSON.stringify(grTree));
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
                this.grMatches[0]().processNode(null);
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