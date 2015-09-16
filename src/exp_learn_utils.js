'use strict';

var readline = require('readline');
var Utils = require('./nodes_utils');
var assert = require('assert');
var dbg = require('debug')('exp:learn:util');
var sep = '.';

function treePathNormalize(r) {
    return r.replace(/\.\d+\./g, '.')
        .replace(/data\./g, '')
        .replace(/^root./, '');
}
function findInTreeMatch(dt,val) {
    if (!(Array.isArray(val))) {
        return (String(dt).match(val));
    }
    if (!(dt)) return false;
    //console.log(' => DT = ' + dt + ' val = ' + val);
    let dtArr = dt.split(' ');
    if (dtArr.length !== val.length) {
        return false;
    }
    for (let idx in dtArr) {
        if(val.indexOf(dtArr[idx]) === -1)
            return false;
    }
    return true;
}

function findInTree_(tree, val, key) {
    let treeType = Object.prototype.toString.call(tree);
    dbg(' findInTree_ Called for:' + key + ' tree=' + tree + ' type='+treeType);
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

        let ret = findInTree_(tree.dataValue, val, key + '.dataValue');
        if (ret) { return ret; }
        // dictionary
        for (let k of k1) {
            if (k !== 'tokenId' && (!k.match(/dataValue/))) {
                let ret = findInTree_(tree[k], val, key + '.' + k)
                if (ret) {
                    return ret;
                }
            }
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
export function findInTree(tree, val) {
    dbg(' Searching for val[' + val + '] in tree=' + tree);
    let r;
    if (val.indexOf(' ') === -1) {
        r = findInTree_(tree, new RegExp('^' + val + '$', 'i'), 'root');
    } else {
        r = findInTree_(tree, val.split(' '), 'root');
    }
//        let r = findInTree_(tree, val , 'root');;
//        console.log('\tFOUND DT= ' + r);
    if (r) {
        let dt = treePathNormalize(r);
        //console.log('\t\t' + dt);
        return dt;
    }
    return;
}

function copyMatchTree_(extracted, tree, key) {
    let treeType = Object.prototype.toString.call(tree);
    dbg(' copyMatchTree_ Called for:' + key + ' tree=' + tree + ' type='+treeType);
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
            let ret = copyMatchTree_(extracted, tree[k], key + '.' + k)
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
        let k = key.replace(/^./,'');
        if (k.match(/token$/)) {
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
export function copyMatchTree(verb, dest) {
    dbg('\tcopyMatchTree INPUT Verb::' + JSON.stringify(verb));
    dbg('\tcopyMatchTree INPUT Dest::' + JSON.stringify(dest.extract));
    let extracted = [];
    for (let key in  dest.extract) {
        let d = dest.extract[key].replace(/dataValue$/,'*').replace(/\.token$/, '$');
        extracted.push(new RegExp(d));
    }
    dbg('\t\t EXTract = ' + JSON.stringify(extracted));
    let vmatch = [];
    copyMatchTree_(vmatch, verb, '');
    dbg('\t\t vmatch = ' + JSON.stringify(vmatch));
    for (let vm of vmatch) {
        let match = false;
        for (let ex of extracted) {
            if (vm.match(ex)) {
                dbg('matched   vm=' + vm + ' ex=' + ex);
                match= true;
            }
        }
        if (!match) {
            dbg('no-matched vm=' + vm + ' value:' + extractTreeValue(verb, vm + '.token'));
            // database does not allow '.' as KEY, replacing all '.' with '__'
            dest.match[vm.replace(/\./g, '__')] = extractTreeValue(verb, vm + '.token');
        }
    }
}
function extractTreeValue_(tree, key) {
    if (key.length == 0) {
        return tree;
    }
    let treeType = Object.prototype.toString.call(tree);
    //console.log(' extractTreeValue_ Called for:' + key.join('.') + ' tree=' + tree + ' type='+treeType);
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
        if (k1.indexOf(key[0]) === -1) {
            if (k1.indexOf('data') === -1) {
                return;
            }
            return extractTreeValue_(tree.data, key);
        }
        let k2 = key.shift();
        return extractTreeValue_(tree[k2], key);
    }
}
// tree = tree created by nlp
// key is a specific key pointing to data in the tree
// some variability exist in the key such that array inex etc are serarched.

export function extractTreeValue(tree, key) {
    //console.log ('extractTreeeValue-1 key=' + key );
    let k = key.split('.');
    let r = extractTreeValue_(tree, k);
    dbg('extractTreeeValue-2 key=' + key + ' retVal = ' + JSON.stringify(r));
    return r;
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
export function verbDBMatch(dbgdb, verb, dbItem) {
    // check if all the keys in dbItem are present in verb.

    let dbItemKeys = Object.keys(dbItem.match);
    let verbKeys = Object.keys(verb);
    let reMatches = {};
    dbgdb('verb is ::: ' + JSON.stringify(verb));
    dbgdb('db is ::: ' + JSON.stringify(dbItem));
    // extract all the items from the verb
    let tmatch = {extract:dbItem.extract,match:{}};
    copyMatchTree(verb, tmatch);
    dbgdb(' Extracted Match:::' + JSON.stringify(tmatch));
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
        if (tmatch.match[key].toLowerCase() !== dbItem.match[key].toLowerCase()) {
            match = false;
            break;
        }
    }
    if (!match) {
        return ['', {}];
    }
    let res = {};
    for (let itm of Object.keys(dbItem.extract)) {
        let itmPath = dbItem.extract[itm];
        let dt = extractTreeValue(verb, itmPath);
        let dtArgs = dbItem.args;
        //console.log(' dtArgs = ' + JSON.stringify(dtArgs) + ' itm = ' + itm);
        if ('type' in dtArgs[itm] && dtArgs[itm].type.toLowerCase() === 'list') {
            dt = dt.split(' ');
        }
        res[itm] = dt;
        dbgdb(' extracting itm ' + itm + ' path=' + itmPath + ' got val:' + res[itm]);
    }

    return [dbItem.type, res, dbItem._id];

    try {

        for (let key of dbItemKeys) {
            if (key.match(/_id/)) {
                continue;
            }
            if (verbKeys.indexOf(key) === -1) {
                //dbgdb('Key [' + key + '] is missing in verb ')
                //dbgdb(dbItemKeys + '::::' + verbKeys);
                return ['', {}];
            }
            let r = dbItem.match[key].match(/^\/([^\/]*)\/(\S*)$/);
            reMatches[key] = verb.match.vb[key].match(new RegExp(r[1], r[2]));
            //console.log(key + ' <1>::' + verb.match.vb[key] + ' <2>::' + dbItem.match[key] + '  <3>::' + reMatches[key]);
            if (!reMatches[key]) {
                //dbgdb(' Match failed for key[' + key + '] verb[' + verb.match.vb[key] + '] db[' + dbItem.match[key] + ']  ' + reMatches[key]);
                return ['', {}];
            } else {
                //console.log('MATCH on [' + key + '] = ' + JSON.stringify(reMatches[key]));
            }
        }
        // all nodes are matching
        //dbgdb('MATCHED on db entry for db : ' + JSON.stringify(dbItem));
        let res = {};
        for (let itm of Object.keys(dbItem.extract)) {
            //dbgdb('   ext : ' + itm + ' : ' + dbItem.extract[itm] + ' : ');
            let r = dbItem.extract[itm].match(/^(\S+)\[([0-9]+)\]$/);
            if (r) {
                //dbgdb(' ARRAY LOG :' + r[1] + ' idx:' + r[2]);
                //dbgdb(' extract : ' + reMatches[r[1]][r[2]]);
                res[itm] = reMatches[r[1]][r[2]];
            } else {
                //dbgdb(' VALUE : ' + dbItem.extract[itm]);
                res[itm] = dbItem.extract[itm];
            }
        }
        //dbgdb(' RESULT[' + dbItem.type + '] = ' + JSON.stringify(res));
        return [dbItem.type, res, dbItem._id];
    } catch (e) {
        // Error
        if (e.message)
            console.log(' ERR Message:' + e.message);
        if (e.stack)
            console.log('  Err STACK: ' + e.stack);
        console.log(e);
        return ['', {}];
    }
}
