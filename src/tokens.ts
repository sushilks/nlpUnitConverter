
/// <reference path="common_ifc.ts" />
'use strict';

/**
    * Create a class to hold tokens
    * @class
    * @classdesc Handles tokens.
    *
    */
class Tokens {
    private tokens : Array<TokenType>;
    constructor(tkn: Array<TokenTypeRAW>) {
        let tk: any = tkn;
        for (let idx in tk) {
            tk[idx].CharacterOffsetBegin = parseInt(tk[idx].CharacterOffsetBegin);
            tk[idx].CharacterOffsetEnd = parseInt(tk[idx].CharacterOffsetEnd);
            tk[idx].NER = parseInt(tk[idx].NER);
            tk[idx].$.id = parseInt(tk[idx].$.id);
        }
        // tkn is of type TokenDtType
        this.tokens = tk;
    }
    tokenCount(): number {
        return Object.keys(this.tokens).length;
    }
    getToken(idx: number): string {
        return this.tokens[idx - 1].word;
    }
    getTokenPOS(idx: number): string {
        return this.tokens[idx - 1].POS;
    }
    getTokenNER(idx: number): number {
        return this.tokens[idx - 1].NER;
    }
}

export default Tokens;