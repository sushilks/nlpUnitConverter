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
    grMatches: Array<GrBase>;
    expMatches: Array<ExpBase>;
    private dep;
    private tknNodeMap;
    private rootToken;
    private tkn;
    private nd;
    constructor(dep: Dependency);
    static getGlobalExpMapper(): ExpMapperType;
    getTokens(): Tokens;
    setNodeMap(tknId: number, node: BaseNode): void;
    getNodeMap(tknId: number): BaseNode;
    process(tknId: number, level: number): BaseNode;
    //processAllExpDB_(root: GrProcessNodeValueMap, db: ExpDB, graphDB: NodeGraph, mHistory: Array<string>, cnt?: number): Promise<boolean>;
    //processAllExpDB(db: ExpDB, graphDB: NodeGraph): Promise<boolean>;
    processAllExp(): void;
    populateGrammarTree(treeTop: GrTreeTop, grTree: GrTree, tokenId: number, type: string, followChildren?: boolean): GrTree;
    /** Process all the tokens in order
     *  Try to match all the grammar rules
     *
     */
    processAllGrammar(): void;
    processNodeGrammar(nd: BaseNode): void;
    /** Process only one token "tknId" for grammar match
     * @param tknId - Specify the token to process
     * @returns {*} - return [true if match was found, grammar that matched]
     */
    processGr(tknId: number): boolean;
}