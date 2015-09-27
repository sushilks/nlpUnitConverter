
/// < reference path="../node_modules/source-map-support/source-map-support.js" />
'use strict';

/* @flow */
//import { install } from 'source-map-support';
//install();
require('source-map-support').install();
require("babel/register")({
    optional: ['es7.asyncFunctions']
});
// typescript needs the definition.
declare function require(name:string);

var parser;
import NLPPP from './nlp_pp';
//import Dependency from './dependency';
//import Tokens from './tokens';

var ArgumentParser = require('argparse').ArgumentParser;
var NLPClient = require('./nlp_client.js');
var Nodes = require('./nodes.js');
var ExpDB = require('./expdb');
var ExpLearn = require('./exp_learn');
var FS = require('fs');
var Ut = require('util');
var readline = require('readline');
var Utils = require('./nodes_utils');
var debug = require('debug');
let expLearn;
let expDB;

//import NLPPP from './nlp_pp';
//var ToDefine = require('./to_define');

parser = new ArgumentParser({
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
var learnData: Array<string> = (args.learn_data)?args.learn_data.split(','):[];
//console.log('PORT = ' + port);
//console.log("DEBUG = " + args.debug);
// process a node
// look at all the children nodes with the link type....

/**
  * Helper function to display the nodes'
  * Only for debugging
  */
function parseNodes(dep: Dependency, tokens: Tokens, tknid: number, linkType: string, level: number) {
    if (level === undefined) {
        level = 1;
    }
    let childNodes = dep.getChildNodes(tknid);
    let str: string = 'Parsing : [' + tknid + ']' + tokens.getToken(tknid) + '(' + tokens.getTokenPOS(tknid) + ') , ' + linkType;
    for (var idx = 0; idx < level; idx++) {
        str = '\t' + str;
    }
    //console.log(str);
    for (var id in childNodes) {
        parseNodes(dep, tokens, childNodes[id].tokenIdx, childNodes[id].type, level + 1);
    }
 }

async function parse(data, gr, dbge: boolean = false) {
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
                for (var tid = 1; tid <= tkn.tokenCount(); tid++) {
                    tknString += tid + ':' + tkn.getToken(tid) + '(' + tkn.getTokenPOS(tid) + ') ';
                }
                dbg(' \tTOKEN -  ' + tknString);
                let dep = pp.getSentenceDep(idx);
                let rootId = dep.getRootToken();
                dbg(' \tRoot : ' + rootId);
                parseNodes(dep, dep.getTokens(), rootId, 'root', 0);
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
    nd.processAllGrammar();
    dbg("Done with processing Grammar");
    // check if any hardcoded patterns match
    nd.processAllExp();
    dbg("Done with processing Explain");

    // check if any of the database entries are matching
    let dt = await nd.processAllExpDB(expDB, gr);
    dbg("Done with processing DBExplain");
    {
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
            if (nd.grMatches[idx].getName().match(/VerbBase/)) {
                dbgSelect = dbgGrV;
            }
            dbgSelect('\tGrammar IDX = ' + idx + ' :: Grammar Type [' + nd.grMatches[idx].getName()
                + '] Matched Text  ::' + nd.grMatches[idx].text());
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
            nd.expMatches[idx].exec(gr);
        } catch (e) {
            console.log('Node:' + nd.expMatches[idx].name + ' had an exception when runing exec.')
            console.log(e);
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
        let v = [];
        for (let idx in nd.grMatches) {
            if (nd.grMatches[idx].getName().match(/VerbBase/)) {
                //console.log('   Verb in this statement :: ' + JSON.stringify(nd.grMatches[idx].processNode()));
                v.push(nd.grMatches[idx]);
            }
        }
        /*
          Call the learning Routing to collect the information and write it to the database.
        */
        return expLearn.learn(pp.getSentence(0), v, learnData, nd.expMatches);
    } else {
        return res;
    }

    } catch(e) {
        console.log(' Exception e ' + e);
        console.log('   -> ' + e.stack);
    }

}

/**
  * Send a text to the Client get the
  * nlp response and process it
  */
async function processText(client, txt, gr={}, dbg=false) {
    let res = await client.req(txt);
    let p = await parse(res, gr, dbg);
    return p;
}
async function processList(client, txtList, gr, dbg, fn) {
    let t = txtList.shift();
    if (t === '') {
        if (txtList.length)
            return processList(client, txtList, gr, dbg, fn);
        fn();
        return;
    }
    let r = await processText(client, t, gr, dbg);
    if (txtList.length) {
        processList(client, txtList, gr, dbg, fn);
    } else {
        fn();
    }
}
 async function startCLI(fn) {

    let dt1 = await Utils.getStdin('>');
    let dt2 = await fn(dt1);
    let dt3 = await startCLI(fn);
    return dt3;
}

async function main(args, nlp, gr) {
    if (args.input && args.input !== '') {
        var contents = FS.readFileSync(args.input).toString();
        let txt = contents.split('\n');
        if (args.txt && args.txt !== '') {
            txt.push(args.txt);
        }
        processList(nlp, txt, gr, args.debug, async function () {
            if (args.debug) {
                console.log(' Status of the graph created so far');
                for (var gkey in gr) {
                    console.log("gkey=" + gkey);
                    console.log('Details of Graph: key=' + gkey + '  ::  ' + gr[gkey].toString());
                    console.log('   Details of Nodes:' + JSON.stringify(gr[gkey].nodes(true)));
                    console.log('   Details of Edges:' + JSON.stringify(gr[gkey].edges(true)));
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
                        return await processText(nlp, line, gr, args.debug)

                    }
                });
                console.log("DONE CLI.");
            }

        });
    } else if (args.txt && args.txt !== '') {
        await processText(nlp, args.txt, gr, args.debug)
        console.log("eParser Done");
    }
}



/*
the ProcessGr part needs some more thought
Not able to parse even simple constructs right now. need to analyze them a bit.
*/

let nlp = new NLPClient();
let gr = {};
expDB = new ExpDB('lexp.db');
/*
var rl = readline.createInterface({
    input:process.stdin,
    output: process.stdout
});
*/
expLearn = new ExpLearn(expDB, Nodes.getGlobalExpMapper());

main(args, nlp, gr);