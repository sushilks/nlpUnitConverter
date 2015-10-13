'use strict';

var Utils = require('../nodes_utils');
var Jsnx = require('jsnetworkx');
var BaseExp = require('./base_exp.js');
var dbg = require('debug')('node:exp:qconv');

//var assert = require('assert');

/*
*/

class QConvert extends BaseExp {
    constructor(nodes, matchResult) {
        /*matchResult.r = {};
        matchResult.r.convFrom = matchResult.convFrom.fromArg;
        matchResult.r.convTo = matchResult.convTo.toArg;
        matchResult.r.fromValue = matchResult.convFrom.fromArgValue;*/

        //matchResult.fromValue = ((matchResult['fromValue']))? matchResult['fromValue'] : 1;
        super(nodes, matchResult);
        this.name = QConvert.getName();
    }
    static getName() {
        return 'QConv';
    }
    static getMatchToken() {
        return ['VerbBase'];
    }
    static getArgs() {
        //return ['convTo', 'convFrom', 'fromValue'];
        //return ['convTo', 'convFrom', 'Number:convFrom'];
        return {
            'convTo': {},
            'convFrom': {},
            'fromValue': { type: 'Number', extractionNode: 'convFrom', default: 1}
        };

    }
    exec(gr, verbose = true) {
        //console.log('Adding to graph:' + this.getName());
        //console.log('Graph name:' + this.getUnitsFor());
        let a : ExpMatch = this.result;
        //console.log("----- " + JSON.stringify(this.result));
        let nFrom = Utils.normalizeUnit(this.result.getArgStr('convFrom'));
        let nTo = Utils.normalizeUnit(this.result.getArgStr('convTo'));
        for (let k in gr) {
            let g = gr[k];
            //console.log('LOOKING FOR [' + nFrom + '] [' + nTo + ']');
            if (g.hasNode(nFrom) && g.hasNode(nTo)) {
                //console.log("FOUDN NODES 1");
                let sp = Jsnx.shortestPath(g, {source: nFrom, target: nTo});
                dbg('SHORTEST PATH From:' + nFrom + ' TO:' + nTo +
                    ' is [' + sp + ']');
                let currentNode = nFrom;
                sp.shift();
                let val = Utils.textToNumber(this.result.getArgStr('fromValue'));
                for (let nextNode of sp) {
                    let ed = g.getEdgeData(currentNode, nextNode);
                    dbg('\t' + currentNode + '->' + nextNode + 'E[' + JSON.stringify(ed) + ']');
                    val = val * ed.conv;
                    currentNode = nextNode;
                }
                if (verbose) {
                    console.log('\t\t' + this.getName() + '::Converted ' + this.result.getArgStr('fromValue') + ' ' + nFrom + ' to ' +
                        nTo + ' Value = ' + val);
                }
                //g.addEdge(nFrom, nTo, {conv: this.getConv()});
                //g.addEdge(nTo, nFrom, {conv: 1.0/this.getConv()});
                return;
            }
        }
        console.log(this.getName() + ' :: ERROR Unable to find nodes [' + nFrom + '] [' + nTo + ']');
    }
    static checkValidArguments(nodes, match, graphDB) {
        return true;
    }
}

/*
  QConvert : convert-from, convert-to, from-value
  normalize the units in convert-from and convert-to
  check if convert-from and convert-to nodes exist in the graph database.
  if they dont exist report and return.
  on the network(Jsnx) compute the shortest path between the nodes 'convert-from' and 'convert-to'

  QConvert : convTo, convFrom, fromValue
  normalize the nodes convTo and convFrom
  find a graph that has both the nodes, if not found return with error.
  find the shortest path between the two nodes and accumulate all the multipliers between them.


//
 {"stmt":"translate 10 thousand Parsec to Yards .",
 "match":{"verb":"/^translate$/i","verbModWho":"/^([^> ]*)$/","verbMod":"/^translate$/i","obj":"/^([^>]+)>nummod>([^>]+)$/i"},
 "extract":{"convTo":"verbModWho[1]","convFrom":"obj[1]","fromValue":"obj[2]"},"type":"QConv","_id":"B1nIAod2hoR0AuG4"}
  verb - translate
     - who -> extract
     - obj
         - numnod modifier ()
 */
export default QConvert;
