'use strict';
import { install } from 'source-map-support';
install();

var parser;
var ArgumentParser = require('argparse').ArgumentParser;
var NLPClient = require('./nlp_client.js');
var NLPPP = require('./nlp_pp');
var Nodes = require('./nodes.js');
var FS = require('fs');

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
    [ '-p', '--port'],
    { help: 'port on which server is running'});

var args = parser.parseArgs();
var port = args.port || 8990;
//console.log('PORT = ' + port);
//console.log("DEBUG = " + args.debug);
// process a node
// look at all the children nodes with the link type....

/**
  * Helper function to display the nodes'
  * Only for debugging
  */
function parseNodes(dep, tokens, tknid, linkType, level) {
    if (level === undefined) {
        level = 1;
    }
    let childNodes = dep.getChildNodes(tknid);
    let str = 'Parsing : [' + tknid + ']' + tokens.getToken(tknid) + '(' + tokens.getTokenPOS(tknid) + ') , ' + linkType;
    for (var idx = 0; idx < level; idx++) {
        str = '\t' + str;
    }
    console.log(str);
    for (var id in childNodes) {
        parseNodes(dep, tokens, childNodes[id].tokenIdx, childNodes[id].type, level + 1);
    }
 }

function parse(data, gr, dbg = false) {
    var pp = new NLPPP();
    var res = pp.read(data.body);
    if (dbg) {
        console.log(' Parser result : ' + JSON.stringify(res));
        console.log(' Number of Sentences :' + pp.sentenceCount());
        for (var idx = 0; idx < pp.sentenceCount(); idx = idx + 1) {
            console.log(' Sentence ' + idx + ' :' + pp.getSentence(idx));
            console.log(' \tParse Tree :' + pp.getParseTree(idx));
            let tkn = pp.getTokens(idx);
            var tknString = '';
            for (var tid = 1; tid <= tkn.tokenCount(); tid++ ) {
                tknString += tid + ':' + tkn.getToken(tid) + '(' + tkn.getTokenPOS(tid) + ') ';
            }
            console.log(' \tTOKEN -  ' + tknString);
            let dep = pp.getSentenceDep(idx);
            let rootId = dep.getRootToken();
            console.log(' \tRoot : ' + rootId);
            parseNodes(dep, dep.getTokens(), rootId, 'root');
        }
    }
    let rt = pp.getSentenceDep(0).getRootToken();
    if (dbg) {
        console.log('--------------------------------------------------');
        console.log('Processing :: ' + pp.getSentence(0) + ' ROOT:' +
            rt + '[' + pp.getTokens(0).getToken(rt) + ']');
    } else {
        console.log('Processing :: ' + pp.getSentence(0));
    }
    let nd = new Nodes(pp.getSentenceDep(0), dbg);
    nd.processAllGrammar();
    if (dbg) {
        console.log("Done with processing Grammar");
    }
    nd.processAllExp();
    if (dbg) {
        console.log("Done with processing Explain");
    }
//    nd.analyze();
    //console.log('res = ' + res);
    if (dbg) {
        console.log("List of Grammar Matches Found ")
        for (idx in nd.grMatches) {
            console.log('\tGrammar IDX = ' + idx + ' :: Grammar Type [' + nd.grMatches[idx].getName()
                + '] Matched Text  ::' + nd.grMatches[idx].text());
        }
        console.log("List of Expresive Matches Found ")
        for (idx in nd.expMatches) {
            console.log('\t Expresive IDX = ' + idx + ' :: Exp Type [' + nd.expMatches[idx].getName()
                + '] Matched Text  ::' + nd.expMatches[idx].text());
        }
    }
    for (idx in nd.expMatches) {
        nd.expMatches[idx].exec(gr);
    }
    return res;
}

/**
  * Send a text to the Client get the
  * nlp response and process it
  */
function process(client, txt, gr={}, dbg=false) {
    return new Promise(
        function(resolve, reject) {
            client.req(txt).then(function(res) {
                parse(res, gr, dbg);
            }, function(err) {
                reject(err);
            }).then(function(res) {
                resolve(res);
            }, function(err) {
                console.log('ERROR when processing request :: ' + err.stack);
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
    return process(client, t, gr, dbg)
    .then(function(r) {
            if (txtList.length) {
                processList(client, txtList, gr, dbg, fn);
            } else {
                fn();
            }
    });
}
/*
the ProcessGr part needs some more thought
Not able to parse even simple constructs right now. need to analyze them a bit.
*/

let nlp = new NLPClient();
let gr = {};

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
    });
} else if (args.txt && args.txt !== '') {
        process(nlp, args.txt, gr, args.debug)
            .then(function (r) {
                console.log("Done r=" + r);
            });
} else {
    process(nlp, 'Time is  defined to be a Measure.')
        .then(function (r) {
            return process(nlp, 'Time is a Measure.');
        })
        .then(function (r) {
            return process(nlp, 'Time is defined as a Measure.');
        })
        .then(function (r) {
            return process(nlp, 'Time is a type of Measure.');
        })
        .then(function (r) {
            return process(nlp, 'Time is of type Measure.');
        })
        .then(function (r) {
            return process(nlp, 'Time is defined to be a type of Measure.');
        })
        .then(function (r) {
            return process(nlp, 'Measuring time is fun.');
        })
        .then(function (r) {
            return process(nlp, 'time passes by quick.');
        });
}