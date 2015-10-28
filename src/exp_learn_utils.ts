/// <reference path="../nodejs.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="nodes.d.ts" />
/// <reference path="exp_learn_utils.d.ts" />

'use strict';
var readline = require('readline');
var assert = require('assert');
import ExpDB from './expdb';
import ExpMatch from './exp_match';
import * as Utils from './nodes_utils';
var dbg = require('debug')('exp:learn:util');
var dbgcm = require('debug')('exp:learn:util:cmatch');
var debug = require('debug');
var sep = '.';
function checkExpArgValid(ematch: ExpMatch, key: string): boolean {
    let a = ematch.args[key];
    if (a.listStr === undefined && a.listExp === undefined)
        return false;
    let t1 = false;
    let t2 = false;
    if (a.listStr && a.listStr.length !=0)
        t1 = (a.listStr[0] !== undefined);
    if (a.listExp && a.listExp.length != 0)
        t2 = (a.listExp[0] !== undefined);
    if (!(t1 || t2)) return false;
    return true;
}

function treePathNormalize(r: string): string {
    return r.replace(/\.\d+\./g, '.')
        .replace(/data\./g, '');
        //.replace(/^root./, '');
}
function findInTreeMatch(dt: string|Array<string>, val: RegExp|Array<string>): boolean {
    if (!(Array.isArray(val))) {
        return (String(dt).match(val))? true: false;
    }
    if (!(dt)) return false;
    var valArr: Array<string> = (<Array<string>> val);
        //console.log(' => DT = ' + dt + ' val = ' + val);
    let dtArr = (<string>dt).split(' ');
    if (dtArr.length !== valArr.length) {
        return false;
    }
    for (let idx in dtArr) {
        if(valArr.indexOf(dtArr[idx]) === -1)
            return false;
    }
    return true;
}

function findInTree_(tree: any, val: RegExp, key: string): string {
    let treeType = Object.prototype.toString.call(tree);
    // dbg(' findInTree_ Called for:' + key + ' tree=' + tree + ' type='+treeType);
    if (treeType === '[object Array]') {
        // array
        for (let idx in tree) {
            let ret = findInTree_(tree[idx], val, key + '.' + idx);
            if (ret) {
                return ret;
            }
        }
        return ;
    } else if (treeType === '[object Object]') {
        let k1 = Object.keys(tree);
        let numnode = (key.split('.').slice(-1)[0] === 'numnode');

        // if numnode give priroity to
        if (numnode) {
            let ret = findInTree_(tree.dataValue, val, key + '.dataValue');
            if (ret) { return ret; }
        }

        // dictionary
        for (let k of k1) {
            if (k !== 'tokenId' && (!k.match(/dataValue/))) {
                let ret = findInTree_(tree[k], val, (key === '') ? k : key + '.' + k)
                if (ret) {
                    return ret;
                }
            }
        }
        if (!numnode) {
            let ret = findInTree_(tree.dataValue, val, key + '.dataValue');
            if (ret) { return ret; }
        }
        return ;
    } else if (findInTreeMatch(tree, val)){
        dbg('MATCHED AT ' + key);
        return key;
    } else {
        //dbg(' CHECKED tree = ' + tree + '  val = ' + val);
        return;
    }
}

// search and Find a specific value in the tree
// returns the full path of where the value was found
// value is string
export function findInTree(tree: any, val: string): string {
    dbg(' Searching for val[' + val + '] in tree=' + tree);
    let r = findInTree_(tree, new RegExp('^' + val + '$', 'i'), '');
    if (r) {
        let dt = treePathNormalize(r);
        return dt;
    }
    return;
}

