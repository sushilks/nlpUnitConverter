'use strict';
declare function require(name:string);
var  Datastore = require('nedb');
var assert = require('assert');


class ExpDB {
    db: any;
    constructor(fileName) {
        this.db = new Datastore({filename: fileName,
            autoload: true});
        assert(1,0);

    }
    insert(doc: string) {
        return new Promise(
            (function(_this, resolve, reject) {
                _this.db.insert(doc, function(err, newDoc) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(newDoc);
                    }
                });
            }).bind(null, this));
    }
    find(pat: any) {
        return new Promise(
            (function(_this, resolve, reject) {
                _this.db.find(pat, function(err, docs) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(docs);
                    }
                });
            }).bind(null, this));
    }
    remove(pat: any) {
        return new Promise(
            (function(_this, resolve, reject) {
                _this.db.remove(pat, {multi:true}, function(err, numRemoved) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(numRemoved);
                    }
                });
            }).bind(null, this));
    }
}

//module.exports = ExpDB;
export default ExpDB;