
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

interface ExpArgElement {
    type: string;
    extractionNode?: string;
    default?: string| number;
}
interface ExpArgType2 {
    input: {
        [key: string]: ExpArgElement;
    },
    output: {
        [key: string]: ExpArgElement;
    }
}

declare class ExpBase {
    nodes: any;
    result: ExpMatch;
    name: string;
    getResult(): ExpMatch;
    text(): string;
    //static checkValid(gr: any): [boolean, ExpMatch];
    static checkValidArguments(nodes: any, match: any, graphDB: any): boolean;
    // app is required to create these functions
    //
    //
    // name of the function
    getName(): string;
    static getName(): string;
    // Json repersenting the arugments needed by the app
    static getArgs(): {[key: string]: ExpArgType};
    // main executing point
    exec(globalBucket: GlobalBucket): boolean;
    //optional functions
    //  getMatchToken is needed if the tigger is not verbBase
    static getMatchToken(): ExpTokenType;
    constructor(nodes: any, matchResult: ExpMatch);
    // check if the arguments that are passed in the call
    // translate to a valid set of arguments
    static checkValidArguments(nodes: any, match: any, globalBucket: GlobalBucket): boolean;
    static getProp(): ExpPropType;

    // constructor should have a UUID + access to globalBucket.
    // Arguments should be in from of
    //      input and output
    //      Also dependencies must be clearly defined. ( It probably captured in the arguemet defination)

}
/*
interface console {
    trace(label: string): void;
}
*/