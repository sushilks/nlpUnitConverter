/// <re ference path="tokens.d.ts" />
/**
    * @class
    * @classdesc Class to hold the dependency info between the tokens
    */

interface DepType {
    $ : {
        type: string;
    };
    governor: {
        _ : string;
        $ : {
            idx: number;
        }
    };
    dependent: {
        _ : string;
        $ : {
            idx: number;
        }
    };
}
interface ChildNodeList {
    tokenIdx: number,
    type: string
}
interface LinkedNode {
    type: string;
    node: any;
//    node: BaseNode;
}
/*
declare class Dependency2 {
    private dep;
    tok: Tokens;
    constructor(dep: Array<DepType>, tok: Tokens);
    getTokens(): Tokens;
    getDepCount(): number;
    getTokensCount(): number;
    getRootToken(): number;
    getChildNodes(tokenIdx: number): Array<ChildNodeList>;
    getParentNodes(tokenIdx: number): any[];
}
*/