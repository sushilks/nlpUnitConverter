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
        return ['convTo', 'convFrom', 'fromValue'];
    }
    exec(gr) {
        //console.log('Adding to graph:' + this.getName());
        //console.log('Graph name:' + this.getUnitsFor());

        let nFrom = Utils.normalizeUnit(this.result.convFrom);
        let nTo = Utils.normalizeUnit(this.result.convTo);
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
                let val = Utils.textToNumber(this.result.fromValue);
                for (let nextNode of sp) {
                    let ed = g.getEdgeData(currentNode, nextNode);
                    dbg('\t' + currentNode + '->' + nextNode + 'E[' + JSON.stringify(ed) + ']');
                    val = val * ed.conv;
                    currentNode = nextNode;
                }
                console.log('\t\t' + this.getName() + '::Converted ' + this.result.fromValue + ' ' + nFrom + ' to ' +
                    nTo + ' Value = ' + val);
                //g.addEdge(nFrom, nTo, {conv: this.getConv()});
                //g.addEdge(nTo, nFrom, {conv: 1.0/this.getConv()});
                return;
            }
        }
        console.log(this.getName() + ' :: ERROR Unable to find nodes [' + nFrom + '] [' + nTo + ']');
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


 */
export default QConvert;
