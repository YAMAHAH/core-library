import { Type } from '@angular/core';
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


/**
 * An interface implemented by all Angular type decorators, which allows them to be used as ES7
 * decorators as well as
 * Angular DSL syntax.
 *
 * ES7 syntax:
 *
 * ```
 * @ng.Component({...})
 * class MyClass {...}
 * ```
 * @stable
 */
export interface TypeDecorator {
    /**
     * Invoke as ES7 decorator.
     */
    <T extends Type<any>>(type: T): T;

    // Make TypeDecorator assignable to built-in ParameterDecorator type.
    // ParameterDecorator is declared in lib.d.ts as a `declare type`
    // so we cannot declare this interface as a subtype.
    // see https://github.com/angular/angular/issues/3379#issuecomment-126169417
    (target: Object, propertyKey?: string | symbol, parameterIndex?: number): void;
}

export const ANNOTATIONS = '__annotations__';
export const PARAMETERS = '__paramaters__';
export const PROP_METADATA = '__prop__metadata__';

/**
 * @suppress {globalThis}
 */
export function makeDecorator(
    name: string, props?: (...args: any[]) => any, parentClass?: any,
    chainFn?: (fn: Function) => void):
    { new(...args: any[]): any; (...args: any[]): any; (...args: any[]): (cls: any) => any; } {
    const metaCtor = makeMetadataCtor(props);

    function DecoratorFactory(objOrType: any): (cls: any) => any {
        if (this instanceof DecoratorFactory) {
            metaCtor.call(this, objOrType);
            return this;
        }

        const annotationInstance = new (<any>DecoratorFactory)(objOrType);
        const TypeDecorator: TypeDecorator = <TypeDecorator>function TypeDecorator(cls: Type<any>) {
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            const annotations = cls.hasOwnProperty(ANNOTATIONS) ?
                (cls as any)[ANNOTATIONS] :
                Object.defineProperty(cls, ANNOTATIONS, { value: [] })[ANNOTATIONS];
            annotations.push(annotationInstance);
            return cls;
        };
        if (chainFn) chainFn(TypeDecorator);
        return TypeDecorator;
    }

    if (parentClass) {
        DecoratorFactory.prototype = Object.create(parentClass.prototype);
    }

    DecoratorFactory.prototype.ngMetadataName = name;
    (<any>DecoratorFactory).annotationCls = DecoratorFactory;
    return DecoratorFactory as any;
}

function makeMetadataCtor(props?: (...args: any[]) => any): any {
    return function ctor(...args: any[]) {
        if (props) {
            const values = props(...args);
            for (const propName in values) {
                this[propName] = values[propName];
            }
        }
    };
}

export function makeParamDecorator(
    name: string, props?: (...args: any[]) => any, parentClass?: any): any {
    const metaCtor = makeMetadataCtor(props);
    function ParamDecoratorFactory(...args: any[]): any {
        if (this instanceof ParamDecoratorFactory) {
            metaCtor.apply(this, args);
            return this;
        }
        const annotationInstance = new (<any>ParamDecoratorFactory)(...args);

        (<any>ParamDecorator).annotation = annotationInstance;
        return ParamDecorator;

        function ParamDecorator(cls: any, unusedKey: any, index: number): any {
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            const parameters = cls.hasOwnProperty(PARAMETERS) ?
                (cls as any)[PARAMETERS] :
                Object.defineProperty(cls, PARAMETERS, { value: [] })[PARAMETERS];

            // there might be gaps if some in between parameters do not have annotations.
            // we pad with nulls.
            while (parameters.length <= index) {
                parameters.push(null);
            }

            (parameters[index] = parameters[index] || []).push(annotationInstance);
            return cls;
        }
    }
    if (parentClass) {
        ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    ParamDecoratorFactory.prototype.ngMetadataName = name;
    (<any>ParamDecoratorFactory).annotationCls = ParamDecoratorFactory;
    return ParamDecoratorFactory;
}

export function makePropDecorator(
    name: string, props?: (...args: any[]) => any, parentClass?: any): any {
    const metaCtor = makeMetadataCtor(props);

    function PropDecoratorFactory(...args: any[]): any {
        if (this instanceof PropDecoratorFactory) {
            metaCtor.apply(this, args);
            return this;
        }

        const decoratorInstance = new (<any>PropDecoratorFactory)(...args);

        return function PropDecorator(target: any, name: string) {
            const constructor = target.constructor;
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            const meta = constructor.hasOwnProperty(PROP_METADATA) ?
                (constructor as any)[PROP_METADATA] :
                Object.defineProperty(constructor, PROP_METADATA, { value: {} })[PROP_METADATA];
            meta[name] = meta.hasOwnProperty(name) && meta[name] || [];
            meta[name].unshift(decoratorInstance);
        };
    }

    if (parentClass) {
        PropDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }

    PropDecoratorFactory.prototype.ngMetadataName = name;
    (<any>PropDecoratorFactory).annotationCls = PropDecoratorFactory;
    return PropDecoratorFactory;
}

export function isDescriptor(desc: PropertyDescriptor) {
    if (!desc || !desc.hasOwnProperty) {
        return false;
    }

    const keys = ['value', 'initializer', 'get', 'set'];

    for (let i = 0, l = keys.length; i < l; i++) {
        if (desc.hasOwnProperty(keys[i])) {
            return true;
        }
    }

    return false;
}
const { defineProperty, getOwnPropertyDescriptor,
    getOwnPropertyNames, getOwnPropertySymbols } = Object;
export function decorate(handleDescriptor: any, entryArgs: any[]) {
    if (isDescriptor(entryArgs[entryArgs.length - 1])) {
        return handleDescriptor(...entryArgs, []);
    } else {
        return function () {
            return handleDescriptor(...Array.prototype.slice.call(arguments), entryArgs);
        };
    }
}

export const getOwnKeys = getOwnPropertySymbols
    ? function (obj: any) {
        let ownPropKeys: any[] = getOwnPropertyNames(obj);
        return ownPropKeys.concat(getOwnPropertySymbols(obj));
    }
    : getOwnPropertyNames;
export function getOwnPropertyDescriptors(obj: any) {
    const descs = {};

    getOwnKeys(obj).forEach(
        (key: string) => (descs[key] = getOwnPropertyDescriptor(obj, key))
    );

    return descs;
}

export function createDefaultSetter(key: PropertyKey) {
    return function set(newValue: any) {
        Object.defineProperty(this, key, {
            configurable: true,
            writable: true,
            // IS enumerable when reassigned by the outside word
            enumerable: true,
            value: newValue
        });

        return newValue;
    };
}

export function bind(fn: Function, context: any) {
    if (fn.bind) {
        return fn.bind(context);
    } else {
        return function __autobind__() {
            return fn.apply(context, arguments);
        };
    }
}