function findListInTree_(tree: any, val: Array<string>, key: string): string {
    let treeType = Object.prototype.toString.call(tree);
    dbg(' findListInTree_ Called for:' + key + ' tree=' + tree + ' type='+treeType);
    if (treeType === '[object Array]') {
        // array
        for (let idx in tree) {
            let ret = findListInTree_(tree[idx], val, key + '.' + idx);
            if (ret) {
                return ret;
            }
        }
        return ;
    } else if (treeType === '[object Object]') {
        let k1 = Object.keys(tree);
        let numnode = (key.split('.').slice(-1)[0] === 'numnode');
        // if numnode give priroity to
        if (numnode) {
            let ret = findListInTree_(tree.dataValue, val, key + '.dataValue');
            if (ret) {
                return ret;
            }
        }

        // dictionary
        for (let k of k1) {
            if (k !== 'tokenId' && (!k.match(/dataValue/))) {
                if (k === 'token') {
                    // check if there are any appos in the list
                    //collect data value for all of those and pull back into list
                    let list = [tree.token];
                    for (let cNode of tree.data) {
                        if (cNode.appos) {
                            let dt = cNode.appos.dataValue;
                            // console.log(' dt = ' + dt);
                            list = list.concat(dt.split(' '));
                        }
                    }
                    let match = true;
                    //console.log(' MATCH len=' + val.length + ' list.len = ' + list.length +
                    //    ' val = ' + JSON.stringify(val) + ' data = ' + JSON.stringify(list));

                    if (list.length === val.length) {
                        for (let itm of list) {
                            if (val.indexOf(itm) === -1 ) {
                                match = false;
                                break;
                            }
                        }
                    } else {
                        match = false;
                    }
                    if (match)
                      return key + '.dataList';
                }

                let ret = findListInTree_(tree[k], val, (key === '') ? k : key + '.' + k)
                if (ret) {
                    return ret;
                }
            }
        }
        if (!numnode) {
            let ret = findListInTree_(tree.dataValue, val, key + '.dataValue');
            if (ret) {
                return ret;
            }
        }
        return;
    } else if (findInTreeMatch(tree, val)){
        dbg('MATCHED AT ' + key);
        return key;
    } else {
        return;
    }
}


// search and Find a specific list of values in the tree
// returns the full path of where the value was found
// value is string
export function findListInTree(tree: any, val: Array<string>): string {
    dbg(' Searching for val[' + JSON.stringify(val) + '] in tree=' + tree);
    let r = findListInTree_(tree, val, '');
    if (r) {
        let dt = treePathNormalize(r);
        return dt;
    }
    return;
}

function copyMatchTree_(extracted: Array<string>, tree: any, key: string): string {
    let treeType = Object.prototype.toString.call(tree);
    //dbg(' copyMatchTree_ Called for:' + key + ' tree=' + tree + ' type='+treeType);
    if (treeType === '[object Array]') {
// array
        for (let idx in tree) {
            let ret = copyMatchTree_(extracted, tree[idx], key + '.' + idx);
            if (ret) {
                return ret;
            }
        }
        return ;
    } else if (treeType === '[object Object]') {
        let k1 = Object.keys(tree);
// dictionary
        for (let k of k1) {
            let ret = copyMatchTree_(extracted, tree[k], (key === '') ? k : key + '.' + k)
            if (ret) {
                return ret;
            }
        }
        return ;
    } else if (String(tree).match(/foof/)){
//console.log('MATCHED AT ' + key);
        return key;
    } else {
//console.log(' CHECKED tree = ' + tree + '  val = ' + val);
        let k = key.replace(/^\./,'');
        if (k.match(/token$/) && k !== 'root.token') {
            //console.log('END for :' + k + ' [' + treePathNormalize(k) + ']');
            let r = treePathNormalize(k).split('.');
            r.pop();
            extracted.push(r.join('.'));
        }
        return;
    }

}

// Copy all the fields from the verb that are not in the extract list
// as match criteria
// dest.extract has all the fields for extraction.
// all the other fields that are not there will be used for matching.

/*
 verb::{"verb":
 {"tokenId":"4","token":"are",
 "data":[{"advmod":{"tokenId":"1","token":"How","data":[{"dep":{"tokenId":"3","token":"meteres","data":[],"dataValue":"<many> meteres","dataValueTagged":"dep::<<many> meteres>"}}],"dataValue":"<many> meteres How","dataValueTagged":"advmod::<dep::<<many> meteres> How>"}},{"nmod:in":{"tokenId":"8","token":"mile","data":[],"dataValue":"<in> <a> mile","dataValueTagged":"nmod:in::<<in> <a> mile>"}}],"dataValue":"<many> meteres How <there> <in> <a> mile are","dataValueTagged":"VerbBase::<advmod::<dep::<<many> meteres> How> <there> nmod:in::<<in> <a> mile> are>"}}
 */

