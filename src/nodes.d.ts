/// <reference path="nodes_pos/base_node.d.ts" />
/// <reference path="nodes_exp/base_exp.d.ts" />
/// <reference path="dependency.d.ts" />
/// <reference path="tokens.d.ts" />

interface GrTree {
    tokenId: number;
    pos: string;
    type: string;
    getNode: ()=>BaseNode;
    children:{[key:number]: GrTree};
}
interface GrTreeTop {
    root: GrTree;
    processedTokens: Array<number>;
}
interface GrMapperType {
    [key:string]: Array<{fn:typeof GrBase, match:GrMatchTokenTypeItem}>;
}
interface NodeMapperType {
    [key:string]: typeof BaseNode;
}
interface ExpMapperType {
    fnMap : {[key: string]: typeof ExpBase};
    match: {[key:string]: Array<typeof ExpBase>};
}

interface DBItem {
    stmt: string;
    type: string;
    _id : string;
    match: {[key: string]: string};
    extract: {[key: string]: string};
    args: {[key: string]: {
        type: string;
        extractionNode: string;
        default: string | number;
        }
    };
    prop: {
        singleVerbEdge: boolean;
    };
    fixedExtract: {[key: string]: string};
}


declare class Nodes {
    dep: Dependency;
    tknNodeMap: {
        [key: number]: BaseNode;
    };
    rootToken: number;
    tkn: Tokens;
    nd: BaseNode;
    grMatches: Array<GrBase>;
    expMatches: Array<ExpBase>;
    constructor(dep: Dependency);
    static getGlobalExpMapper(): {
        [key: string]: Array<typeof ExpBase>;
    };
    getTokens(): Tokens;
    setNodeMap(tknId: number, node: BaseNode): void;
    getNodeMap(tknId: number): BaseNode;
    process(tknId: number, level: number): BaseNode;
    processAllExpDB_(verb: any, db: any, graphDB: any, mHistory: any, resolve: any): void;
    processAllExpDB(db: any, graphDB: any): Promise<{}>;
    processAllExp(): void;
    populateGrammarTree(treeTop: GrTreeTop, grTree: GrTree, tokenId: number, type: any, followChildren?: boolean): GrTree;
    processAllGrammar(): void;
    processNodeGrammar(nd: BaseNode): void;
    processGr(tknId: number): boolean;
    }
