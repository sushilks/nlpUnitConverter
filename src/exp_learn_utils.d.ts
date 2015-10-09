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
    extract: {[key:string]: string};
    match: any;//{[key:string]: string};
    prop: {singleVerbEdge?: boolean;};
    expExtract?: any; /*{[key:string]: {
        name: string;
        result: {[key:string]: string};
    };
    }*/
}
interface VerbDBMatchRet {
    matchType: string;
    dbId: string;

    matchResult: {
        args: {[keys: string]: string};
        defaultUsed: Array<string>;
        _keys: {[keys: string]: string};
        dbId?: string;
    }
}

interface LearnEntry {
    stmt: string;
    match: {[key: string]: string};
    extract: {[key: string]: string};
    fixedExtract?: {[key: string]: string};
    type: string;
    args: {[key: string]: {type: string, extractionNode: string, default: string|number}};
    prop: {[key: string]: string};
    expExtract?: {[key: string] : string};
}