export function copyMatchTree(verb: GrProcessNodeValueMap, dest: MatchTreeData) {
    dbgcm('\tcopyMatchTree INPUT Verb::' + JSON.stringify(verb));
    dbgcm('\tcopyMatchTree INPUT Dest::' + JSON.stringify(dest.extract));
    let extracted: Array<RegExp> = [];
    let extractedStr: Array<string> = [];
    let expPathPrefixList: {[key: string]: string} = {};
    for (let key in  dest.extract) {
        let d = dest.extract[key].replace(/dataValue$/,'*').replace(/\.token$/, '');
        extracted.push(new RegExp(d + '$'));
        extractedStr.push('^' + dest.extract[key].replace(/dataValue$/,'*').replace(/\.token$/, ''));
        if (dest.extract[key].match(/^EXPNODE:/)) {
            let k1 = dest.extract[key].split(':');
            k1.shift();
            let expType = k1.shift();
            expPathPrefixList[expType] = treePathNormalize(k1.join(':'));
        }
    }
    if (dest.expExtract) {
        dbgcm('\tcopyMatchTree expExtract= ' + JSON.stringify(dest.expExtract));
        for (let key_ in  dest.expExtract) {
            let k = dest.expExtract[key_][0].result._keys;
            for (let key in k) {
                let prefix = expPathPrefixList[key_];
                let dt = (prefix) ? prefix + '.' + k[key] : k[key];
                let d = dt.replace(/dataValue$/, '*').replace(/\.token$/, '');
                extracted.push(new RegExp(d + '$'));
                extractedStr.push('^' + d);
            }
        }
    }


    dbgcm('\tFields EXTract = ' + JSON.stringify(extractedStr));
    let vmatch: Array<string> = [];
    copyMatchTree_(vmatch, verb, '');
    dbgcm('\tAll Match Targets = ' + JSON.stringify(vmatch));
    let singleVerbEdge = false;
    if (dest.prop && dest.prop.singleVerbEdge) singleVerbEdge = true;

    let branchStart: string = ''; // should be just one
    let branchEnd: Array<string> = []; // can be many
    if (singleVerbEdge) {
        // extract the start nodes
        for (let ex of extractedStr) {
            if (ex.length < branchStart.length || branchStart === '')
                branchStart = ex; // start is the minimum size path.
        }
        branchStart = branchStart.replace('^','');
        // extract the end nodes
        for (let ex_ of extractedStr) {
            let ex = ex_.replace('^','');
            if (ex === branchStart) continue;
            // end should include start
            if (ex.indexOf(branchStart) === -1) continue;
            // check all the existing end's
            //   if one of them is sub set then this can replace that one.
            let found = false;
            for (let idx in branchEnd) {
                if (ex.indexOf(branchEnd[idx]) === 0) {
                    branchEnd[idx] = ex;
                    found = true;
                    break;
                } else if (branchEnd[idx].indexOf(ex) === 0) {
                    // ex is already covered by current branchEnd item
                    found = true;
                    break;
                }
            }
            if (!found)
                branchEnd.push(ex);
        }
        dbgcm('\tBranchStart :' + branchStart);
        dbgcm('\tBranchEnd :' + JSON.stringify(branchEnd));
    }

    for (let vm of vmatch) {
        let match = false;
        for (let ex of extracted) {
            if (vm.match(ex)) {
                dbgcm('\tExclude Targed  [vm=' + vm + '] it Matched Extract Field =[' + ex + ']');
                match= true;
            }
        }
        // hack together an exclusion for dataList
        for (let ex of extractedStr) {
            let e1 = ex.split('.').slice(-1)[0];
            if (e1.match(/dataList/)) {
                let e2 = ex.split('.');
                e2.pop();
                let e2Str = e2.join('.');
                if (vm.match(new RegExp(e2Str + '$')) ||
                    vm.match(new RegExp(e2Str + '.appos(.(appos|compound))*$')) // this is a bit hacky
                ) {
                    match = true;
                }
            }
        }

            //vm = ["verb.obj","verb.obj.nmod:to",
        // "verb.obj.nmod:to.numnode","verb","verb.subj","verb.subj.numnode"]
        //EXTract = ["^verb.obj.numnode.*","^verb.obj"]
        //1. common branch = verb.obj;
        //2. filter all the VM out for command
        //        //vm = ["verb.obj","verb.obj.nmod:to","verb.obj.nmod:to.numnode"]
        //3. compare all the entries
        //   match = ["verb.obj.nmod:to","verb.obj.nmod:to.numnode"]

        // TODO: minbr approach change
        // find the starting point in the branch
        // and the ending point in the branch ..
        // Ignore any thing that is higher than the starting point
        // Ignore any thing that is not in the same branch
        // Only match on things that are in the branch and and lower than
        // the starting point.



        // minBr - minimum branch or the edge
        // along which we want to match when 'singleVerbEdge is set
        //
        // no match means that this is not being extracted
        // single verb edge indicates its just an edge match which will be partial
        if (!match && singleVerbEdge) {

            let ignoreTarget = false;
            // if the targe is before the start
            if (vm.length < branchStart.length)
                ignoreTarget = true;
            // if the target is not on the branch
            if (vm.indexOf(branchStart) !== 0)
                ignoreTarget = true;
            // check if the target is in one of the expected branches
            for (let idx in branchEnd) {
                if (branchEnd[idx].indexOf(vm) === -1) {
                    ignoreTarget = true;
                    break;
                }
            }
            dbgcm('vm = ' + vm + ' ignoreTarge = ' + ignoreTarget);
            match = ignoreTarget;
            /*
            // extract the comm branch
            let minBrArr: Array<string> = [];
            for (let ex of extractedStr) {
                if (ex.split('.').length < minBrArr.length || minBrArr.length === 0) {
                    minBrArr = ex.split('.');
                }
            }
            let minBr = minBrArr.join('.');
            let minBrm1: string; // drop one of the last legs of extraction
            if (minBrArr.length > 1) {
                minBrm1 = minBrArr.slice(0, -1).join('.');
                let s = minBrArr[minBrArr.length-2];
                if (s.match(/subj|nmod/)) {
                    //if (!s.match(/verb/)) {
                    minBrm1 = 'NOMATCH';
                }
            }
            dbgcm('\t\tminBR = ' + minBr + '[' + minBrm1 + '] vm = ' + vm );
            // min BRanch has the extraction path
            // minBrm1 has one level less ...
            //  i.e. minBR = ^verb:cop.nmod:to[^verb:cop]
            if (vm.match(new RegExp(minBrm1 + '$')) ) {
                // accept this a an match
                // vm = 'verb:cop' , minBr = '^verb:cob.nmod:to', minBrm1 = '^verb:cob'
            } else if (vm.match(new RegExp(minBrm1 + '.cop$'))) {
                // accept this a an match
                // vm = 'verb:cop.cop' , minBr = '^verb:cob.nmod:to', minBrm1 = '^verb:cob'
            } else if (!vm.match(new RegExp(minBr))) {
                match = true;
            } else if (vm.match(new RegExp(minBr + '.subj')) ||
                    vm.match(new RegExp(minBr + '.obj'))
            ){
                match = true;
            } else if (vm.match(new RegExp(minBr + '.nmod.*'))) {
                match  = true;
            } else {
                for (let ex of extractedStr) {
                    let m1 = vm.match(new RegExp(ex + '$'));
                    if (m1) match = true;
                    //console.log(' ======================== vm = ' + vm + ' ex=' + ex + ' m=' + m1 );
                }
            }*/
        }
        //console.log('Match = ' + match + ' for = ' + vm);
        if (!match) {
            dbgcm('\tKeep Match Target [vm=' + vm + '] value:' + extractTreeValue(verb, vm + '.token'));
            // database does not allow '.' as KEY, replacing all '.' with '__'
            let v = extractTreeValue(verb, vm + '.token');
            assert.notEqual(v, undefined, ' match data should ve extracted correctly, got undefined instead for key[' + vm + ']');
            dest.match[vm.replace(/\./g, '__')] = v;
        }
    }

    // find the part from BranchStart that will be removed from all the extracted + match nodes
    if (singleVerbEdge) {
        let ba = branchStart.split('.');
        // use the last part of the aray for tag
        // i.e. 'verb:root.subj.nmod:in' whould use 'nmod:in'
        let branch_ = ba.pop(); // last element
        let branch = ba.join('.');
        // the reminder should be removed form the match/extract
        let lMatch: any = {};
        for (let k in dest.match) {
            let v = dest.match[k];
            let lk = k.replace(branch,'');
            lMatch[lk] = v;
        }
        dest.match = lMatch;
        // remove from extract
        for (let k in dest.extract) {
            let v = dest.extract[k];
            dest.extract[k] = v.replace(branch,'');
        }
    }



    }
