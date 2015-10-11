/// <reference path="dependency.d.ts" />
import Tokens from './tokens';
//'use strict';

// typescript needs the definition.
//declare function require(name:string);


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
            // todo:: over ride <string> because someone is passing a string in tokenIdx
            // have to find and remove <strign>
            if (parseInt(this.dep[cidx].governor.$.idx) === parseInt(<string>tokenIdx)) {
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
            if (parseInt(this.dep[cidx].dependent.$.idx) === parseInt(<string>tokenIdx)) {
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