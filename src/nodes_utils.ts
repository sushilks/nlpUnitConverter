/// <reference path="nodes.d.ts" />
/// <reference path="nodes_utils.d.ts" />
/// <reference path="../nodejs.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
import Nodes from './nodes';
import * as assert from 'assert';

//'use strict';

function nodeAdd_(nmap: {[key: string]: Array<any>}, d: string, fn: any) {
    if (!(d in nmap)) {
        nmap[d] = [];
    }
    nmap[d].push(fn);
}
export function nodeInit(nmap: NodeMapperType, fn: typeof BaseNode) {
    let dt = fn.getMatchToken();
/*
    if (!('_map' in nmap)) {
        nmap['_map'] = {};
    }
    if ('getName' in fn) {
        nmap._map[fn.getName()] = fn;
    }
    */
    //nmap[dt] = fn;
    nmap[dt] = fn;
    //nodeAdd_(nmap, dt, fn);
    return fn;
}
export function nodeInitExp(nmap: ExpMapperType, fn: typeof ExpBase) {
    let dt = fn.getMatchToken();
    //if (!('_map' in nmap)) {
    //    nmap['_map'] = {};
   // }
    if ('getName' in fn) {
        nmap.fnMap[fn.getName()] = fn;
    }
    if (dt instanceof Array) {
        for (let d of dt) {
            //nmap[d] = fn;
            nodeAdd_(nmap.match, d, fn);
        }
    } else {
        //nmap[dt] = fn;
        assert.equal(0, 1);
  //        console.log(' dt = ' + JSON.stringify(dt));
  //      nodeAdd_(nmap.match, dt, fn);
    }
    return fn;
}

export function nodeInitGr(nmap: GrMapperType, fn: typeof GrBase) {
    let dt: GrMatchTokenType = fn.getMatchToken();
    for (let key in dt) {
        let d = dt[key];
        if (!(d.name in nmap)) {
            nmap[d.name] = [];
        }
        nmap[d.name].push({fn:fn, match:d});
    }
    return fn;
}

// Make sure the  node is precessed for grammar
// and then get the value of the node.
export function getNodeValues(nodeList: Nodes, tknId: number) {
    let nd = nodeList.getNodeMap(tknId);
    //checkAndProcessNodeGrammar(nodeList, nd);
    return nd.getValues();
}

export function normalizeUnit(dt: string): string {
    let r = dt.toLowerCase();
    r = r.replace(/shes$/,'sh')
        .replace(/ches$/,'ch')
        .replace(/xes$/,'x')
        .replace(/zes$/,'z')
        .replace(/s$/,'');
    return r;
}

// Check and make sure all the child nodes for the current nodes
// have there grammar processed.
//export function checkAndProcessNodeGrammar(nodeList: Nodes, node: BaseNode) {
//    if (!node.isGrammarProcessingDone()) {
//        // do grammar processing of the child first
//        nodeList.processGr(node.getTokenId());
//    }
//}
/*
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
*/
// check if a grammar node is hit
//export function findGrammarRules(grMapper, tkn, pos) {
export function findGrammarRules(grMapper: GrMapperType, fromNode: BaseNode, linkType: string, toNode: BaseNode): Array<FindGrammarRetTypeDt> {
//    let r = tkn + ':' + pos;
    let fromNodePOS: string = '';
    if (fromNode) {
        fromNodePOS = fromNode.getPOS();
    }
    let toNodePOS = toNode.getPOS();
    let retRules: Array<FindGrammarRetTypeDt> = [];
    for (let k in grMapper) {
        for (let gr of grMapper[k]) {
            let found = true;
            let cnt = 0;
            let attachType = 'normal';
            if (Object.prototype.toString.call(gr.match) !== '[object Object]') {
                continue;
            }
            //console.log(' \t\t gr.match =' + JSON.stringify(gr.match));
            if ('edge' in gr.match) {
                if (!(linkType.match(new RegExp('^' + gr.match.edge + '$')))) {
                    found = false;
                    continue;
                }
                cnt ++;
            }
            if ('toPOS' in gr.match) {
                if (!(toNodePOS.match(new RegExp('^' + gr.match.toPOS + '$')))) {
                    found = false;
                    continue
                }
                cnt ++;
            }
            if ('fromPOS' in gr.match) {
                if (!(fromNodePOS.match(new RegExp('^' + gr.match.fromPOS + '$')))) {
                    found = false;
                    continue
                }
                cnt ++;
            }
            if ('applyToParent' in gr.match) {
                attachType = 'parent';
            }
            if (cnt !== 0) {
                retRules.push({fn:gr.fn, attachType:attachType});
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
export function checkChildLinks(nd: BaseNode, linkType: string): Array<number> {
    let resLoc: Array<number>  = [];
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
export function getChildLink(nodes: Nodes, pToken: number, cToken: number) {
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

function checkMatchAny_(txt: any, arr: any): boolean {
    let re: string | RegExp;
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
export function checkMatchAny(itm1: any, itm2: any): boolean {
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

export function kMatch(dict: {[key: string]: any}, key: string, re: string|RegExp) {
    if (key in dict && dict[key]) {
        return dict[key].match(re);
    }
    return undefined;
}

// check if the node value matched any of the items listend in the array (arr)
export function checkNodeValuesMatchAny(nd: BaseNode, arr: Array<any>, regex=false): boolean {
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


const Small: {[key:string]: number} = {
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
const Magnitude: {[key:string]: number} = {
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
function textToNumberFeach(dt: {n: number, g: number}, word: string) {
    let w = word.toLowerCase().replace(/,/g,'');
    let x: number = Small[w];
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
export function textToNumber(s : string): number {
/*    let num1 = parseFloat(s);
    if (num1) {
        console.log("OUTPUT FLOAT = " + num1);
        //return num1;
    }
    */
    let a = s.toString().split(/[\s-]+/);
    let dt = {n :0, g:0};

    a.forEach(textToNumberFeach.bind(null,dt));
    let ret = dt.n + dt.g;
    //console.log("OUTPUT FINAL " + dt.n + ' ' +  dt.g + ' = ' + ret);
    return ret;
}

export function getStdin(prompt: string, cannedData: Array<string>): Promise<string> {
    process.stdout.write(prompt);
    return new Promise(function(resolve, reject) {
        var input: string = '';
        if (cannedData && cannedData.length > 0) {
            let dt: string = cannedData.shift();
            process.stdout.write(dt + '\n');
            resolve(dt);
        } else {
            process.stdin.resume();
            process.stdin.setEncoding('utf8');
            var f1 = function(chunk: string): void {
                input += chunk;
                if (chunk.indexOf('\n') != 1) { //(theyPressedEnter(chunk)) {
                    input = input.replace(/\n/g, '');
                    process.stdin.pause();
                    resolve(input);
                    process.stdin.removeListener('data', f1);
                }
            };
            process.stdin.on('data', f1);
        }
    });
}