function extractTreeValue_(tree: any, key: Array<string>): string | Array<string> {
    if (key.length == 0) {
        return tree;
    }
    let treeType = Object.prototype.toString.call(tree);
    //console.log(' extractTreeValue_ Called for:' + key.join('.') + ' tree=' + tree +
    // ' type='+treeType + ' keys=' +JSON.stringify(Object.keys(tree)));
    if (treeType === '[object Array]') {
        // array
        for (let idx in tree) {
            let ret = extractTreeValue_(tree[idx], key);
            if (ret) {
                return ret;
            }
        }
        return ;
    } else if (treeType === '[object Object]') {
        let k1 = Object.keys(tree);
        //console.log(' k1 = ' + k1 + ' KEY = ' + key);
        if (key[0].match(/dataList/)) {
            // put list primitiv here ...
            let e: Array<string> = [];
            e.push(tree.token)
            for (let dNode of tree.data) {
                if (dNode.appos) {
                    e = e.concat(dNode.appos.dataValue.split(' '));
                }
            }
            // console.log('extract key=' + JSON.stringify(key)+ ' v = ' + e);
            return e;
        } else if (k1.indexOf(key[0]) === -1) {
            if (k1.indexOf('data') === -1) {
                return;
            }
            //console.log(' GOING into key = ' + key[0]+ '.data ');
            return extractTreeValue_(tree.data, key);
        }
        //console.log(' GOING into key = ' + k2);
        return extractTreeValue_(tree[key[0]], key.slice(1));
    }
}
// tree = tree created by nlp
// key is a specific key pointing to data in the tree
// some variability exist in the key such that array inex etc are serarched.

