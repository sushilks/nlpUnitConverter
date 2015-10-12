
interface ExpBaseMatch {
    args: {[key:string]: string | Array<string> | Array<ExpBaseMatch>};
    defaultUsed?: {[idx: number]: string};
    _keys?: {[key: string]: string};
    dbId?: string;
}
interface ExpTokenType {
    [index: number]: string;
}
interface ExpPropType {
    singleVerbEdge: boolean;
}
interface ExpArgType {
    type: string;
    extractionNode: string;
    default: string| number;
}

declare class ExpBase {
    nodes: any;
    result: ExpBaseMatch;
    name: string;
    constructor(nodes: any, matchResult: ExpBaseMatch);
    static getMatchToken(): ExpTokenType;
    static getProp(): ExpPropType;
    getName(): string;
    static getName(): string;
    getResult(): ExpBaseMatch;
    static getArgs(): {[key: string]: ExpArgType};
    text(): string;
    exec(gr: any): void;
    static checkValid(gr: any): [boolean, ExpBaseMatch];
    static checkValidArguments(nodes: any, match: any, graphDB: any): boolean;
}
/*
interface console {
    trace(label: string): void;
}
*/