
/**
    * A module to parse the raw data returned from the NLP processor
    * The text data is consumed by
    * Usages :
    * var NLPPP = require('./nlp_pp');
    * var pp = new NLPPP();
    * var res = pp.read(nlp_txt);
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
interface DepType {
    $ : {
        type: string;
    };
    governor: {
        _ : string;
        $ : {
            idx: number;
        }
    };
    dependent: {
        _ : string;
        $ : {
            idx: number;
        }
    };
};
interface ChildNodeList {
    tokenIdx: number,
    type: string
};