export function extractTreeValue(tree: any, key: string): string | Array<string>  {
    //console.log ('extractTreeeValue-1 key=' + key );
    //console.log ('extractTreeeValue-1 tree=' + JSON.stringify(tree) );
    let k = key.split('.');
    let r = extractTreeValue_(tree, k);
    //console.log('extractTreeeValue-2 key=' + key + ' retVal = ' + JSON.stringify(r));
    dbg('\t\t\textractTreeeValue key=' + key + ' retVal = ' + JSON.stringify(r));
    return r;
}


function findExpNodes_(tree: any, expType: string, key:string, res: {[key: string]: ExpBase}): void {
    let treeType = Object.prototype.toString.call(tree);
    //console.log(' extractTreeValue_ Called for:' + key.join('.') + ' tree=' + tree +
    // ' type='+treeType + ' keys=' +JSON.stringify(Object.keys(tree)));
    if (treeType === '[object Array]') {
        // array
        for (let idx in tree) {
            findExpNodes_(tree[idx], expType, key, res);
        }
    } else if (treeType === '[object Object]') {
        //let k1 = Object.keys(tree);
        //console.log(' k1 = ' + k1 + ' KEY = ' + key);
        for (var k1 in tree) {
            if (k1.match(/partialExp/)) {
                for (let pe of tree[k1]) {
                    let exp = pe.exp;
                    if (pe.exp.name === expType) {
                        res[key] = pe.exp;
                    }
                }
            } else if (k1.match(/dataValue/) || k1.match(/token/)) {

            } else {
                let dt;
                if (key === '') {
                  dt = k1;
                } else {
                    dt = key + '.' + k1;
                }
                findExpNodes_(tree[k1], expType, dt, res);
            }
        }
    }
    return ;
}
// tree = tree created by nlp
// key is a specific key pointing to data in the tree
// some variability exist in the key such that array inex etc are serarched.

export function findExpNodes(tree: any, expType: string): {[key: string]: ExpBase}  {
    //console.log ('extractTreeeValue-1 key=' + key );
    //console.log ('extractTreeeValue-1 tree=' + JSON.stringify(tree) );
    let res: {[key: string]: ExpBase} = {};
    let key = '';
    findExpNodes_(tree, expType, key, res);
    //console.log('extractTreeeValue-2 key=' + key + ' retVal = ' + JSON.stringify(r));
    dbg('\t\t\t findExpNode type=' + expType + ' retVal = ' + JSON.stringify(res));
    return res;
}

