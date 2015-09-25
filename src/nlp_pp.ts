'use strict';
//declare function require(name:string);

//var Tokens = require('./tokens');
//var Dependency = require('./dependency');
import Tokens from './tokens';
import Dependency from './dependency';


/**
    * @class
    * @classdesc Class to process raw text form the NLP processor
    */

class NLPPP {
     dt: any;
    constructor() {
        /** @member {Object} */
        this.dt = {};
    }
    /**
    * Reads the raw text into structured data.
    * @function
    */
    read(txt: string) : {status: boolean, err: string} {
        try {
            this.dt = JSON.parse(txt).document.sentences.sentence;
        } catch(e) {
            return { 'status': false,
                    'err': 'Unable to parse data ERROR:' + e
                };
        }
        return {'status': true, err: null};
    }

    /**
    * Returns the number of sentences read.
    * @function
    */
    sentenceCount(): number {
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
    getSentence(sentenceId: number): string {
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
    getTokens(sentenceId: number): Tokens {
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
    getParseTree(sentenceId: number): string {
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
    getSentenceDep(sentenceId: number, mode: string = 'extended'): Dependency {
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