import { Element } from '../element';
import { TypeCategory } from './type-category';
import { TypeBase } from './type-base';
import { VariableDeclaration } from '../variable/variable-declaration';
import { TypeUsage } from './type-usage';
import { Interval } from '../interval';
import { Scope } from '../scope';
import { Constants } from '../../core/constants';

export class TypeDeclaration extends Element {

    public readonly builtin: boolean;
    public readonly structInterval: Interval;
    public readonly typeBase: TypeBase;
    public readonly typeCategory: TypeCategory;
    public readonly width: number;
    public readonly height: number;
    public readonly members = new Array<VariableDeclaration>();
    public readonly usages = new Array<TypeUsage>();


    public constructor(name: string, nameInterval: Interval, scope: Scope, builtIn: boolean, structInterval: Interval, width: number, height: number, typeBase: TypeBase, typeCategory = TypeCategory.CUSTOM) {
        super(name, nameInterval, scope);
        this.builtin = builtIn;
        this.structInterval = structInterval;
        this.width = width;
        this.height = height;
        this.typeBase = typeBase;
        this.typeCategory = typeCategory;
    }

    public isScalar(): boolean {
        return this.width === 1 && this.height === 1;
    }

    public isVector(): boolean {
        return this.width > 1 && this.height === 1;
    }

    public isMatrix(): boolean {
        return this.width > 1 && this.height > 1;
    }

    public isOpaque(): boolean {
        return this.typeCategory === TypeCategory.FLOATING_POINT_OPAQUE ||
            this.typeCategory === TypeCategory.SIGNED_INTEGER_OPAQUE ||
            this.typeCategory === TypeCategory.UNSIGNED_INTEGER_OPAQUE;
    }

    public containsArrayDeclaration(): boolean {
        for (const vd of this.members) {
            if (vd.type.isArray() || (vd.type.declaration && vd.type.declaration.containsArrayDeclaration())) {
                return true;
            }
        }
        return false;
    }

    public toString(): string {
        let result = `struct ${this.name} {`;
        for (const vd of this.members) {
            result += `${vd.toString()};`;
        }
        result += '};';
        return result;
    }

    public toStringDocumentation(): string {
        let result = `\tstruct ${this.name} {${Constants.CRLF}`;
        for (const vd of this.members) {
            result += `\t\t${vd.toString()};${Constants.CRLF}`;
        }
        result += '\t};';
        return result;
    }

}
