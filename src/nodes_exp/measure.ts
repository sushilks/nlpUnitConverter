/// <reference path="../nodes.d.ts" />
/// <reference path="base_exp.d.ts" />
'use strict';

import * as Utils from '../nodes_utils';
import BaseExp from './base_exp';
var assert = require('assert');
var dbg = require('debug')('node:exp:measure');
var Jsnx = require('jsnetworkx');

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
    subj: string;
    type: string;
    constructor(nodes: Nodes, matchResult: ExpMatch) {
        super(nodes, matchResult);
        this.name = DefineMeasure.getName();
        /*
        assert.equal(this.result.args.subj.listStr.length, 1);
        assert.equal(this.result.args.type.listStr.length, 1);
        this.subj = this.result.args.subj.listStr[0];
        this.type = this.result.args.type.listStr[0];*/
        assert.equal(this.result.getArgStrLength('subj'), 1);
        assert.equal(this.result.getArgStrLength('type'), 1);
        this.subj = this.result.getArgStr('subj');
        this.type = this.result.getArgStr('type');
    }
    static getName(): string {
        return 'Define';
    }
    static getArgs(): ExpArgType {
        return {
            input: {
                subj: {type: 'string'},
                type: {type: 'string'}
            },
            output: {
            }
        };
    }

    createGraph(globalBucket: GlobalBucket, name: string, attr: any) {
        attr.name = name;
        if (!globalBucket.gr) {
            globalBucket.gr = {};
        }
        globalBucket.gr[name] = new Jsnx.DiGraph(null, attr);
        return globalBucket.gr[name];
    }

    exec(globalBucket: GlobalBucket): ExpExecReturn {
        let gr = globalBucket.gr;
        //console.log('Adding to graph:' + this.getName());
        let g = this.createGraph(globalBucket, this.subj, { type : this.type});
        //console.log(' New Graph Name = ' + JSON.stringify(g.toString()));
        return {};
    }

    static checkValidArguments(nodes: Nodes, match: ExpMatch, globalBucket: GlobalBucket) {
        return true;
    }
    /*
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
        } //else if ('verbModWhat' in vb && 'verbMod' in vb &&
          //         vb.verbMod.match(/defined/i)) {
          //  obj = vb.verbModWhat;
        //}
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
    }*/
}

export default DefineMeasure;