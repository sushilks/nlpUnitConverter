
interface ExpBaseMatch {
}
interface ExpTokenType {
    [index: number]: string;
}
interface ExpPropType {
    singleVerbEdge: boolean;
}
interface ExpArgType {
    type: string,
    extractionNode: string,
    default: any
}
declare class ExpBase {
    nodes: any;
    result: ExpBaseMatch;
    name: string;
    constructor(nodes: any, matchResult: ExpBaseMatch);
    static getMatchToken(): ExpTokenType;
    static getProp(): ExpPropType;
    getName(): string;
    getResult(): ExpBaseMatch;
    getArgs(): ExpArgType;
    text(): string;
    exec(gr: any): void;
    static checkValid(gr: any): {}[];
    static checkValidArguments(nodes: any, match: any): boolean;
}
/*
interface console {
    trace(label: string): void;
}
*/