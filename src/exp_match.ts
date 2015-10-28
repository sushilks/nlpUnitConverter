/// <reference path="../typings/tsd.d.ts" />

'use strict';

class ExpMatch {
    public args: {[key: string]: {
        listStr: Array<string>;
        listExp: Array<ExpMatch>;
    }};
    public defaultUsed: Array<string>;
    public _keys:{[key: string]: string};
    public dbId: string;
    constructor() {
        this.args = {};
        this._keys = {};
        this.defaultUsed = [];
    }
    public setArgStr(key: string, dt: string| Array<string>) {
        if (!this.args[key]) {
            this.args[key] = {listStr: [], listExp: undefined};
        }
        if (Array.isArray(dt)) {
            this.args[key].listStr = dt;
        } else {
            this.args[key].listStr = [dt];
        }
    }
    public setArgExp(key: string, dt: ExpMatch| Array<ExpMatch>) {
        if (!this.args[key]) {
            this.args[key] = {listStr: undefined, listExp: []};
        }
        if (Array.isArray(dt)) {
            this.args[key].listExp = dt;
        } else {
            this.args[key].listExp = [dt];
        }
    }

    public isArgStrValid(key: string): boolean {
        let a = this.args[key];
        if (a === undefined) return false;
        if (a.listStr === undefined || a.listStr.length === 0 )
            return false;
        if (a.listStr && a.listStr.length !=0)
            return (a.listStr[0] !== undefined && a.listStr[0] !== null);
        return true;
    }
    public isArgExpValid(key: string): boolean {
        let a = this.args[key];
        if (a === undefined) return false;
        if (a.listExp === undefined || a.listExp.length === 0)
            return false;
        if (a.listExp && a.listExp.length != 0)
            return (a.listExp[0] !== undefined && a.listExp[0] !== null);
        return true;
    }
    public isArgValid(key: string): boolean {
        return this.isArgStrValid(key) || this.isArgExpValid(key);
    }
    public setArgPath(key: string, path:string): void {
        this._keys[key] = path;
    }
    public getArgStr(key: string, idx = 0): string {
        if (!this.isArgStrValid(key)) return undefined;
        if (this.getArgStrLength(key) <= idx) {
            return undefined;
        }
        return this.args[key].listStr[idx];
    }
    public getArgStrArray(key: string): Array<string> {
        if (!this.isArgStrValid(key)) return undefined;
        return this.args[key].listStr;
    }
    public getArgExp(key: string, idx = 0): ExpMatch {
        if (!this.isArgExpValid(key)) return undefined;
        if (this.getArgExpLength(key) <= idx) {
            return undefined;
        }
        return this.args[key].listExp[idx];
    }
    public getArgStrLength(key: string): number {
        if (!this.isArgStrValid(key)) return 0;
        return this.args[key].listStr.length;
    }
    public getArgExpLength(key: string): number {
        if (!this.isArgExpValid(key)) return 0;
        return this.args[key].listExp.length;
    }
    public isDefaultUsed(key: string): boolean {
        if (!this.defaultUsed || this.defaultUsed.length === 0) return false;
        if (this.defaultUsed.indexOf(key) !== -1)
            return true;
        else
            return false;
    }
    public setDefaultUsed(key: string) {
        this.defaultUsed.push(key);
    }

}
export default ExpMatch;