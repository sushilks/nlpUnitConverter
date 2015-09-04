'use strict';

var Utils = require('./nodes_utils');
var FS = require('fs');

var gNodeMapper = {}; /** To hold different node types */
var gGrMapper = {};   /** To hold different grammer rules */
var gExpMapper = {};   /** To hold different grammer rules */

var normalizedPath = require('path').join(__dirname);
var dbg = require('debug')('nodes:base');
var dbgdb = require('debug')('nodes:base:db');

/** Load and init the nodes */
FS.readdirSync(normalizedPath + '/nodes_pos').forEach(function(file) {
    if (file.match(/\.js$/)) {
        Utils.nodeInit(gNodeMapper, require('./nodes_pos/' + file));
    }
});

/** Load and init the grammer rules */
FS.readdirSync(normalizedPath + '/nodes_gr').forEach(function(file) {
    if (file.match(/\.js$/)) {
        Utils.nodeInit(gGrMapper, require('./nodes_gr/' + file));
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
                dbgdb(' - VERB - ::' + JSON.stringify(verb.dict()));


                db.find({})
                    .then((function (_this, dt) {
                        //console.log(' TEST - DB - dt = ' + JSON.stringify(dt));
                        for (let dbItem of dt) {
                            let match = Utils.verbDBMatch(dbgdb, verb, dbItem);
                            if (match[0] !== '') {
                                dbgdb('Found a match dbItem [' + JSON.stringify(match) + '] ')
                                let fn = gExpMapper._map[match[0]];
                                let expHandle = new fn(_this, match[1]);
                                _this.expMatches.push(expHandle);
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

    /** Process all the tokens in order
     *  Try to match all the grammar rules
     *
     */
    processAllGrammar() {
        for (var tidx = 1; tidx <= this.dep.getTokensCount(); tidx++) {
            let lnd = this.getNodeMap(tidx);
            if (lnd && !lnd.grProcessingDone && !lnd.getTokenPOS().match(/VB/)) {
                dbg('Processing Grammar for token ' + tidx + '   val = '
                    + this.tkn.getToken(tidx ) + ' ND = ' + lnd
                    + ' ND.tkn:' + lnd.getToken());
                let res = this.processGr(tidx);
//                if (this.dbg) {
//                    console.log('  - Grammar Processing of lnd resulted in ' + lnd + ' res = ' + res);
//                }
            }
        }

        for (var tidx = 1; tidx <= this.dep.getTokensCount(); tidx++) {
            let lnd = this.getNodeMap(tidx);
            if (lnd && lnd.getTokenPOS().match(/VB/)) {
                dbg('Processing Grammar for token ' + tidx + '   val = '
                    + this.tkn.getToken(tidx ) + ' ND = ' + lnd
                    + ' ND.tkn:' + lnd.getToken());
                let res = this.processGr(tidx);
//                if (this.dbg) {
//                    console.log('  - Grammar Processing of lnd resulted in ' + lnd + ' res = ' + res);
//                }
            }
        }
    }

    /** Process only one token "tknId" for grammar match
     * @param tknId - Specify the token to process
     * @returns {*} - return [true if match was found, grammar that matched]
     */
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
                let found = GRM.checkValid(this, nd);
                if (found[0]) {
                    dbg('  - gGrMapper Checking with tkn [' + tkn + ']');
                    dbg('\tFound ' + JSON.stringify(found[1]));
                }
                if (found[0]) {

                    let grHandle = new GRM(this, found[1]);
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
}


module.exports = Nodes;