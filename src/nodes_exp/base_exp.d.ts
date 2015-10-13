
interface ExpTokenType {
    [index: number]: string;
}
interface ExpPropType {
    singleVerbEdge: boolean;
}
interface ExpArgType {
    type: string;
    extractionNode?: string;
    default?: string| number;
}

declare class ExpBase {
    nodes: any;
    result: ExpMatch;
    name: string;
    constructor(nodes: any, matchResult: ExpMatch);
    static getMatchToken(): ExpTokenType;
    static getProp(): ExpPropType;
    getName(): string;
    static getName(): string;
    getResult(): ExpMatch;
    static getArgs(): {[key: string]: ExpArgType};
    text(): string;
    exec(gr: any): void;
    static checkValid(gr: any): [boolean, ExpMatch];
    static checkValidArguments(nodes: any, match: any, graphDB: any): boolean;
}
/*
interface console {
    trace(label: string): void;
}
*/