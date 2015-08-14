'use strict';

//import * as utils from './node_utils';
var Utils = require('../nodes_utils');
var assert = require('assert');
/*
This node should create a new graph and install it.
Details of the graph :-
   on identification of unit's
      create a state in the graph for each unit
   on identification of relationship
      create an edge between the states of the graph
      with some function to do the conversion.
var G = new Jsnx.graph(null, {name:"name of graph"});
g.addNode(nodeid, {data...});
g.addEdge(n1, n2, {data....});
*/

class DefineMeasure {
    constructor(nodes, matchResult) {
        this.subj = matchResult.gr.verbSubj;
        this.type = matchResult.gr.verbObj;
        this.gr = matchResult.gr;
        this.nodes = nodes;
        this.dbg = nodes.dbg;
        this.name = 'DefineMeasure';
    }
    static getMatchToken() {
        return ['VerbBase'];
    }
    getName() {
        return this.name;
    }
    text() {
        return 'DefineMeasure [' + this.getSubject() +
        '] to be of type [' +
        this.getType() + ']';
    }
    getSubject() {
        return this.nodes.getNodeMap(this.subj).getValues();
    }
    getType() {
        let r = this.nodes.getNodeMap(this.type).getValues().split('>');
        for (var idx in r) {
            if (!Utils.checkMatchAny(r[idx], ['type', 'unit', 'subset', /nmod.*/])) {
                return r[idx];
            }
        }
        return r;
    }

    exec(gr) {
        //console.log('Adding to graph:' + this.getName());
        let g = Utils.createGraph(gr, this.getSubject(), { type : this.getType()});
        //console.log(' New Graph Name = ' + JSON.stringify(g.toString()));
    }


    static checkValid(gr) {
        const VerbMatch = ['is', 'define', 'defined'];
        const ObjMatch = [/measure/i];

        // check if there is a subject + object and they are connected by regex
        if (gr.dbg) {
            console.log('     verb:' + gr.verb +
                ' subj:' + gr.verbSubj +
                ' obj:' + gr.verbObj);
        }
        let nodes = gr.nodes;
        let verb = gr.getVerb(); //nodes.getNodeMap(gr.verb).getValues();
        let verbSubj = gr.getSubject(); //nodes.getNodeMap(gr.verbSubj).getValues();
        let verbObj = gr.getObject(); //nodes.getNodeMap(gr.verbObj).getValues();
        if (gr.dbg) {
            console.log('     verb:' + verb + ' subj:' + verbSubj + ' obj:' + verbObj);
        }

        if (!Utils.checkMatchAny(verb, VerbMatch)) {
            return [false, {}];
        }
        if (!Utils.checkMatchAny(verbObj, ObjMatch)) {
            return [false, {}];
        }
        return [true, {'gr': gr}];
    }
}

export default DefineMeasure;