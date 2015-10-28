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
var dbgae = require('debug')('exp:learn:autoextract');


class ExpLearn {
    db: ExpDB;
    gExpMapper: ExpMapperType;
    gExpFn : {[key: string]: typeof ExpBase};

    constructor(db: ExpDB,  gExpMapper: ExpMapperType) {
        this.db = db;
        this.gExpMapper = gExpMapper;
        this.gExpFn = gExpMapper.fnMap;
    }

    async readPattern(msg: string, vlist: Array<string>, learnData: Array<string>, res:{[key:string]: string}): Promise<{[key:string]: string;}> {
        if (vlist.length === 0) {
            return <{[key:string]: string;}>{};
        } else {
            var line = await Utils.getStdin('>> Processing [' + vlist[0] + '] ' + msg, learnData);
            res[vlist[0]] = <string>line;
            vlist.shift();
            if (vlist.length == 0) {
                return res;
            } else {
                let rt = await this.readPattern(msg, vlist, learnData, res)
                return rt;
            }
        }
    }



    autoExtractMatch(verb: GrProcessNodeValueMap, res: LearnEntry) {
        dbgae("---- > autoExtractMatch::verb " + JSON.stringify(verb));
        dbgae("---- > autoExtractMatch::res " + JSON.stringify(res));
        //dbgae("---- > autoExtractMatch::expMatches " + JSON.stringify(expMatches));

        let ekeys = Object.keys(res.extract);

        /*
        todo:this module has to be redone
        each branch that is followed should be followed fully
        and coorelated with the result.
        right now it's a full search to match of every argument
        it needs to be a changes so that the serch is on a branch and not every branch.
         */
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
                    let extArgs = res.args.input[resItem];
                    // console.log(' == ' + JSON.stringify(res.args));
                    // console.log('     resItem = ' + resItem + ' v = ' + resVal + ' extArgs =' + JSON.stringify(extArgs));
                    // check for exact match first
                    if (!(extArgs.type && 'extractionNode' in extArgs)) {
                        let foundPtr: string;
                        if (extArgs.type && extArgs.type.toLowerCase() === 'list') {
                            foundPtr = LearnUtils.findListInTree(verb, resVal.split(' '));
                        } else {
                            foundPtr = LearnUtils.findInTree(verb, resVal);
                        }
                        dbgae(' For token "' + resVal + '" Found path:' + foundPtr);
                        if (foundPtr) {
                            // if found store the path
                            res.extract[resItem] = foundPtr;
                        } else {
                            // if not found put the exptected entry as hard coded field
                            if (res.fixedExtract === undefined)
                                res.fixedExtract = {};
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
                    let extArgs = res.args.input[resItem];

                    // check for exact match first
                    if (extArgs.type === 'Number' && 'extractionNode' in extArgs) {
                        // if the extraction was for a number
                        // best to take datavalue that covers all the child nodes
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
                // look for sub node
                let eNode= res.extract[k1].split(':')[1];
                // TODO: It would be best to search for the
                // node 'eNode' with some bound's
                // for now just search the whole tree and collect it's
                // compbinded results.
                let expMatchFound = false ;
                console.log(' Looking for ' + eNode);
                let dt = LearnUtils.findExpNodes(verb, eNode);
                console.log(' Found ' + JSON.stringify(dt));
                for (let k2 in dt) {
                    if (!expDep[eNode]) {
                        expDep[eNode] = [];
                    }
                    expDep[eNode].push(dt[k2]);
                    // todo: Picking the first one is not right
                    // some extra checks might help in picking the right one
                    res.extract[k1] = res.extract[k1] + ':' + k2;
                    break;
                }
                /*for (let itm of expMatches) {
                    // console.log(' ---- >>> ' + itm + ' name = ' + itm.name);
                    if (itm.name === eNode) {
                        expMatchFound = true;
                        expDep[eNode] = [itm];
                        break;
                    }
                }*/
                if (expDep[eNode] && expDep[eNode].length > 0) {
                    expMatchFound = true;
                }
                if (!expMatchFound) {
                    assert(0,1);
                }
            }
        }
        res.expExtract = expDep;
        dbgae(' --- > RET = ' + JSON.stringify(res));
        // plug in the remaining fields as match fields
        //    items that are not getting extracted
        LearnUtils.copyMatchTree(verb, res); //<MatchTreeData>res);
        delete res.expExtract;
        dbgae(' RET = ' + JSON.stringify(res));
        //return _this.readPattern('Regexp >', vlist, vres.match);
    }


//    async learn(stmt: string, verbMatches: Array<GrBase>, learnData: Array<string> = null,
    //expMatches: Array<ExpBase>=null): Promise<boolean> {
    async learn(stmt: string, verbMatches: GrProcessNodeValueMap, learnData: Array<string> = null): Promise<boolean> {
        dbg('learn::verbMatches ' + JSON.stringify(verbMatches));
        dbg('learn::learnData ' + JSON.stringify(learnData));
        //dbg('learn::expMatches ' + JSON.stringify(expMatches));
        // ask what type of node it is ?
        // enumurate each item of the verb and ask for pattern match
        //console.log('LEARNING '+verbMatches);
        //console.log('LEARNING '+verbMatches.length);
        //assert.equal(verbMatches.length,1,'Un-Implemented.' + verbMatches.length);

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
                    console.log(' Selecting key = ' + key);
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
                vres.args = nd.getArgs();
                let alistDict = vres.args.input;
                //console.log(' __________ ' + JSON.stringify(alistDict));
                let prop = nd.getProp();
                let alist = Object.keys(alistDict);
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
                await this.readPattern('Select > ', alistNoTags, learnData, vres.extract);
            }
            // at this point we have the
            // verb and the argument
            //this.autoExtractMatch(verbMatches[0].dict(), vres, expMatches)
            this.autoExtractMatch(verbMatches, vres)
            console.log('LEARNED :::' + JSON.stringify(vres));
            let res = await this.db.insert(vres);
            return (res)?true:false;
        } catch(e) {
            console.log("Error :: " + e);
            console.log(e.stack);
            return false;
        };
    }

}

export default ExpLearn;