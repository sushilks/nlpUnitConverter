/**
    * Create a class to hold tokens
    * @class
    * @classdesc Handles tokens.
    *
    */
interface TokenTypeRAW {
    word: string;
    lemma: string;
    CharacterOffsetBegin: string;
    CharacterOffsetEnd: string;
    POS: string;
    NER: string;
    Speaker: string;
    $ : {
        id: string
    };
}
interface TokenType {
    word: string;
    lemma: string;
    CharacterOffsetBegin: number;
    CharacterOffsetEnd: number;
    POS: string;
    NER: number;
    Speaker: string;
    $ : {
        id: number
    };
}
declare class Tokens {
    private tokens;
    constructor(tkn: Array<TokenTypeRAW>);
    tokenCount(): number;
    getToken(idx: number): string;
    getTokenPOS(idx: number): string;
    getTokenNER(idx: number): number;
}
