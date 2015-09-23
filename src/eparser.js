'use strict';

/* @flow */
import { install } from 'source-map-support';
install();

var parser;
var ArgumentParser = require('argparse').ArgumentParser;
var NLPClient = require('./nlp_client.js');
var NLPPP = require('./nlp_pp');
var Nodes = require('./nodes.js');
var ExpDB = require('./expdb');
var ExpLearn = require('./exp_learn');
var FS = require('fs');
var Ut = require('util');
var readline = require('readline');
var Utils = require('./nodes_utils');
var debug = require('debug');
let expLearn;

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
var port = args.port || 8990;
var learnData = (args.learn_data)?args.learn_data.split(','):[];
//console.log('PORT = ' + port);
//console.log("DEBUG = " + args.debug);
// process a node
// look at all the children nodes with the link type....

/**
  * Helper function to display the nodes'
  * Only for debugging
  */
function parseNodes(dep, tokens, tknid : number, linkType, level) {
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

function parse(data, gr, dbge = false) {
    var pp = new NLPPP();
    var res = pp.read(data.body);
    var dbg = debug('eparser:parse');
    var dbgGr = debug('eparser:gr');
    var dbgGrV = debug('eparser:gr:verb');
    var dbgExp = debug('eparser:exp');
    if (dbg.enabled) {
        dbg(' Parser result : ' + JSON.stringify(res));
        dbg(' Number of Sentences :' + pp.sentenceCount());
        for (var idx = 0; idx < pp.sentenceCount(); idx = idx + 1) {
            dbg(' Sentence ' + idx + ' :' + pp.getSentence(idx));
            dbg(' \tParse Tree :' + pp.getParseTree(idx));
            let tkn = pp.getTokens(idx);
            var tknString = '';
            for (var tid = 1; tid <= tkn.tokenCount(); tid++ ) {
                tknString += tid + ':' + tkn.getToken(tid) + '(' + tkn.getTokenPOS(tid) + ') ';
            }
            dbg(' \tTOKEN -  ' + tknString);
            let dep = pp.getSentenceDep(idx);
            let rootId = dep.getRootToken();
            dbg(' \tRoot : ' + rootId);
            parseNodes(dep, dep.getTokens(), rootId, 'root');
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
    return new Promise(
        function (resolve, reject) {
            nd.processAllExpDB(expDB, gr)
                .then(function(dt) {
                    dbg("Done with processing DBExplain");
                    {
                        log_dt += ' \tParsedMeaning[';
                        for (idx in nd.expMatches) {
                            //console.log('   Exp[' + idx + '-' + nd.expMatches[idx].getName()
                            //    + ']::' + nd.expMatches[idx].text());
                            log_dt += nd.expMatches[idx].getName() + ' ';
                        }
                        console.log(log_dt + ']');
                    }

                    // just some debug prints
                    if (dbgGr.enabled || dbgExp.enabled) {
                        //dbgGr("List of Grammar Matches Found ")
                        for (idx in nd.grMatches) {
                            let dbgSelect = dbgGr;
                            if (nd.grMatches[idx].getName().match(/VerbBase/)) {
                                dbgSelect = dbgGrV;
                            }
                            dbgSelect('\tGrammar IDX = ' + idx + ' :: Grammar Type [' + nd.grMatches[idx].getName()
                                + '] Matched Text  ::' + nd.grMatches[idx].text());
                        }
                        //dbgExp("List of Expresive Matches Found ")
                        for (idx in nd.expMatches) {
                            dbgExp('\t Expresive IDX = ' + idx + ' :: Exp Type [' + nd.expMatches[idx].getName()
                                + '] Matched Text  ::' + nd.expMatches[idx].text());
                        }
                    }
                    // execute all the exp matches
                    for (idx in nd.expMatches) {
                        nd.expMatches[idx].exec(gr);
                    }
                })
                .then(function(dt) {
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
                        for (idx in nd.grMatches) {
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
                        resolve(res);
                    }
                })
                .then(function(dt){
                    resolve(dt);
                })
                .catch(function(e) {
                    console.log("Error :: " + e);
                    console.log(e.stack);

                });
        });
}

/**
  * Send a text to the Client get the
  * nlp response and process it
  */
function processText(client, txt, gr={}, dbg=false) {
    return new Promise(
        function(resolve, reject) {
            client.req(txt).then(function(res) {
                return parse(res, gr, dbg);
            }, function(err) {
                reject(err);
            }).then(function(res) {
                resolve(res);
            }, function(err) {
                console.log('ERROR when processing request :: ' + err.stack);
            }).catch(function(e) {
                console.log("Error :: " + e);
                console.log(e.stack);
            });

        });
}
function processList(client, txtList, gr, dbg, fn) {
    let t = txtList.shift();
    if (t === '') {
        if (txtList.length)
            return processList(client, txtList, gr, dbg, fn);
        fn();
        return;
    }
    return processText(client, t, gr, dbg)
    .then(function(r) {
            if (txtList.length) {
                processList(client, txtList, gr, dbg, fn);
            } else {
                fn();
            }
        }).catch(function(e) {
            console.log("Error :: " + e);
            console.log(e.stack);
        });
}
function startCLI(fn) {
    return Utils.getStdin('>')
        .then(function(res) {
            return fn(res);
        }).then(function(res) {
            return startCLI(fn);
        }).catch(function(e) {
            console.log("Error :: " + e);
            console.log(e.stack);
        });
}
/*
the ProcessGr part needs some more thought
Not able to parse even simple constructs right now. need to analyze them a bit.
*/

let nlp = new NLPClient();
let gr = {};
let expDB = new ExpDB('lexp.db');
/*
var rl = readline.createInterface({
    input:process.stdin,
    output: process.stdout
});
*/
expLearn = new ExpLearn(expDB, Nodes.getGlobalExpMapper());

if (args.input && args.input !== '') {
    var contents = FS.readFileSync(args.input).toString();
    let txt = contents.split('\n');
    if (args.txt && args.txt !== '') {
        txt.push(args.txt);
    }
    processList(nlp, txt, gr, args.debug, function () {
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
            startCLI(function(line) {
                return new Promise(function(resolve, reject) {
                    let re1 = line.match(/enable.*debug[ ]+([^ ]+)/i);
                    let re2 = line.match(/disable.*debug[ ]+([^ ]+)/i);
                    if (re1) {
                        console.log("Enabeling Debug for " + re1[1]);
                        //debug.enable(re1[1]);
                        debug.enable('*');
                        //rl.__block_l1 = false;
                        //rl.prompt();
                        resolve(null);
                    } else if (re2) {
                        console.log("Disabeling Debug for " + re2[1]);
                        debug.disable('-' + re2[1]);
                        //rl.__block_l1 = false;
                        //rl.prompt();
                        resolve(null);
                    } else {
                        processText(nlp, line, gr, args.debug)
                            .then(function (r) {
                                //rl.__block_l1 = false;
                                // rl.prompt();
                                resolve(null);
                            });
                    }
                });
            }).then(function(done) {
                console.log("DONE CLI.");
            }).catch(function(e) {
                console.log("Error :: " + e);
                console.log(e.stack);
            });
        }

    });
} else if (args.txt && args.txt !== '') {
        processText(nlp, args.txt, gr, args.debug)
            .then(function (r) {
                console.log("eParser Done");
            });
}
