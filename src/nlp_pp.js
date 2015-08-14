'use strict';

/**
    * A module to parse the raw data returned from the NLP processor
    * The text data is consumed by
    * Usages :
    * var NLPPP = require('./nlp_pp');
    * var pp = new NLPPP();
    * var res = pp.read(nlp_txt);
    */



/**
    * Create a class to hold tokens
    * @class
    * @classdesc Handles tokens.
    *
    */
class Tokens {
    constructor(tkn) {
        this.tokens = tkn;
    }
    tokenCount() {
        return Object.keys(this.tokens).length;
    }
    getToken(idx) {
        return this.tokens[idx - 1].word;
    }
    getTokenPOS(idx) {
        return this.tokens[idx - 1].POS;
    }
    getTokenNER(idx) {
        return this.tokens[idx - 1].NER;
    }
}

/**
    * @class
    * @classdesc Class to hold the dependency info between the tokens
    */
class Dependency {
    constructor(dep, tok) {
        this.dep = dep;
        this.tok = tok;
    }
    getTokens() {
        return this.tok;
    }
    getDepCount() {
        return Object.keys(this.dep).length;
    }
    getTokensCount() {
        return this.tok.tokenCount();
    }
    getRootToken() {
        for (var cidx in this.dep) {
            if (this.dep[cidx].$.type === 'root') {
                return parseInt(this.dep[cidx].dependent.$.idx);
            }
        }
    }
    getChildNodes(tokenIdx) {
        let ret = [];
        for (var cidx in this.dep) {
            if (parseInt(this.dep[cidx].governor.$.idx) === tokenIdx) {
                let r = {};
                r.tokenIdx = parseInt(this.dep[cidx].dependent.$.idx);
                r.type = this.dep[cidx].$.type;
                ret.push(r);
            }
        }
        return ret;
    }
    getParentNodes(tokenIdx) {
        let ret = [];
        for (var cidx in this.dep) {
            if (parseInt(this.dep[cidx].dependent.$.idx) === tokenIdx) {
                let r = {};
                r.tokenIdx = parseInt(this.dep[cidx].governor.$.idx);
                r.type = this.dep[cidx].$.type;
                ret.push(r);
            }
        }
        return ret;
    }
}

/**
    * @class
    * @classdesc Class to process raw text form the NLP processor
    */

class NLPPP {
    constructor() {
        /** @member {Object} */
        this.dt = {};
    }
    /**
    * Reads the raw text into structured data.
    * @function
    */
    read(txt) {
        try {
            this.dt = JSON.parse(txt).document.sentences.sentence;
        } catch(e) {
            return { 'status': false,
                    'err': 'Unable to parse data ERROR:' + e
                };
        }
        return {'status': true};
    }

    /**
    * Returns the number of sentences read.
    * @function
    */
    sentenceCount() {
        if (this.dt.hasOwnProperty('tokens')) {
            return 1;
        } else {
            return Object.keys(this.dt).length;
        }
    }

    /**
    * Returns the stentence pointed to by sentenceId
    * @function
    */
    getSentence(sentenceId) {
        let tkn = this.getTokens(sentenceId);
        var r = '';
        for (var dt = 1; dt <= tkn.tokenCount(); dt = dt + 1) {
            if (dt === 1) {
                r += tkn.getToken(dt);
            } else {
                r += ' ' + tkn.getToken(dt);
            }
        }
        return r;
    }

    /**
    * Get all the tokens for a sentence.
    * Returns the Tokens class
    * @function
    */
    getTokens(sentenceId) {
        if (this.sentenceCount() === 1) {
            return new Tokens(this.dt.tokens.token);
        } else {
            return new Tokens(this.dt[sentenceId].tokens.token);
        }
    }

    /**
    * Get the parse tree for a sentence
    * @function
    */
    getParseTree(sentenceId) {
        if (this.sentenceCount() === 1) {
            return this.dt.parse.trim();
        } else {
            return this.dt[sentenceId].parse.trim();
        }
    }

    /**
    * Get the Dependency information for a sentence
    * mode can be 'basic', 'collapsed', extended',
    * @function
    */
    getSentenceDep(sentenceId, mode = 'extended') {
        let tok = this.getTokens(sentenceId);
        let dep = (this.sentenceCount() === 1) ? this.dt.dependencies :
                                                 this.dt[sentenceId].dependencies;
        let kword = 'collapsed-ccprocessed-dependencies';
        if (mode === 'basic') {
            kword = 'basic-dependencies';
        } else if (mode === 'collapsed') {
            kword = 'collapsed-dependencies';
        }
        for (var dtyp in dep) {
            if (dep[dtyp].$.type === kword) {
                return new Dependency(dep[dtyp].dep, tok);
            }
        }
        throw new Error('unable to find the Dependency requested');
    }

    print() {
        let sent = this.dt;
        console.log(sent);
    }

}

export default NLPPP;