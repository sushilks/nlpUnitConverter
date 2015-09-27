/// <reference path="../nodes_pos/base_node.d.ts" />

interface GrBaseMatch {
    type: string;
}
interface GrProcessNodeValue {
    tokenId: number;
    token: string;
    data: Array<GrProcessNodeValue>;
    dataValue: string;
    dataValueTagged: string;
}
interface GrProcessNodeValueMap {[key:string]: GrProcessNodeValue}

declare class GrBase {
    fromNode: BaseNode;
    toNode: BaseNode;
    nodes: any;
    linkType: string;
    name: string;
    match: GrBaseMatch;
    constructor(nodes: any, fromNode: any, linkType: any, toNode: any, result: any);
    getName(): string;
    static getMatchToken(): Array<string>;
    resolveSubNodes(data: GrProcessNodeValue): void;
    getValues(tagged?: boolean): string;
    processNode(ret: {
        [key: string]: GrProcessNodeValue;
    }): {
        [key: string]: GrProcessNodeValue;
    };
}
