/// <reference path="../nodejs.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// < reference path="../node_modules/source-map-support/source-map-support.js" />
'use strict';

require('source-map-support').install();
require('babel/polyfill');

var assert = require('assert');
// typescript needs the definition.
//declare function require(name:string);
var ArgumentParser = require('argparse').ArgumentParser;
var FS = require('fs');
var Ut = require('util');
var readline = require('readline');
var debug = require('debug');
var NLPClient = require('./nlp_client.js');

import NLPPP from './nlp_pp';
import Dependency from './dependency';
import Tokens from './tokens';
import Nodes from './nodes';
import ExpDB from './expdb';
import ExpLearn from './exp_learn';
import * as Utils from './nodes_utils';
let expLearn: ExpLearn;
let expDB: ExpDB;

//import NLPPP from './nlp_pp';
//var ToDefine = require('./to_define');

let parser = new ArgumentParser({
    version: '1.0.0',
    addHelp: true,
    description: 'A language parser'});
parser.addArgument(
    [ '-i', '--input'],
    { help: 'input file to parse'});
parser.addArgument(
    [ '-t', '--txt'],
    { help: 'input text to parse'});
parser.addArgument(
    [ '-d', '--debug'],
    { help: 'debug mode', action:'storeTrue'});
parser.addArgument(
    [ '-c', '--cli'],
    { help: 'start a CLI', action:'storeTrue'});
parser.addArgument(
    [ '-l', '--learn'],
    { help: 'Learning mode', action:'storeTrue'});
parser.addArgument(
    [ '-L', '--learn_data'],
    { help: 'Data that is used for learning a single command'});
parser.addArgument(
    [ '-F', '--force_learn'],
    { help: 'Force learning even if matches are found', action:'storeTrue'});
parser.addArgument(
    [ '-p', '--port'],
    { help: 'port on which server is running'});


var args = parser.parseArgs();
//var port: number = args.port || 8990;
var learnData: Array<string> = [];
//console.log('PORT = ' + port);
//console.log("DEBUG = " + args.debug);
// process a node
// look at all the children nodes with the link type....

/**
  * Helper function to display the nodes'
  * Only for debugging
  */
function parseAndDisplayNodes(dep: Dependency, tokens: Tokens, tknid: number, linkType: string, level: number) {
    if (level === undefined) {
        level = 1;
    }
    let childNodes = dep.getChildNodes(tknid);
    let str: string = 'Parsing : [' + tknid + ']' + tokens.getToken(tknid) + '(' + tokens.getTokenPOS(tknid) + ') , ' + linkType;
    for (var idx = 0; idx < level; idx++) {
        str = '\t' + str;
    }
    console.log(str);
    for (var id in childNodes) {
        parseAndDisplayNodes(dep, tokens, childNodes[id].tokenIdx, childNodes[id].type, level + 1);
    }
 }



