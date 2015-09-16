/**
 * Created by sushil on 8/15/15.
 */
'use strict';
import { install } from 'source-map-support';
install();

var NLPPP = require('./../src/nlp_pp');
var Nodes = require('./../src/nodes.js');
var ExpDB = require('../src/expdb');
let expDB = new ExpDB('./lexp.db');

export function parse(data, grMatch, dict = false, exp = false,  dbg = false) {
    var pp = new NLPPP();
    var res = pp.read(data.body);
    //let rt = pp.getSentenceDep(0).getRootToken();
    //console.log('Processing :: ' + pp.getSentence(0));
    let nd = new Nodes(pp.getSentenceDep(0), dbg);
    nd.processAllGrammar();
    res = [];
    if (!exp) {
        for (let idx in nd.grMatches) {
            if (false) {
                console.log('\t Grammar IDX = ' + idx + ' :: GR Type [' + nd.grMatches[idx].getName()
                    + '] Matched Text  ::' + nd.grMatches[idx].text());
            }
            if (nd.grMatches[idx].getName().match(grMatch)) {
                if (dict) {
                    res.push(nd.grMatches[idx].dict());
                } else {
                    res.push(nd.grMatches[idx].text());
                }
            }
        }
        return res;
    } else {
        nd.processAllExp();
        return new Promise(
            function(resolve, reject) {
                nd.processAllExpDB(expDB)
                    .then(function (dt) {
                        for (let idx in nd.expMatches) {
                            if (false) {
                                console.log('\t Expresive IDX = ' + idx + ' :: Exp Type [' + nd.expMatches[idx].getName()
                                    + '] Matched Text  ::' + nd.expMatches[idx].text());
                            }
                            res.push(nd.expMatches[idx].text());
                        }
                        resolve(res);
                    }).catch(function(e) {
                        console.log("Error :: " + e);
                        console.log(e.stack);

                    });;
            });
    }
}


export function process(client, txt, grMatch, dict = false, exp = false, dbg = false) {
    return new Promise(
        function(resolve, reject) {
            client.req(txt).then(function(res) {
                return parse(res, grMatch, dict, exp, dbg);
            }, function(err) {
                reject(err);
            }).then(function(res) {
                resolve(res);
            }, function(err) {
                console.log('ERROR when processing request :: ' + err.stack);
            }).catch(function(e) {
                console.log("Error :: " + e);
                console.log(e.stack);

            });;
        });
}
export function processExp(client, txt, dbg = false) {
    return process(client, txt, '', false,  true);
}
export function processGrDict(client, txt, grMatch, dbg = false) {
    return process(client, txt, grMatch, true);
}
export function processGr(client, txt, grMatch, dbg = false) {
    return process(client, txt, grMatch);
}
