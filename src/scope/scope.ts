import { FunctionCall } from './function/function-call';
import { VariableDeclaration } from './variable/variable-declaration';
import { VariableUsage } from './variable/variable-usage';
import { TypeDeclaration } from './type/type-declaration';
import { TypeUsage } from './type/type-usage';
import { Interval } from './interval';

export class Scope {

    public readonly parent: Scope;
    public readonly children = new Array<Scope>();
    public readonly interval: Interval;

    public readonly functionCalls = new Array<FunctionCall>();

    public readonly variableDeclarations = new Array<VariableDeclaration>();
    public readonly variableUsages = new Array<VariableUsage>();

    public readonly typeDeclarations = new Array<TypeDeclaration>();
    public readonly typeUsages = new Array<TypeUsage>();

    public constructor(interval: Interval, parent: Scope) {
        this.interval = interval;
        this.parent = parent;
    }

    public isGlobal(): boolean {
        return !this.parent;
    }

}