async function parse(data:{body: string}, globalBucket: GlobalBucket, dbge: boolean = false): Promise<boolean> {
    var pp = new NLPPP();
    var res = pp.read(data.body);
    var dbg = debug('eparser:parse');
    var dbgGr = debug('eparser:gr');
    var dbgGrV = debug('eparser:gr:verb');
    var dbgExp = debug('eparser:exp');
    try {
        if (dbg.enabled) {
            dbg(' Parser result : ' + JSON.stringify(res));
            dbg(' Number of Sentences :' + pp.sentenceCount());
            for (let idx = 0; idx < pp.sentenceCount(); idx = idx + 1) {
                dbg(' Sentence ' + idx + ' :' + pp.getSentence(idx));
                dbg(' \tParse Tree :' + pp.getParseTree(idx));
                let tkn = pp.getTokens(idx);
                var tknString:string = '';
                console.log(' tocket = ' + tkn);
                for (var tid = 1; tid <= tkn.tokenCount(); tid++) {
                    tknString += tid + ':' + tkn.getToken(tid) + '(' + tkn.getTokenPOS(tid) + ') ';
                }
                dbg(' \tTOKEN -  ' + tknString);
                let dep = pp.getSentenceDep(idx);
                let rootId = dep.getRootToken();
                dbg(' \tRoot : ' + rootId);
                //parseAndDisplayNodes(dep, dep.getTokens(), rootId, 'root', 0);
            }
        }
        let rt = pp.getSentenceDep(0).getRootToken();
        let log_dt = '';
        if (dbg.enabled) {
            dbg('--------------------------------------------------');
            dbg('Processing :: ' + pp.getSentence(0) + ' ROOT:' +
                rt + '[' + pp.getTokens(0).getToken(rt) + ']');
        } else {
            log_dt = 'Processing :: ' + pp.getSentence(0);
        }
        let nd = new Nodes(pp.getSentenceDep(0));
        //console.log('ND before grammar = ' + JSON.stringify(nd));
        // nd.dep, nd.tkn.tokens is populated form the results form the
        // corenlp module, all the relation and the tokes are identified.
        // This very much looks like the output of coreNLP
        nd.processAllGrammar();
        // after this the nd.grMatches is populated
        // this contains the full tree of the relations
        //    items are fromNode, toNode[], link type of parent, match
        // each grMatch node has a list of nodes it's connected to and the type of link that's connecting them
        // The same view is transformed into a tree that is consumed in EXP node
        //   by call ing 'processNode' on root a structure is created that has
        //   [tokenId, token, data, dataValue, dataValueTagged']
        //   dataValue and dataValueTagged are processed result of the grammar nodes at different levels.
        /*
        {
            console.log('ND After Grammar = ');
            for (let kidx in nd.grMatches) {
                console.log('nd.grMatches[' + kidx + '] = ' + JSON.stringify(nd.grMatches[kidx]()));
                let root: GrProcessNodeValueMap = {};

                console.log('nd.PROCgrMatches[' + kidx + '] = ' + JSON.stringify(nd.grMatches[kidx]().processNode(root)));
            }
        }*/
        dbg("Done with processing Grammar");
        // check if any hardcoded patterns match
        nd.processAllExp();
        //console.log('ND afer exp = ' + JSON.stringify(nd));
        dbg("Done with processing Explain");
        // check if any of the database entries are matching
        let root = await nd.processAllExpDB(expDB, globalBucket);
        //console.log('ND afer ExpDB = ' + JSON.stringify(nd));
        //console.log(' ROOT = ' + JSON.stringify(root));
        // ProcessAllExp populates an entry .partialExp on the tree that was build by grammar parsing step
        // it's also pushing all the matching exp into a global structure nd.expMatches which is populated by the
        // exp nodes that matched.


        // partial matches + exp matches should form a new tree structure.


        dbg("Done with processing DBExplain");
        { // debug
            log_dt += ' \tParsedMeaning[';
            for (let idx in nd.expMatches) {
                //console.log('   Exp[' + idx + '-' + nd.expMatches[idx].getName()
                //    + ']::' + nd.expMatches[idx].text());
                log_dt += nd.expMatches[idx].getName() + ' ';
            }
            console.log(log_dt + ']');
        }

        // just some debug prints
        if (dbgGr.enabled || dbgExp.enabled) {
            //dbgGr("List of Grammar Matches Found ")
            for (let idx in nd.grMatches) {
                let dbgSelect = dbgGr;
                if (nd.grMatches[idx]().getName().match(/VerbBase/)) {
                    dbgSelect = dbgGrV;
                }
                dbgSelect('\tGrammar IDX = ' + idx + ' :: Grammar Type [' + nd.grMatches[idx]().getName()
                    + '] Matched Text  ::' );//+ nd.grMatches[idx].dict());
            }
            //dbgExp("List of Expresive Matches Found ")
            for (let idx in nd.expMatches) {
                dbgExp('\t Expresive IDX = ' + idx + ' :: Exp Type [' + nd.expMatches[idx].getName()
                    + '] Matched Text  ::' + nd.expMatches[idx].text());
            }
        }
        // execute all the exp matches
        for (let idx in nd.expMatches) {
            try {
                nd.expMatches[idx].exec(globalBucket);
            } catch (e) {
                console.log('Node:' + nd.expMatches[idx].name + ' had an exception when runing exec.')
                console.log(e);
                console.log(e.stack);
            }
        }

        // If failed to match
        //  go through the learning routine.
        let alreadyLearned = false;
        for (let p of nd.expMatches) {
            if (learnData[1] === p.name) {
                alreadyLearned = true;
            }
        }
        if (nd.expMatches.length === 0) {
            console.log('   This Statement did not match any of the types that I am able to recognize.');
        }

        if (args.learn && !alreadyLearned && learnData.length !== 0) {
            let v: Array<GrBase> = [];
            for (let idx in nd.grMatches) {
                if (nd.grMatches[idx]().getName().match(/VerbBase/)) {
                    //console.log('   Verb in this statement :: ' + JSON.stringify(nd.grMatches[idx].processNode()));
                    v.push(nd.grMatches[idx]());
                }
            }
            /*
          Call the learning Routing to collect the information and write it to the database.
        */
           // console.log(' V = ' + JSON.stringify(v));
            //return expLearn.learn(pp.getSentence(0), v, learnData, nd.expMatches);
            return expLearn.learn(pp.getSentence(0), root, learnData);
        } else {
            return true;
        }

    } catch(e) {
        console.log(' Exception in eparser:parse e [' + e + ']');
        console.log('   -> ' + e.stack);
        return false;
    }
}

