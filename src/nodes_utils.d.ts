/// <reference path="nodes_gr/base_gr.d.ts" />

interface FindGrammarRetTypeDt{
    fn:typeof GrBase;
    attachType: string;
}

declare class JSNetworkx {
    nodes(flag: boolean): any;
    edges(flag: boolean): any;
    hasNode(nd:string): boolean;
    addEdge(src: string, dst: string, edge: any);
    addNode(name: string, data: any);
    getEdgeData(src: string, dst: string): any;
}

interface NodeGraph {
    [key: string] : JSNetworkx;
}

interface GlobalBucket {
    gr: NodeGraph;
}
declare class NLPClient {
    req(txt:string): {body: string};
}