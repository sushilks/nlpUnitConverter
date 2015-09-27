/// <reference path="../nodes_gr/base_gr.d.ts" />
/// <reference path="../dependency.d.ts" />

declare class BaseNode {
    name: string;
    nodes: any;
    tknId: number;
    level: number;
    children: {
        [key: number]: LinkedNode;
    };
    parent: LinkedNode;
    grProcessingOngoing: boolean;
    grProcessingDone: boolean;
    grMatches: Array<GrBase>;
    constructor(nodes: any, tknId: number, level: number, noprocess: boolean);
    static getMatchToken(): string;
    tabs(): string;
    isGrammarProcessingDone(): boolean;
    setGrammarProcessingDone(b?: boolean): void;
    addGrammarMatch(gr: GrBase): void;
    getGrammarMatches(): Array<GrBase>;
    getChildren(): {
        [key: number]: LinkedNode;
    };
    getChild(loc: any): LinkedNode;
    getListOfPos(): Array<string>;
    getToken(): string;
    getTokenId(): number;
    getTokenPOS(): string;
    getPOS(): string;
    getValues(tagged?: boolean): string;
    noOfChildren(): number;
    print(tab: number): void;
    getParent(): LinkedNode;
    addParent(node: BaseNode, type: string): void;
    addChild(tkn: number, type: string): void;
    process(tknid: number): void;
}

