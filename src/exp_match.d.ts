/// <reference path="../typings/tsd.d.ts" />

declare class ExpMatch {
    public args: {[key: string]: {
        listStr: Array<string>;
        listExp: Array<ExpMatch>;
    }};
    public defaultUsed: Array<string>;
    public _keys:{[key: string]: string};
    public dbId: string;
    constructor();
    public isArgStrValid(key: string): boolean;
    public isArgExpValid(key: string): boolean;
    public isArgValid(key: string): boolean;
    public getArgStr(key: string, idx): string;
    public getArgExp(key: string, idx): ExpMatch;
    public getArgStrLength(key: string): number;
    public getArgExpLength(key: string): number;
    public setArgStr(key: string, dt: string| Array<string>);
    public setArgExp(key: string, dt: ExpMatch| Array<ExpMatch>);
    public isDefaultUsed(key: string): boolean;

    }
