'use strict';

var readline = require('readline');
var Utils = require('./nodes_utils');
var assert = require('assert');

class ExpLearn {
    constructor(db,  gExpMapper) {
        this.db = db;
        this.gExpMapper = gExpMapper;
        this.gExpFn = gExpMapper._map;
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

    readPattern(msg, vlist, learnData, res){
        return new Promise((function(_this, resolve, reject) {
            Utils.getStdin('>> Processing [' + vlist[0] + '] ' + msg, learnData )
            .then(function(line) {
                    res[vlist[0]] = line;
                    vlist.shift();
                    if (vlist.length == 0) {
                        resolve(res);
                    } else {
                        _this.readPattern(msg, vlist, learnData, res)
                        .then(function(rt) {
                                resolve(res);
                            });
                    }
                });
        }).bind(null, this));
    }
    autoExtractMatch(verb, res) {
        console.log("---- > " + JSON.stringify(verb));
        console.log("---- > " + JSON.stringify(res));
        let ekeys = Object.keys(res.extract);

        Object.keys(verb).map(function(verbItem) {
            if(!verbItem.match(/^raw/)) {
                res.match[verbItem] = verb[verbItem];
            }
        });


        Object.keys(res.match).map(function(verbItem) {
            // a verb is found
            let verbDt = res.match[verbItem];
            let originalVerbDt = verbDt;
            //console.log(' item = ' + verbItem + ' = ' + verb[verbItem]);
            let insLocDt = {};
            let found = 0;
            for (let idx = 0; idx < ekeys.length; idx ++) {
                if (ekeys[idx] != '') {
                    let resItem = ekeys[idx];
                    let resVal = res.extract[resItem];
                    //console.log('     resItem = ' + resItem + ' v = ' + resVal);
                    // check for exact match first
                    if (verbDt.toLowerCase() === resVal.toLowerCase()) {
                        //console.log('\t\t Exact match for the verb');
                        res.match[verbItem] = '/^([^> ]*)$/';
                        res.extract[resItem] = verbItem + '[1]';
                        //ekeys.splice(idx, 1); // remove this key
                        ekeys[idx] = '';
                        found = 1;
                        break;
                    } else if (verbDt.toLowerCase().indexOf(resVal.toLowerCase()) !== -1) {
                        // resVal is substring
                        //console.log('\t\t partial match');
                        let oloc = originalVerbDt.toLowerCase().indexOf(resVal.toLowerCase());
                        let midx = verbDt.toLowerCase().indexOf(resVal.toLowerCase());
                        verbDt = verbDt.slice(0, midx) + verbDt.slice(midx + resVal.length);
                        verbDt = verbDt.substr(0, midx) + '([^>]+)' + verbDt.substr(midx);
                        res.match[verbItem] = verbDt;
                        insLocDt[oloc] = {'extractItem' : resItem, 'verbItem' : verbItem}
                        res.extract[resItem] = verbItem + '[' + '??' + ']';
                        ekeys[idx] = '';
                        found = 2;
                    }
                }
            }
            if (found === 0) {
                res.match[verbItem] = '/' + verbDt.toLowerCase() + '/i';
            } else if (found === 2) {
                res.match[verbItem] = '/' + res.match[verbItem] + '/i';
            }
            let tmpKeys = Object.keys(insLocDt).sort();
            let cnt = 1;
            for (let item of tmpKeys) {
                let d = insLocDt[item];
                res.extract[d.extractItem] = d.verbItem + '[' + cnt + ']';
                cnt = cnt + 1;
            }
        });
        //return _this.readPattern('Regexp >', vlist, vres.match);
    }

    learn(stmt, verbMatches, learnData = null) {
        // ask what type of node it is ?
        // enumurate each item of the verb and ask for pattern match
        //console.log('LEARNING '+verbMatches);
        //console.log('LEARNING '+verbMatches.length);
        assert.equal(verbMatches.length,1,'Un-Implemented.' + verbMatches.length);

        return new Promise(
            (function(_this, resolve, reject) {
                let vres = { };
                vres.stmt = stmt;
                vres.match = {};
                vres.extract = {};
                let vlist = [];
                let alist = [];
                let done = false;
                Utils.getStdin('>> Do you want to learn this pattern (Yes/No)>', learnData)
                .then(function(line) {
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
                .then(function(line) {
                        if (done) return false;
                        let nd = _this.gExpFn[line];
                        if (!nd) {
                            console.log('Unable to find definition for node [' + line + ']');
                            reject('invalid Node ' + line);
                            done = true;
                        } else {
                            vres.type = line;
                            alist = nd.getArgs();
                            console.log('Node:[' + line + '] Args Needed :' + JSON.stringify(alist));
                            return _this.readPattern('Select > ', alist, learnData, vres.extract);
                            /*
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
                    })
                /*.then(function(res) {
                        if (done) return false;
                        //console.log('LEARNED ::: ' + JSON.stringify(vres));
                        return _this.readPattern('Select > ', alist, vres.extract);
                    })*/
                .then(function(res) {
                        // at this point we have the
                        // verb and the argument
                        _this.autoExtractMatch(verbMatches[0].dict(), vres)
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
    }

}

module.exports = ExpLearn;