/// <reference path="base_node.d.ts" />

'use strict';
/*

A Node needs the following capabilities
- Is it of type:VB* and token:is
- Is it of type:NN* and has a child with link:cop and child-type:VB* and child-token:is

need access to parent node with link type.
*/
//import Tokens from './tokens';
//import Dependency from './dependency';

var dbg = require('debug')('node:pos:base');

class BaseNode {
    name: string;
    nodes: any;
    tknId: number;
    level: number;
    children: {[key: number]: LinkedNode};
    parent: LinkedNode;
    grProcessingOngoing: boolean;
    grProcessingDone: boolean;
    grMatches: Array<GrBase>;
    //nd:BaseNode;

    constructor(nodes: Nodes, tknId: number, level: number, noprocess: boolean) {
        let name = tknId + '_' + nodes.getTokens().getToken(tknId) + '_'
            + nodes.getTokens().getTokenPOS(tknId);
        this.name = (name === undefined) ? 'Unnamed-Node' : name;
        this.nodes = nodes;
        this.tknId = tknId;
        this.level = level;
        this.children = {};
        //this.parent = {};
        this.grProcessingOngoing = false;
        this.grProcessingDone = false;
        this.grMatches = [];
        dbg(this.tabs() + ' Creating Node with Name : ' + this.name);
        if (noprocess === true) {
            //this.nd = null;
        } else {
            //this.nd =
            this.process(tknId);
        }
        nodes.setNodeMap(tknId, this);
    }
    static getMatchToken(): string {
        return 'DEFAULT';
    }

    tabs(): string {
        let t = '';
        for (var i = 0; i < this.level; ++i) {
            t += '\t';
        } 
        return t;
    }

    isGrammarProcessingDone(): boolean {
        return this.grProcessingDone;
    }
    setGrammarProcessingDone(b = true)  {
        this.grProcessingDone = b;
    }
    addGrammarMatch(gr: GrBase) {
        this.grMatches.push(gr);
    }
    getGrammarMatches(): Array<GrBase> {
        return this.grMatches;
    }
    getChildren(): {[key:number]:LinkedNode} {
        return this.children;
    }
    getChild(loc: number): LinkedNode {
        return this.children[loc];
    }
    /*
    getDep(loc): Dependency {
        //console.trace('-----------------' + JSON.stringify(Object.keys(this.children[loc])));
        return this.children[loc].dep;
    }*/
    getListOfPos(): Array<string> {
        return Object.keys(this.children);
    }
    getToken(): string {
        return this.nodes.tkn.getToken(this.tknId);
    }
    getTokenId(): number {
        return this.tknId;
    }
    getTokenPOS(): string {
        return this.nodes.tkn.getTokenPOS(this.tknId);
    }
    getPOS(): string {
        return this.getTokenPOS();
        //return this.nodes.tkn.getTokenPOS(this.tknId);
    }
    // this function may be overwritten by inheritance.
    getValues(tagged=false): string {
        let data: Array<string> = [];
        let gr = this.getGrammarMatches();
        //console.log(' getValues called for :' + this.getToken() + ' [' + gr.length + ']');
        if (gr.length) {
            for (let gritm of gr) {
                data.push(gritm.getValues(tagged));
            }
            return data.join(' ');
        } else {
            let children = this.getChildren();
            for (let loc in children) {
                let c = children[loc];
                data.push(c.node.getValues(tagged));
            }
            data.push(this.getToken());
            return '<' + data.join(' ') + '>';
        }
    }
            /*
                    let g = this.getGrammarMatches();
                    if (g.length === 0) {
                        return this.getToken();
                    }
                    // not sure how to handle more than one grammar match
                    let ret = [];
                    let r = '';
                    for (let idx in g) {
                        if (g[idx].getName().match(/(appos|compound)/i)) {
                            r = g[idx].getValues(r);
                        } else {
                            ret.push(g[idx].getValues());
                        }
                    }
                    if (r !== '') {
                        ret.push(r);
                    }
                    return ret.join(',');
                    */


    noOfChildren(): number {
        return Object.keys(this.children).length;
    }

    print(tab: number) {
        tab = (tab === undefined) ? 0 : tab;
        var tg = '';
        for (var i = 0; i < tab; ++i ){
            tg += '\t';
        }
        dbg(tg + 'Node[' + this.name + ']:: List of children[' +
            this.noOfChildren() + ']');
        for (var loc in this.children) {
            this.children[loc].node.print(tab + 1);
        }
    }
    getParent(): LinkedNode {
        return this.parent;
    }
    addParent(node: BaseNode, type: string) {
        this.parent = {node :node, type : type} ;
    }
    addChild(tkn: number, type: string) {
        dbg(this.tabs() + ' BASE:: addChild adding tkn:' + tkn + ' linktype:' + type);
        this.children[tkn] = {
            'type': type,
            'node': this.nodes.process(tkn, this.level + 1),
        };
        this.children[tkn].node.addParent(this, this.children[tkn].type);
    }
    // create the tree of all the nodes that are connected.
    process(tknid: number) {
        let dep = this.nodes.dep;
        let children = dep.getChildNodes(tknid);
        for (let idx in children) {
            let tkn = children[idx].tokenIdx;
            let type = children[idx].type;
            this.addChild(tkn, type);
        }
    }
}

export default BaseNode;