/**
  * Send a text to the Client get the
  * nlp response and process it
  */
async function processText(client: NLPClient, txt: string, globalBucket: GlobalBucket, dbg=false) {
    let res = await client.req(txt);
    let p = await parse(res, globalBucket, dbg);
    return p;
}

async function processList(client: NLPClient, txtList: Array<string>, globalBucket: GlobalBucket, dbg: typeof debug): Promise<void> {
    let t = txtList.shift();
    if (t === '') {
        if (txtList.length)
            return processList(client, txtList, globalBucket, dbg);
        return;
    }
    let r = await processText(client, t, globalBucket, dbg);
    if (txtList.length) {
        return processList(client, txtList, globalBucket, dbg);
    } else {
        return;
    }
}
 async function startCLI(fn: (line: string)=>void ): Promise<void> {
    let dt1 = await Utils.getStdin('>', []);
    let dt2 = await fn(dt1);
    let dt3 = await startCLI(fn);
    return dt3;
}

async function main(args: any, nlp: NLPClient, globalBucket: GlobalBucket): Promise<void> {
    if (args.input && args.input !== '') {
        var contents = FS.readFileSync(args.input).toString();
        let txt = contents.split('\n');
        await processList(nlp, txt, globalBucket, args.debug);

        if (args.txt && args.txt !== '') {
            txt = [args.txt];
            learnData = (args.learn_data)?args.learn_data.split(','):[];
            await processList(nlp, txt, globalBucket, args.debug);
        }

        //    processList(nlp, txt, globalBucket, args.debug, async function () {

        if (args.debug) {
            console.log(' Status of the graph created so far');
            for (var gkey in globalBucket.gr) {
                console.log("gkey=" + gkey);
                console.log('Details of Graph: key=' + gkey + '  ::  ' + globalBucket.gr[gkey].toString());
                console.log('   Details of Nodes:' + JSON.stringify(globalBucket.gr[gkey].nodes(true)));
                console.log('   Details of Edges:' + JSON.stringify(globalBucket.gr[gkey].edges(true)));
            }
        }
        if (args.cli) {

            await startCLI(async function(line) {
                let re1 = line.match(/enable.*debug[ ]+([^ ]+)/i);
                let re2 = line.match(/disable.*debug[ ]+([^ ]+)/i);
                if (re1) {
                    console.log("Enabeling Debug for " + re1[1]);
                    //debug.enable(re1[1]);
                    debug.enable('*');
                    //rl.__block_l1 = false;
                    //rl.prompt();
                    return ;
                } else if (re2) {
                    console.log("Disabeling Debug for " + re2[1]);
                    debug.disable('-' + re2[1]);
                    //rl.__block_l1 = false;
                    //rl.prompt();
                    return ;
                } else {
                    return await processText(nlp, line, globalBucket, args.debug)

                }
            });
            console.log("DONE CLI.");
        }

        //});
    } else if (args.txt && args.txt !== '') {
        learnData = (args.learn_data)?args.learn_data.split(','):[];
        await processText(nlp, args.txt, globalBucket, args.debug)
        console.log("eParser Done");
    }
}



/*
the ProcessGr part needs some more thought
Not able to parse even simple constructs right now. need to analyze them a bit.
*/
expDB = new ExpDB('lexp.db');
let nlp =  new NLPClient();
let globalBucket : GlobalBucket = <GlobalBucket> {};
globalBucket.gr = <NodeGraph>{};
/*
var rl = readline.createInterface({
    input:process.stdin,
    output: process.stdout
});
*/
expLearn = new ExpLearn(expDB, Nodes.getGlobalExpMapper());

main(args, nlp, globalBucket);