/*
function findInTreeNumberNode_(tree, key) {
    if (key.length == 0) {
        // iterate through all the data nodes
        // find one that is numnode.
        if (!('data' in tree)) {
            return;
        }
        for (let itm of tree.data) {
            if ('numnode' in itm) {
                console.log('FOUND ----------------- ' + itm.numnode.dataValue);
                return itm.numnode.dataValue;
            }
        }
        return tree;
    }
    let treeType = Object.prototype.toString.call(tree);
    console.log(' findInTreeNumberNode_ Called for:' + key.join('.') + ' tree=' + tree + ' type='+treeType);
    if (treeType === '[object Array]') {
        // array
        for (let idx in tree) {
            let ret = findInTreeNumberNode_(tree[idx], key);
            if (ret) {
                return ret;
            }
        }
        return ;
    } else if (treeType === '[object Object]') {
        let k1 = Object.keys(tree);
        if (k1.indexOf(key[0]) === -1) {
            if (k1.indexOf('data') === -1) {
                return;
            }
            return findInTreeNumberNode_(tree.data, key);
        }
        let k2 = key.shift();
        return findInTreeNumberNode_(tree[k2], key);
    }
}

// Find if there is a number node associated with the path
// return the value in the number node
export function findInTreeNumberNode(tree, key) {
    //console.log ('extractTreeeValue-1 key=' + key );
    let k = key.split('.');
    let r = findInTreeNumberNode_(tree, k);
    dbg('findInTreeNumberNode-2 key=' + key + ' retVal = ' + r);
    return r;
}
*/
export function verbDBMatch(dbgdb, verb: GrProcessNodeValueMap, expMatches: Array<ExpBase>, dbItem: DBItem) : VerbDBMatchRet {
//    export function verbDBMatch(dbgdb: typeof debug, verb: GrProcessNodeValueMap, expMatches: Array<ExpBase>, dbItem: DBItem) : VerbDBMatchRet {
    // check if all the keys in dbItem are present in verb.

    let dbItemKeys = Object.keys(dbItem.match);
    let verbKeys = Object.keys(verb);
    let reMatches = {};
    dbgdb('verb is ::: ' + JSON.stringify(verb));
    dbgdb('db is ::: ' + JSON.stringify(dbItem));
    dbgdb('-------------------------> exp is ::: ' + JSON.stringify(Object.keys(expMatches)));
    // Gather all the extracts that are using EXP nodes
    let expDep: {[key: string]: Array<ExpBase>;} = {};
    // let extPathList = [];
    for (let k1 in dbItem.extract) {
        if (dbItem.extract[k1].match(/^EXPNODE/)) {
            let ipa = dbItem.extract[k1].split(':');
            let eNode= ipa[1];
            let expMatchFound = false ;
            let expMatchList = findExpNodes(verb, eNode);
            ipa.shift();
            ipa.shift();
            for (let k2 in expMatchList) {
                    if (k2 === ipa.join(':')) {
                        if (!expDep[eNode]) {
                            expDep[eNode] = [];
                        }
                        //console.log(' =========== pushing key = ' + eNode + ' k2 = ' + k2 + ' path = ' + JSON.stringify(expMatchList[k2]));
                        expDep[eNode].push(expMatchList[k2]);
                        expMatchFound = true;
                    }
            }
            /*
            for (let itm of expMatches) {
                if (itm.name === eNode) {
                    expMatchFound = true;
                    //console.log(' EXPDEP[' + eNode +'];;;');
                    if (!expDep[eNode]) {
                        expDep[eNode] = [];
                    }
                    expDep[eNode].push(itm);
                    ///extPathList.push(itm.result._keys[eNode]);
                    //break;
                }
            }*/
            if (!expMatchFound) {
                // if any of the exp node is not yet parsed no point going further
                //return ['', {}];
                return {matchType:'', dbId:'', matchResult:null };
            }
        }
    }
    //console.log(' -00- ::' + JSON.stringify(expDep));

    //dbgdb('-------------------------> exp is ::: ' + JSON.stringify(Object.keys(expMatches[0])));
    // extract all the items from the verb
    let tmatch: MatchTreeData = {extract:dbItem.extract,match:{}, prop:dbItem.prop, expExtract:expDep};
    //dbgdb(' Before copyMatchTree: ' + JSON.stringify(tmatch));
    copyMatchTree(verb, tmatch);
    dbgdb(' Extracted Match:::' + JSON.stringify(tmatch));
    //console.log(' Extracted Match:::' + JSON.stringify(tmatch));
    let groupKey = Object.keys(tmatch.match).concat(Object.keys(dbItem.match));
    // remove duplicate keys
    let uniqueKey = groupKey.filter(function(elem, pos) {
        return groupKey.indexOf(elem) == pos;
    });
    let match = true;
    for (let key of uniqueKey) {
        dbgdb(' Looking for key=' + key);
        if ( (!(key in tmatch.match)) || (!(key in dbItem.match))) {
            match = false;
            break;
        }
        dbgdb(' Comparing [' + tmatch.match[key] + '] to [' + dbItem.match[key] +']');
        if ((<string>tmatch.match[key]).toLowerCase() !== dbItem.match[key].toLowerCase()) {
            match = false;
            break;
        }
    }
    if (!match) {
        return {matchType:'', dbId:'', matchResult:null };//return ['', {}];
    }

    //let res = {};
    //let resKey = {};
    let res : VerbDBMatchRet = {
        matchType: '',
        dbId: '',
        matchResult: new ExpMatch()
    };
    // console.log('dbItem.extract ' + JSON.stringify(dbItem.extract));
    // console.log('==== ::expDep ' + JSON.stringify(expDep));
    for (let itm of Object.keys(dbItem.extract)) {
        let itmPath = dbItem.extract[itm];
        if (itmPath.match(/^EXPNODE:/)) {
            // console.log(' EXPNODE:::' + itmPath + ' expDep::: ' + Object.keys(expDep));
            let ipa = itmPath.split(':');
            let k = ipa[1];
            //console.log(' k = ' + k + ' -- ' + JSON.stringify(expDep[k]));
            let dt: Array<ExpMatch>  = [];
            for (let itm of expDep[k])
                dt.push(itm.result);
            //res.matchResult.args[itm]= {listExp: dt};
            res.matchResult.setArgExp(itm, dt);
        } else {
            let dt = extractTreeValue(verb, itmPath);
            res.matchResult.setArgStr(itm, dt);
        }
        //let dtArgs = dbItem.args;
        //if ('type' in dtArgs[itm] && dtArgs[itm].type.toLowerCase() === 'list') {
        //            dt = dt.split(' ');
        //        }
        //res.matchResult._keys[itm] = itmPath;
        res.matchResult.setArgPath(itm, itmPath);
        //res[itm] = dt;
        //resKey[itm] = itmPath;
        dbgdb(' extracting itm ' + itm + ' path=' + itmPath + ' got val:' + JSON.stringify(res.matchResult.args[itm]));
        //console.log(' extracting itm ' + itm + ' path=' + itmPath + ' got val:' + JSON.stringify(res.matchResult.args[itm]));
    }
    // have found a match
    // check for argument being presented in extracted data
    for (let key in dbItem.args.input) {
        let schema = dbItem.args.input[key];
        let res_valid = res.matchResult.isArgValid(key);
        if (!res_valid && dbItem.fixedExtract !== undefined && dbItem.fixedExtract[key] !== undefined) {
            dbgdb(' ---> SCHEMA : key = ' + key + ' filedextract = ' + dbItem.fixedExtract[key] );
            //res.matchResult.args.input[key] = {listStr: [dbItem.fixedExtract[key]]};
            res.matchResult.setArgStr(key, dbItem.fixedExtract[key]);
            res.matchResult.setArgPath(key, key);
            //res.matchResult._keys[key] = key;
            //res[key] = dbItem.fixedExtract[key];
            //resKey[key] = key;
        }
        res_valid = res.matchResult.isArgValid(key);
        if (schema.default === undefined && !res_valid) {
            dbgdb(' Failed on schema validation key[' + key + '] missing in match [' + JSON.stringify(res) + '].');
            return {matchType:'', dbId:'', matchResult:null };//return ['', {}];
        } else if (schema.default !== undefined && !res_valid) {
            //console.log(' res = '  + JSON.stringify(res));
            //res.matchResult.args.input[key] = {listStr: [<string>schema.default]};
            res.matchResult.setArgStr(key, <string>schema.default);
            // console.log(" DEFAULT USED ==== " + key)
            res.matchResult.defaultUsed.push(key);
        }
    }
    res.dbId = dbItem._id;
    res.matchType = dbItem.type;
    //res['_keys'] = resKey;
    dbgdb(' -----> verbDBMatch::RESULT = ' + JSON.stringify([dbItem.type, res, dbItem._id]));
    //console.log(' -----> verbDBMatch::RESULT = ' + JSON.stringify([dbItem.type, res, dbItem._id]));
    return res; //[dbItem.type, res, dbItem._id];

}
