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

    readPattern(msg, vlist, res){
        return new Promise((function(_this, resolve, reject) {
            Utils.getStdin('>> Processing [' + vlist[0] + '] ' + msg )
            .then(function(line) {
                    res[vlist[0]] = line;
                    vlist.shift();
                    if (vlist.length == 0) {
                        resolve(res);
                    } else {
                        _this.readPattern(msg, vlist, res)
                        .then(function(rt) {
                                resolve(res);
                            });
                    }
                });
        }).bind(null, this));
    }


    learn(stmt, verbMatches) {
        // ask what type of node it is ?
        // enumurate each item of the verb and ask for pattern match
        //console.log('LEARNING '+verbMatches);
        //console.log('LEARNING '+verbMatches.length);
        assert.equal(verbMatches.length,1,'Un-Implemented.' + verbMatches.length);

        console.log('this = ' + this);
        return new Promise(
            (function(_this, resolve, reject) {
                console.log('this =  ' + this);
                let vres = { };
                vres.stmt = stmt;
                vres.match = {};
                vres.extract = {};
                let vlist = [];
                let alist = [];
                let done = false;
                Utils.getStdin('>> Do you want to learn this pattern (Yes/No)>')
                .then(function(line) {
                        if (line.match(/no/i)) {
                            console.log('OK Will skip.')
                            resolve(null);
                            done = true;
                        } else if (line.match(/yes/i)) {
                            let k = Object.keys(_this.gExpFn);
                            return Utils.getStdin('>> Select Node type (' + k + ')? ');
                        } else {
                            reject('invalid answer [' + line + ']')
                            done = true;
                        }
                    })
                .then(function(line) {
                        if (done) return false;
                        let nd = _this.gExpFn[line];
                        if (!nd) {
                            console.log('Unable to find defination for node [' + line + ']');
                            reject('invalid Node ' + line);
                            done = true;
                        } else {
                            vres.type = line;
                            alist = nd.getArgs();
                            console.log('Node:[' + line + '] Args Needed :' + JSON.stringify(alist));
                            Object.keys(verbMatches[0].dict()).map(function(item) {
                                if(!item.match(/^raw/)) {
                                    vlist.push(item);
                                }
                            });
                            return _this.readPattern('Regexp >', vlist, vres.match);
                            //return Utils.getStdin('>> Processing [' + vlist[0] + '] Regex >' )
                            //resolve(null);
                        }
                    })
                .then(function(res) {
                        if (done) return false;
                        //console.log('LEARNED ::: ' + JSON.stringify(vres));
                        return _this.readPattern('Select > ', alist, vres.extract);
                    })
                .then(function(res) {
                        if (done) return false;
                        console.log('LEARNED :::' + JSON.stringify(vres));
                        return _this.db.insert(vres);
                    })
                .then(function(res) {
                        if (done) return false;
                        resolve(res);
                    })
            }).bind(null, this));
    }

}

module.exports = ExpLearn;