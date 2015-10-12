/// <reference path="../nodejs.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
//import ExpLearn from "./";
'use strict';

var readline = require('readline');
import * as Utils from './nodes_utils';
import * as LearnUtils from './exp_learn_utils';
import ExpDB from "./expdb";

var assert = require('assert');
var dbg = require('debug')('exp:learn');


async function readPattern(msg: string, vlist: Array<string>, learnData: Array<string>,
                           res: {[key:string]: string;}): Promise<{[key:string]: string;}> {
    if (vlist.length === 0) {
        return <{[key:string]: string;}>{};
    } else {
        var line = await Utils.getStdin('>> Processing [' + vlist[0] + '] ' + msg, learnData);
        res[vlist[0]] = <string>line;
        vlist.shift();
        if (vlist.length == 0) {
            return res;
        } else {
            let rt = await readPattern(msg, vlist, learnData, res);
            return rt;
        }
    }
}


class ExpLearn {
    db: ExpDB;
    gExpMapper: ExpMapperType;
    gExpFn : {[key: string]: typeof ExpBase};

    constructor(db: ExpDB,  gExpMapper: ExpMapperType) {
        this.db = db;
        this.gExpMapper = gExpMapper;
        this.gExpFn = gExpMapper.fnMap;
        /*
        for (var id in this.gExpMapper) {
            let dt = this.gExpMapper[id];
            for(let fn of dt) {
                if (fn.name !== 'ExpBase') {
                    this.gExpFn[fn.getName()] = fn;
                }
            }
        }*/
    }
    /*
    readPattern(msg: string, vlist: Array<string>, learnData: Array<string>, res:{[key:string]: string}){
        return new Promise((function(_this, resolve, reject) {
            if (vlist.length === 0) {
                resolve([]);
            } else {
                Utils.getStdin('>> Processing [' + vlist[0] + '] ' + msg, learnData)
                    .then(function (line) {
                        res[vlist[0]] = line;
                        vlist.shift();
                        if (vlist.length == 0) {
                            resolve(res);
                        } else {
                            _this.readPattern(msg, vlist, learnData, res)
                                .then(function (rt) {
                                    resolve(res);
                                });
                        }
                    });
            }
        }).bind(null, this));
    }*/
    /*
     Searching for val[Kilos] in tree=[object Object]
     FOUND DT= root.verb.data.0.advmod.data.0.dep.token
     -> verb.advmod.dep

     Searching for val[Tons] in tree=[object Object]
     FOUND DT= root.verb.data.1.what.token
     ->verb.what

     Searching for val[30] in tree=[object Object]
     FOUND DT= root.verb.data.1.what.data.0.numnode.token
     ->werb.what.numnode


     Searching for val[30 thousand] in tree=[object Object]
     FOUND DT= root.verb.data.1.what.data.0.numnode.dataValue
     -> verb.what.numnode
     */



