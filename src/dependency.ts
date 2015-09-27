/// <r eference path="common_ifc.ts" />
/// <reference path="dependency.d.ts" />
//'use strict';

// typescript needs the definition.
declare function require(name:string);


/**
    * @class
    * @classdesc Class to hold the dependency info between the tokens
    */
class Dependency {
    private dep: Array<DepType>;
    tok: Tokens;
    constructor(dep : Array<DepType>, tok: Tokens) {
        this.dep = dep;
        this.tok = tok;
    }
    getTokens() : Tokens {
        return this.tok;
    }
    getDepCount(): number {
        return Object.keys(this.dep).length;
    }
    getTokensCount(): number {
        return this.tok.tokenCount();
    }
    getRootToken(): number {
        for (var cidx in this.dep) {
            if (this.dep[cidx].$.type === 'root') {
                //return parseInt(this.dep[cidx].dependent.$.idx);
                return this.dep[cidx].dependent.$.idx;
            }
        }
    }
    getChildNodes(tokenIdx: number): Array<ChildNodeList> {
        let ret = [];
        for (var cidx in this.dep) {
            if (this.dep[cidx].governor.$.idx === tokenIdx) {
                let r: ChildNodeList = {
                    tokenIdx: this.dep[cidx].dependent.$.idx,
                    type: this.dep[cidx].$.type
                    };
                ret.push(r);
            }
        }
        return ret;
    }
    getParentNodes(tokenIdx: number) {
        let ret = [];
        for (var cidx in this.dep) {
            if (this.dep[cidx].dependent.$.idx === tokenIdx) {
                let r: ChildNodeList = {
                    tokenIdx: this.dep[cidx].governor.$.idx,
                    type: this.dep[cidx].$.type
                    }
                ret.push(r);
            }
        }
        return ret;
    }
}

export default Dependency;