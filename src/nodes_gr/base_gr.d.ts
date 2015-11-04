/// <reference path="../nodes_pos/base_node.d.ts" />

interface GrMatchTokenTypeItem {
    name: string;
    toPOS: string;
    fromPOS: string;
    edge: string;
}
interface GrMatchTokenType {
    [index: number]: GrMatchTokenTypeItem;
}
interface GrBaseMatch {
    type: string;
}
interface GrProcessNodeValue {
    tokenId: number;
    token: string;
    data: Array<GrProcessNodeValueMap>;
    dataValue: string;
    dataValueTagged: string;
    partialExp?: Array<{
        edgeList: Array<string>;
        exp: ExpBase;
        }>;

}
interface GrProcessNodeValueMap {[key:string]: GrProcessNodeValue}
//declare class GrBase {}

declare class GrBase {
    fromNode: BaseNode;
    toNode: BaseNode;
    get_nodes: ()=>any;
    linkType: string;
    name: string;
    match: GrBaseMatch;
    constructor(nodes: any, fromNode: BaseNode, linkType: string, toNode: BaseNode, result: GrBaseMatch);
    getName(): string;
    static getMatchToken(): GrMatchTokenType;
    resolveSubNodes(data: GrProcessNodeValue): void;
    getValues(tagged?: boolean): string;
    dict():GrProcessNodeValueMap  ;
    processNode(ret: GrProcessNodeValueMap): GrProcessNodeValueMap;
    static checkValid(nodeList: any, fromNode: any, linkType: any, toNode: any): {}[];
}