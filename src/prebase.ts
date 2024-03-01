/**
 * module for things that all music21-created objects, not just objects that can live in
 * Stream.elements should inherit.
 * Copyright (c) 2013-23, Michael Scott Asato Cuthbert
 *
 */

declare interface ProtoM21ObjectConstructorInterface extends Function {
    className: string;
}

declare interface Constructable<T> {
    new() : T;
}

/**
 * Class for pseudo-m21 objects to inherit from. The most important attributes that nearly
 * everything in music21 should inherit from are given below.
 *
 * @property {Array<string>} classes - An Array of strings of classes
 * that the object belongs to (default ['ProtoM21Object'])
 * @property {boolean} isProtoM21Object - Does this object descend
 * from music21.prebase.ProtoM21Object: obviously true.
 * @property {boolean} isMusic21Object - Does this object descend
 * from Music21Object; default false.
 */
export class ProtoM21Object {
    static get className() { return 'music21.prebase.ProtoM21Object'; }
    protected _storedClasses: string[];
    protected _storedClassSet: Set<any>;
    _cl: string;
    isProtoM21Object: boolean = true;
    isMusic21Object: boolean = false;
    protected _cloneCallbacks: any = {};

    constructor() {
        // this exists for looking at Proxies of this object in Javascript
        // consoles.  Because Chrome prints a stream as:
        // Proxy {_cl: 'Stream', ... }
        this._cl = this.classes[0];
    }

    get classSet(): Set<any> {
        if (this._storedClassSet !== undefined) {
            return this._storedClassSet;
        }
        this._populateClassCaches();
        return this._storedClassSet;
    }

    /**
     * Gets all classes.  Note that because of webpack mangling of class names,
     * we need to specify `className` as a static property on each class.
     */
    get classes(): string[] {
        if (this._storedClasses !== undefined) {
            return this._storedClasses;
        }
        this._populateClassCaches();
        return this._storedClasses;
    }

    /**
     * Populates the class caches (.classes and .classSet)
     *
     * Stored on the individual object, not the class, unlike music21p
     */
    private _populateClassCaches() {
        const classSet = new Set();
        const classList = [];
        let thisConstructor = <ProtoM21ObjectConstructorInterface> this.constructor;
        let maxLinks = 20;
        while (
            thisConstructor !== undefined
            && maxLinks
        ) {
            maxLinks -= 1;
            const constructorName = thisConstructor.className;
            if (constructorName === undefined || constructorName === '') {
                break;
            }
            const constructorNameShort = constructorName.slice(constructorName.lastIndexOf('.') + 1);
            classList.push(constructorNameShort);
            classSet.add(thisConstructor);
            classSet.add(constructorName);
            classSet.add(constructorNameShort);
            thisConstructor = Object.getPrototypeOf(thisConstructor);
        }
        classList.push('object');
        this._storedClasses = classList;
        this._storedClassSet = classSet;
    }

    /**
     * Makes (as much as possible) a complete duplicate copy of the object called with .clone()
     *
     * Works similarly to Python's copy.deepcopy().
     *
     * Every ProtoM21Object has a `._cloneCallbacks` object which maps
     * `{attribute: callbackFunction|boolean}`
     * to handle custom clone cases.  See, for instance, Music21Object which
     * uses a custom callback to NOT clone the `.derivation` attribute directly.
     *
     * @example
     * var n1 = new music21.note.Note("C#");
     * n1.duration.quarterLength = 4;
     * var n2 = n1.clone();
     * n2.duration.quarterLength == 4; // true
     * n2 === n1; // false
     */
    clone(deep=true, memo=undefined): this {
        // console.log(`cloning ${this + ''} as ${deep ? 'deep' : 'shallow'}`);
        const classConstructor = <Constructable<ProtoM21Object>> this.constructor;
        const ret = <Record<string, any>> new classConstructor();
        if (memo === undefined) {
            memo = new WeakMap();
        }

        // TODO(msc): test if Arrays work?
        for (const key in this) {
            // not that we ONLY copy the keys in Ret -- it's easier that way.
            if ({}.hasOwnProperty.call(this, key) === false) {
                continue;
            }
            if (key in this._cloneCallbacks) {
                if (this._cloneCallbacks[key] === true) {
                    ret[key] = this[key];
                } else if (this._cloneCallbacks[key] === false) {
                    ret[key] = undefined;
                } else {
                    // call the cloneCallbacks function
                    this._cloneCallbacks[key](key, ret, this, deep, memo);
                }
            } else if (
                Object.getOwnPropertyDescriptor(this, key).get !== undefined
                || Object.getOwnPropertyDescriptor(this, key).set !== undefined
            ) {
                // do nothing
            } else if (typeof this[key] === 'function') {
                // do nothing -- events might not be copied.
            } else if (
                deep
                && typeof this[key] === 'object'
                && this[key] !== null
                && (<ProtoM21Object><unknown> this[key]).isProtoM21Object
            ) {
                // console.log('cloning ', key);
                const m21Obj = <ProtoM21Object><unknown> this[key];
                let clonedVersion;
                if (memo.has(m21Obj)) {
                    clonedVersion = memo.get(m21Obj);
                } else {
                    clonedVersion = m21Obj.clone(deep, memo);
                }
                ret[key] = clonedVersion;
            } else {
                try {
                    // for deep this should be:
                    // music21.common.merge(ret[key], this[key]);
                    ret[key] = this[key];
                } catch (e) {
                    if (e instanceof TypeError) {
                        console.log('typeError:', e, key);
                        // do nothing
                    } else {
                        throw e;
                    }
                }
            }
        }
        return ret as this;
    }

    /**
     * Check to see if an object is of this class or subclass.
     *
     * @example
     * var n = new music21.note.Note();
     * n.isClassOrSubclass('Note'); // true
     * n.isClassOrSubclass('music21.base.Music21Object'); // true
     * n.isClassOrSubclass(music21.note.GeneralNote); // true
     * n.isClassOrSubclass(['Note', 'Rest']); // true
     * n.isClassOrSubclass(['Duration', 'NotRest']); // true // NotRest
     */
    isClassOrSubclass(
        testClass: string|string[]|(new () => ProtoM21Object)|(new () => ProtoM21Object)[]
    ): boolean {
        let useTestClass: string[] | (new () => ProtoM21Object)[];
        if (!(testClass instanceof Array)) {
            useTestClass = [testClass] as string[] | (new () => ProtoM21Object)[];
        } else {
            useTestClass = testClass as string[] | (new () => ProtoM21Object)[];
        }
        for (const thisTestClass of useTestClass) {
            if (this.classSet.has(thisTestClass)) {
                return true;
            }
        }
        return false;
    }

    toString(): string {
        let si = this.stringInfo();
        if (si !== '') {
            si = ' ' + si;
        }
        return `<${this.classes[0]}${si}>`;
    }

    stringInfo(): string {
        return '';
    }

    eq(other: this): boolean {
        return this === other;
    }
}
