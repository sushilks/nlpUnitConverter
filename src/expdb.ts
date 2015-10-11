/// <reference path="../nodejs.d.ts" />
'use strict';
var  Datastore = require('nedb');
var assert = require('assert');


class ExpDB {
    db: any;
    constructor(fileName: string) {
        this.db = new Datastore({filename: fileName,
            autoload: true});
        // assert(1,0);
    }
    async insert(doc: any): Promise<any> {
        return new Promise(
            (function(_this: ExpDB, resolve: (dt:any)=>void, reject: (dt:any)=>void) {
                _this.db.insert(doc, function(err: any, newDoc: any) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(newDoc);
                    }
                });
            }).bind(null, this));
    }
    async find(pat: any): Promise<any> {
        return new Promise(
            (function(_this: ExpDB, resolve: (dt:any)=>void, reject: (dt:any)=>void) {
                _this.db.find(pat, function(err: any, docs: any) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(docs);
                    }
                });
            }).bind(null, this));
    }
    remove(pat: any): Promise<any> {
        return new Promise(
            (function(_this: ExpDB, resolve: (dt:any)=>void, reject: (dt:any)=>void) {
                _this.db.remove(pat, {multi:true}, function(err: any, numRemoved: any) {
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