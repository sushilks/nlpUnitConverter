'use strict';
var Jsnx = require('jsnetworkx');

function nodeAdd_(nmap, d, fn) {
    if (!(d in nmap)) {
        nmap[d] = [];
    }
    nmap[d].push(fn);
}
export function nodeInit(nmap, fn) {
    let dt = fn.getMatchToken();
    if (dt instanceof Array) {
        for (let d of dt) {
            //nmap[d] = fn;
            nodeAdd_(nmap, d, fn);
        }
    } else {
        //nmap[dt] = fn;
        nodeAdd_(nmap, dt, fn);
    }
    return fn;
}

// Check and make sure all the child nodes for the current nodes
// have there grammar processed.
export function checkAndProcessNodeGrammar(nodeList, node) {
    if (!node.isGrammarProcessingDone()) {
        // do grammar processing of the child first
        nodeList.processGr(node.getTokenId());
    }
}

// Check and make sure all the child nodes for the current nodes
// have there grammar processed.
export function checkAndProcessChildNodeGrammar(nodeList, node) {
    for (let loc in node.getChildren()) {
        var c = node.getChild(loc);
        checkAndProcessNodeGrammar(nodeList, c.node);
    }
}
// Check and make sure all the child nodes for the current nodes
// have there grammar processed.
export function checkAndProcessParentNodeGrammar(nodeList, node) {
    let myid = node.getTokenId();
    let p = node.getParent();
    if (p) {
        checkAndProcessNodeGrammar(nodeList, p.node);
        for (let loc in p.node.getChildren()) {
            var c = p.node.getChild(loc);
            if (c.node.getTokenId() != myid) {
                checkAndProcessNodeGrammar(nodeList, c.node);
            }
        }
    }
}

// check if a grammar node is hit
export function findGrammarRules(grMapper, tkn, pos) {
    let r = tkn + ':' + pos;
    let retRules = [];
    for (let k in grMapper) {
        if (r.match(new RegExp('^' + k + '$'))) {
            for (let rule of grMapper[k]) {
                retRules.push(rule);
            }
        }
    }
    return retRules;
}

/** finds if any child link for the given node matches the regex
 *
 * @param {node} nd - Node to search on
 * @param {string} linkType - regex text
 * @returns {Array} - array of token id's that match
 */
export function checkChildLinks(nd, linkType) {
    let resLoc  = [];
    let re = new RegExp('^' + linkType + '$');
    for (let loc in nd.getChildren()) {
        let c = nd.getChild(loc);
        if (c.type.match(re)) {
            resLoc.push(loc);
        }
    }
    return resLoc;
}
/** finds if any child link for the given node matches the regex
 *
 * @param {node} nd - Node to search on
 * @param {string} linkType - regex text
 * @returns {Array} - array of token id's that match
 */
export function getChildLink(nodes, pToken, cToken) {
    let pNode = nodes.getNodeMap(pToken);
    if (!pNode) return '';
    for (let loc in pNode.getChildren()) {
        let c = pNode.getChild(loc);
        if (loc === cToken) {
            return c.type;
        }
    }
    return '';
}

function checkMatchAny_(txt, arr) {
    let re;
    if (Object.prototype.toString.call(txt) === '[object RegExp]') {
        re = txt;
    } else {
        re = new RegExp('^' + txt + '$');
    }
    for (let dt of arr) {
        if (Object.prototype.toString.call(dt) === '[object RegExp]') {
            if (txt.match(dt)) {
                return true;
            }
        } else {
            if (dt.match(re)) {
                return true;
            }
        }
    }
    return false;
}

/** check if itm1, itm2 have matches
 *
 * @param itm1 - can be a string, regex, array of string or regex.
 * @param itm2 - same as itm1 except some combinations are not allowed.
 * @returns {*} - true or false
 */
export function checkMatchAny(itm1, itm2) {
    if (Array.isArray(itm1) && !Array.isArray(itm2)) {
        return checkMatchAny_(itm2, itm1);
    } else if (!Array.isArray(itm1) && Array.isArray(itm2)) {
        return checkMatchAny_(itm1, itm2);
    } else if (!Array.isArray(itm1) && !Array.isArray(itm2)) {
        if (Object.prototype.toString.call(itm1) === '[object RegExp]') {
            return checkMatchAny_(itm1, [itm2]);
        } else {
            return checkMatchAny_(itm2, [itm1]);
        }
    } else {
        for (let dt of itm1) {
            if (checkMatchAny_(dt, itm2)) {
                return true;
            }
        }
        return false;
    }
}

/*

export function checkRegExpMatchArray(re, arr) {
    if (Array.isArray(arr)) {
        for (let dt of arr) {
            if (dt.match(re)) {
                return true;
            }
        }
    } else {
        if (arr.match(re)) {
            return true;
        }
    }
    return false;
}
*/
// check if the node value matched any of the items listend in the array (arr)
export function checkNodeValuesMatchAny(nd, arr, regex=false) {
    if (regex) {
        let v = nd.getValues();
        for (let dt of arr) {
            let r = new RegExp('^' + dt + '$');
            for (let nv of v) {
                if (nv.match(r)) {
                    return true;
                }
            }
        }
        return false;
    } else {
        let v = nd.getValues();
        for (let dt of arr) {
            if (v.indexOf(dt) >= 0) {
                return true;
            }
        }
        return false;
    }
}


const Small = {
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    'eleven': 11,
    'twelve': 12,
    'thirteen': 13,
    'fourteen': 14,
    'fifteen': 15,
    'sixteen': 16,
    'seventeen': 17,
    'eighteen': 18,
    'nineteen': 19,
    'twenty': 20,
    'thirty': 30,
    'forty': 40,
    'fifty': 50,
    'sixty': 60,
    'seventy': 70,
    'eighty': 80,
    'ninety': 90
};
const Magnitude = {
    'thousand':     1000,
    'million':      1000000,
    'billion':      1000000000,
    'trillion':     1000000000000,
    'quadrillion':  1000000000000000,
    'quintillion':  1000000000000000000,
    'sextillion':   1000000000000000000000,
    'septillion':   1000000000000000000000000,
    'octillion':    1000000000000000000000000000,
    'nonillion':    1000000000000000000000000000000,
    'decillion':    1000000000000000000000000000000000,
};
function textToNumberFeach(dt, word) {
    let w = word.toLowerCase().replace(/,/g,'');
    var x = Small[w];
    if (x != null) {
        dt.g = dt.g + x;
    } else if (w.match(/^[ 0-9.]*$/)) {
        let num = parseFloat(w);
        dt.g = dt.g + num;
    } else if (w == "hundred") {
        dt.g = dt.g * 100;
    } else {
        x = Magnitude[w];
        if (x != null) {
            dt.n = dt.n + dt.g * x
            dt.g = 0;
        }
        else {
            console.log("Unknown number: " + w);
        }
    }
}
export function textToNumber(s) {
/*    let num1 = parseFloat(s);
    if (num1) {
        console.log("OUTPUT FLOAT = " + num1);
        //return num1;
    }
    */
    let a = s.toString().split(/[\s-]+/);
    let dt = {};
    dt.n = 0;
    dt.g = 0;
    a.forEach(textToNumberFeach.bind(null,dt));
    let ret = dt.n + dt.g;
    //console.log("OUTPUT FINAL " + dt.n + ' ' +  dt.g + ' = ' + ret);
    return ret;
}


export function createGraph(gr, name, attr) {
    attr.name = name;
    gr[name] = new Jsnx.DiGraph(null, attr);
    console.log('CREATED [' + name + '] = ' + gr[name]);
    return gr[name];
}