    autoExtractMatch(verb: GrProcessNodeValueMap, res: LearnEntry, expMatches: Array<ExpBase>) {
        /*console.log("---- > autoExtractMatch::verb " + JSON.stringify(verb));
        console.log("---- > autoExtractMatch::res " + JSON.stringify(res));
        console.log("---- > autoExtractMatch::expMatches " + JSON.stringify(expMatches));
        */
        let ekeys = Object.keys(res.extract);


        Object.keys(verb).map((function(this_: ExpLearn, verbItem: string) {
            // a verb is found
            //let verbDt = res.match[verbItem];
            //console.log(' item = ' + verbItem + ' = ' + verb[verbItem]);
            let insLocDt = {};
            let found = 0;
            // populate everything other than numbers
            for (let idx = 0; idx < ekeys.length; idx ++) {
                if (ekeys[idx] != '') {
                    let resItem = ekeys[idx];
                    let resVal = res.extract[resItem];
                    let extArgs = res.args[resItem];
                    // console.log('     resItem = ' + resItem + ' v = ' + resVal + ' extArgs =' + JSON.stringify(extArgs));
                    // check for exact match first
                    if (!(extArgs.type && 'extractionNode' in extArgs)) {
                        let foundPtr: string;
                        if (extArgs.type && extArgs.type.toLowerCase() === 'list') {
                            foundPtr = LearnUtils.findListInTree(verb, resVal.split(' '));
                        } else {
                            foundPtr = LearnUtils.findInTree(verb, resVal);
                        }
                        if (foundPtr) {
                            res.extract[resItem] = foundPtr;
                        } else {
                            if (res.fixedExtract === undefined)
                                res.fixedExtract = {}
                            res.fixedExtract[resItem] = res.extract[resItem];
                            delete res.extract[resItem];
                        }
                    }
                }
            }

            // populate the numbers
            for (let idx = 0; idx < ekeys.length; idx ++) {
                if (ekeys[idx] != '') {
                    let resItem = ekeys[idx];
                    let resVal = res.extract[resItem];
                    let extArgs = res.args[resItem];

                    // check for exact match first
                    if (extArgs.type === 'Number' && 'extractionNode' in extArgs) {
                        let keyLoc = extArgs.extractionNode;
                        let key = res.extract[keyLoc].split('.');
                        key.pop();
                        let keyStr = key.join('.') + '.numnode.dataValue';
                        //console.log(' --- ' + resItem + ' => ' + keyLoc + ' => ' +  res.extract[keyLoc] + ' => ' + key);
                        res.extract[resItem] = keyStr;
                    } else if (extArgs.type  && 'extractionNode' in extArgs) {
                        let nodetype = extArgs.extractionNode;
                        res.extract[resItem] = 'EXPNODE:' + nodetype;
                        //assert(0,1);
                    }
                }
            }

        }).bind(null, this));

        let expDep: {[key: string] : Array<ExpBase>};
        expDep = <{[key: string] : Array<ExpBase>}> {};
        for (let k1 in res.extract) {
            if (res.extract[k1].match(/^EXPNODE/)) {
                let eNode= res.extract[k1].split(':')[1];
                let expMatchFound = false ;
                for (let itm of expMatches) {
                    // console.log(' ---- >>> ' + itm + ' name = ' + itm.name);
                    if (itm.name === eNode) {
                        expMatchFound = true;
                        expDep[eNode] = [itm];
                        break;
                    }
                }
                if (!expMatchFound) {
                    assert(0,1);
                }
            }
        }
        res.expExtract = expDep;
        // console.log(' --- > RET = ' + JSON.stringify(res));
        LearnUtils.copyMatchTree(verb, <MatchTreeData>res);
        delete res.expExtract;
        //console.log(' RET = ' + JSON.stringify(res));
        //return _this.readPattern('Regexp >', vlist, vres.match);
    }

//    learn(stmt: string, verbMatches: Array<GrBase>, learnData: Array<string> = null, expMatches: Array<string>=null) {
    async learn(stmt: string, verbMatches: Array<GrBase>, learnData: Array<string> = null,
          expMatches: Array<ExpBase>=null): Promise<boolean> {
        //console.log('learn::verbMatches ' + JSON.stringify(Object.keys(verbMatches[0])));
        //console.log('learn::learnData' + JSON.stringify(learnData));
        //console.log('learn::expMatches ' + JSON.stringify(expMatches));
        // ask what type of node it is ?
        // enumurate each item of the verb and ask for pattern match
        //console.log('LEARNING '+verbMatches);
        //console.log('LEARNING '+verbMatches.length);
        assert.equal(verbMatches.length,1,'Un-Implemented.' + verbMatches.length);

        try {
            let vres:LearnEntry = {
                stmt: stmt,
                match: {},
                extract: {},
                type: null,
                args: null,
                prop: null
            };
            let line = await Utils.getStdin('>> Do you want to learn this pattern (Yes/No)>', learnData);
            if (line.match(/no/i)) {
                console.log('OK Will skip.')
                return false;
            } else if (line.match(/yes/i)) {
                let k = Object.keys(this.gExpFn);
                line = await Utils.getStdin('>> Select Node type (' + k + ')? ', learnData);
            } else {
                console.error('invalid answer [' + line + ']');
                return false;
            }

            let nd:typeof ExpBase;
            for (let key in this.gExpFn) {
                if (key.toLowerCase() === line.toLowerCase()) {
                    nd = this.gExpFn[key];
                    line = key;
                    break;
                }
            }
            if (!nd) {
                console.log('Unable to find definition for node [' + line + ']');
                console.error('invalid Node ' + line);
                return false;
            } else {
                vres.type = line;
                let alistDict = nd.getArgs();
                let prop = nd.getProp();
                let alist = Object.keys(alistDict);
                vres.args = alistDict;
                let alistNoTags: Array<string> = [];
                {
                    for (let k of alist) {
                        //let kl = k.split(':');
                        if ('extractionNode' in alistDict[k] && 'type' in alistDict[k]) {
                            vres.extract[k] = alistDict[k].type + ':' + alistDict[k].extractionNode;
                            // }
                            //if (kl.length === 2 && kl[0] === 'Number' && alist.indexOf(kl[1])!== -1) {
                            //    vres.extract[k] = 'insert-extracted-NUM';
                        } else {
                            alistNoTags.push(k);
                        }
                    }
                    if (prop !== undefined && prop != {}) {
                        vres.prop = prop;
                    }
                }
                //console.log('Node:[' + line + '] Args Needed :' + JSON.stringify(alist));
                await readPattern('Select > ', alistNoTags, learnData, vres.extract);
                /*
                 let vlist = [];

                 Object.keys(verbMatches[0].dict()).map(function(item) {
                 if(!item.match(/^raw/)) {
                 vlist.push(item);
                 }
                 });
                 return _this.readPattern('Regexp >', vlist, vres.match);
                 */
                //return Utils.getStdin('>> Processing [' + vlist[0] + '] Regex >' )
                //resolve(null);
            }
//            let alist = [];

            //.then(function(res) {
            //        if (done) return false;
            //        //console.log('LEARNED ::: ' + JSON.stringify(vres));
            //        return _this.readPattern('Select > ', alist, vres.extract);
            //    })
            // at this point we have the
            // verb and the argument
            this.autoExtractMatch(verbMatches[0].dict(), vres, expMatches)
            console.log('LEARNED :::' + JSON.stringify(vres));
            let res = await this.db.insert(vres);
            return (res)?true:false;
        } catch(e) {
            console.log("Error :: " + e);
            console.log(e.stack);
            return false;
        };


        /*
        return new Promise(
            (function(_this, resolve, reject) {
                let vres: LearnEntry = {
                    stmt: stmt,
                    match: {},
                    extract: {},
                    type: null,
                    args: null,
                    prop: null
                };
                let vlist = [];
                let alist = [];
                let done = false;
                Utils.getStdin('>> Do you want to learn this pattern (Yes/No)>', learnData)
                .then(function(line: string) {
                        if (line.match(/no/i)) {
                            console.log('OK Will skip.')
                            resolve(null);
                            done = true;
                        } else if (line.match(/yes/i)) {
                            let k = Object.keys(_this.gExpFn);
                            return Utils.getStdin('>> Select Node type (' + k + ')? ', learnData);
                        } else {
                            reject('invalid answer [' + line + ']')
                            done = true;
                        }
                    })
                .then(function(line: string) {
                        if (done) return false;
                        let nd;
                        for (let key in _this.gExpFn) {
                            if ( key.toLowerCase() === line.toLowerCase()) {
                                nd = _this.gExpFn[key];
                                line = key;
                                break;
                            }
                        }
                        if (!nd) {
                            console.log('Unable to find definition for node [' + line + ']');
                            reject('invalid Node ' + line);
                            done = true;
                        } else {
                            vres.type = line;
                            let alistDict = nd.getArgs();
                            let prop = nd.getProp();
                            let alist = Object.keys(alistDict);
                            vres.args = alistDict;
                            let alistNoTags = [];
                            {
                                for (let k of alist) {
                                    //let kl = k.split(':');
                                    if ('extractionNode' in alistDict[k] && 'type' in alistDict[k]) {
                                        vres.extract[k] = alistDict[k].type + ':' + alistDict[k].extractionNode;
                                   // }
                                    //if (kl.length === 2 && kl[0] === 'Number' && alist.indexOf(kl[1])!== -1) {
                                    //    vres.extract[k] = 'insert-extracted-NUM';
                                    } else {
                                        alistNoTags.push(k)
                                    }
                                }
                                if (prop !== undefined && prop != {}) {
                                    vres.prop = prop;
                                }
                            }
                            //console.log('Node:[' + line + '] Args Needed :' + JSON.stringify(alist));
                            return readPattern('Select > ', alistNoTags, learnData, vres.extract);
                             //Object.keys(verbMatches[0].dict()).map(function(item) {
                             //if(!item.match(/^raw/)) {
                             //vlist.push(item);
                            // }
                            // });
                            // return _this.readPattern('Regexp >', vlist, vres.match);
                            //return Utils.getStdin('>> Processing [' + vlist[0] + '] Regex >' )
                            //resolve(null);
                        }
                    })
                //.then(function(res) {
                //        if (done) return false;
                //        //console.log('LEARNED ::: ' + JSON.stringify(vres));
                //        return _this.readPattern('Select > ', alist, vres.extract);
                //    })
                .then(function(res) {
                        // at this point we have the
                        // verb and the argument
                        _this.autoExtractMatch(verbMatches[0].dict(), vres, expMatches)
                        if (done) return false;
                        console.log('LEARNED :::' + JSON.stringify(vres));
                        return _this.db.insert(vres);
                        //return true;
                    })
                .then(function(res) {
                        if (done) return false;
                        resolve(res);
                    })
                    .catch(function(e) {
                        console.log("Error :: " + e);
                        console.log(e.stack);
                    });

            }).bind(null, this));
*/
    }

}

export default ExpLearn;