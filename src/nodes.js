'use strict';

var Utils = require('./nodes_utils');
var LearnUtils = require('./exp_learn_utils');
var FS = require('fs');

var gNodeMapper = {}; /** To hold different node types */
var gGrMapper = {};   /** To hold different grammer rules */
var gExpMapper = {};   /** To hold different grammer rules */

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
    constructor(dep) {
        this.tknNodeMap = {};
        this.dep = dep;
        this.rootToken = dep.getRootToken();
        this.tkn = dep.getTokens();
        this.nd = this.process(this.rootToken, 1);
        this.grMatches = []; /** store all the grammar matches **/
        this.expMatches = [];
        this.diGraph = {};
    }
    createGraph(name, attr = {}) {
    }
    getGraph(name) {
        console.log("getGraph [" + name + "] = " + this.diGraph[name]);

        return this.diGraph[name];
    }
    static getGlobalExpMapper() {
        return gExpMapper;
    }
    getTokens() {
        return this.tkn;
    }
    setNodeMap(tknId, node) {
        this.tknNodeMap[tknId] = node;
    }
    getNodeMap(tknId) {
        return this.tknNodeMap[tknId];
    }
    process(tknId, level) {
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


    processAllExpDB(db) {
        return new Promise(
            (function(_this, resolve, reject) {

                /*
                // get all the verb's
                // and get all the rules from the db
                // do mix-match
                let verbGr = [];
                for (let idx in _this.grMatches) {
                    let gr = _this.grMatches[idx];
                    let grName = gr.getName();
                    if (grName.match(/VerbBase/)) {
                        verbGr.push(gr);
                    }
                }
                //dbgdb('TEST - DB - Verb Gr len = ' + verbGr.length);
                if (verbGr.length !== 1) {
                    console.log('EXPDB::ERROR::Unable to handle processing with verb.length = ' + verbGr.length);
                    resolve(false);
                    //return false;
                }
                let verb = verbGr[0];
                */

                let verb = '';
                if (_this.grMatches.length) {
                    verb = _this.grMatches[0].processNode();
                } else {
                    return ;
                }
                dbgdb(' - VERB - ::' + JSON.stringify(verb));


                db.find({})
                    .then((function (_this, dt) {
                        //console.log(' TEST - DB - dt = ' + JSON.stringify(dt));
                        for (let dbItem of dt) {
                            let match = LearnUtils.verbDBMatch(dbgdbm, verb, dbItem);
                            if (match[0] !== '') {
                                dbgexp('Found a match dbItem [' + JSON.stringify(match) + '] ');
                                dbgdb('Matching DB Entry:' + JSON.stringify(dbItem));
                                let fn = gExpMapper._map[match[0]];
                                // call validity check on the expression nodead
                                if (fn.checkValidArguments(this, match[1])) {
                                    dbgexp(' Match Succeded with arguments [' + JSON.stringify(match));
                                    let expHandle = new fn(_this, match[1]);
                                    _this.expMatches.push(expHandle);
                                } else {
                                    dbgexp(' Match Failed with arguments [' + JSON.stringify(match));
                                }
                            }
                        }
                        resolve(true);
                    }).bind(null, _this))
                    .catch(function (e) {
                        console.log("Error :: " + e);
                        console.log(e.stack);
                        resolve(false);
                    });
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

    populateGrammarTree(treeTop, grTree, tokenId, type, followChildren = true) {
        let node = this.getNodeMap(tokenId);
        //grTree.node = node;
        grTree.tokenId = tokenId;
        grTree.pos = node.getPOS();
        grTree.type = type;
        grTree.getNode = (function(node) {
            return node;
        }).bind(null, node);
        if (!followChildren) {
            return;
        }
        let children = this.dep.getChildNodes(tokenId);
        treeTop.processedTokens.push(tokenId);
        for (let tkn of children) {
            if (!('children' in grTree)) {
                grTree.children = {};
            }
            if (treeTop.processedTokens.indexOf(tkn.tokenIdx) == -1) {
                this.populateGrammarTree(treeTop, grTree.children, tkn.tokenIdx, tkn.type);
            } else {
                this.populateGrammarTree(treeTop, grTree.children, tkn.tokenIdx, tkn.type, false);
            }
        }

    }

    /** Process all the tokens in order
     *  Try to match all the grammar rules
     *
     */
    processAllGrammar() {


        let rootNode = this.dep.getRootToken();
        let grTree = {root : { }, processedTokens:[] };
        this.populateGrammarTree(grTree, grTree.root, rootNode, 'root');
        //console.log(' ---- > ' + JSON.stringify(grTree));


        let matchedRules = Utils.findGrammarRules(gGrMapper, null, 'root', grTree.root.getNode());
        if (matchedRules.length) {
            for (let mrule of matchedRules) {
                let v = mrule.fn.checkValid(this, null, 'root', grTree.root.getNode());
                if (v[0]) {
                    let grHandle = new mrule.fn(this, null, 'root', grTree.root.getNode(), v[1]);
                    //console.log('FOUND :: ' + grHandle.getName());
                    grTree.root.getNode().addGrammarMatch(grHandle);
                }
            }
        }
        this.processNodeGrammar(grTree.root.getNode())




        this.grMatches = grTree.root.getNode().getGrammarMatches();

        //console.log(' After Process Gr:' + gm.length);
        if (this.grMatches.length) {
            let r = this.grMatches[0].processNode();
            //console.log(' r= ' + JSON.stringify(r));
        }
    }

    processNodeGrammar(nd) {
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
                        let grHandle = new mrule.fn(this, nd, c.type, c.node, v[1]);
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
    /*
    processGr(tknId) {
        let tkn = this.tkn.getToken(tknId);
        let pos = this.tkn.getTokenPOS(tknId);
        let nd = this.getNodeMap(tknId);
        if (nd.grProcessingOngoing) return false;
        nd.grProcessingOngoing = true;
        //console.trace("processGr:"+tknId);
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
        }
    }
    */
}


module.exports = Nodes;