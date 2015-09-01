'use strict';

var  Datastore = require('nedb');


class ExpDB {
    constructor(fileName) {
        this.db = new Datastore({filename: fileName,
            autoload: true});

    }
    insert(doc) {
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
    find(pat) {
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
    remove(pat) {
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

module.exports = ExpDB;