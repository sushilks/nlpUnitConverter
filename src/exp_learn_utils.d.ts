/// <reference path="exp_match.d.ts" />

/*
 ["fromArg",
 {"fromArgValue":1,
  "fromArg":"Units",
  "defaultUsed":["fromArgValue"],
  "_keys":{"fromArgValue":"verb.subj.numnode.dataValue","fromArg":"verb.subj.token"}},
 "SABEmrRhE7Rg7uNn"]
*/

//{"extract":{"nodeFrom":"EXPNODE:fromArg",
// "nodeTo":"EXPNODE:toArg"},
// "match":{},
// "prop":null,
// "expExtract":{"fromArg":
//                 {"name":"fromArg","result":{"fromArgValue":1,"fromArg":"cents"}},
//              "toArg":{"name":"toArg","result":{"toArgValue":1,"toArg":"dollar"}}
// }}
interface MatchTreeData {
    extract: {[key: string]: string};
    match: {[key: string]: string | Array<string>};
    prop: {singleVerbEdge?: boolean;};
    expExtract?: {[key: string]: Array<{name: string, result: ExpMatch}>;}
}
/*
interface ExpMatch {
    args: {[key: string]: {
        listStr?: Array<string>;
        listExp?: Array<ExpMatch>;
    }};
    defaultUsed?: Array<string>;//{[idx: number]: string};
    _keys?: {[key: string]: string};
    dbId?: string;
}*/
/*
 //args: {[key: string]: string | Array<string> | Array<ExpBaseMatch>};
// use ExpBaseMatch
interface MatchResults {
    args: {[keys: string]: string | Array<string> | Array<ExpBaseMatch>;};
    defaultUsed: Array<string>;
    _keys: {[keys: string]: string};
    dbId?: string;
}
*/
interface VerbDBMatchRet {
    matchType: string;
    dbId: string;
    matchResult: ExpMatch;
}

interface LearnEntry {
    stmt: string;
    match: {[key: string]: string};
    extract: {[key: string]: string};
    fixedExtract?: {[key: string]: string};
    type: string;
    args: ExpArgType;
    prop: ExpPropType;
    expExtract?: {[key: string] : Array<ExpBase>};
}