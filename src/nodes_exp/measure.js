'use strict';

//import * as utils from './node_utils';
var Utils = require('../nodes_utils');
var BaseExp = require('./base_exp.js');
var assert = require('assert');
var dbg = require('debug')('node:exp:measure');
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

class DefineMeasure extends BaseExp {
    constructor(nodes, matchResult) {
        super(nodes, matchResult);
        this.name = DefineMeasure.getName();
    }
    static getName() {
        return 'Define';
    }
    static getMatchToken() {
        return ['VerbBase'];
    }
    static getArgs() {
        return ['subj', 'type'];
    }
    exec(gr) {
        //console.log('Adding to graph:' + this.getName());
        let g = Utils.createGraph(gr, this.result.subj, { type : this.result.type});
        //console.log(' New Graph Name = ' + JSON.stringify(g.toString()));
    }

    static checkValid(gr) {

        const VerbMatch = ['is', 'define', 'defined'];
        const ObjMatch = [/measure/i];

        // check if there is a subject + object and they are connected by regex
        let nodes = gr.nodes;
        let vb = gr.dict(); //nodes.getNodeMap(gr.verb).getValues();
        //dbg('     verb:' + vb.verb + ' RES: ' + JSON.stringify(vb) + ']');

        if (!Utils.checkMatchAny(vb.verb, VerbMatch)) {
            return [false, {}];
        }
        let obj = '';

        if ('obj' in vb) {
            obj = vb.obj;
            if ('objWhat' in vb) {
                obj = vb.objWhat;
            }
            let re1 = obj.match(/([^>]*)>compound>type/i);
            if (re1) {
                obj = re1[1];
            }
        } else if ('comp' in vb) {
            obj = nodes.getNodeMap(vb.comp).getValues();
            let re1 = obj.match(/([^>]*)>nmod:([^>]*)>([^>]*)/i);
            if (re1) obj = re1[3];
        } /*else if ('verbModWhat' in vb && 'verbMod' in vb &&
                   vb.verbMod.match(/defined/i)) {
            obj = vb.verbModWhat;
        }*/
        else {
            //dbg('Failed-to-find');
            return [false, {}];
        }
        if (!Utils.checkMatchAny(obj, ObjMatch)) {
            //dbg('Failed-to-find');
            return [false, {}];
        }
        let r = [true, {subj: vb.subj, type: obj}];
        dbg('Found r=' + JSON.stringify(r));
        return r;
    }
}

export default DefineMeasure;