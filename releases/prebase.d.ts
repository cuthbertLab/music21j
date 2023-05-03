/**
 * module for things that all music21-created objects, not just objects that can live in
 * Stream.elements should inherit.
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 *
 */
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
export declare class ProtoM21Object {
    static get className(): string;
    protected _storedClasses: string[];
    protected _storedClassSet: Set<any>;
    _cl: string;
    isProtoM21Object: boolean;
    isMusic21Object: boolean;
    protected _cloneCallbacks: any;
    constructor();
    get classSet(): Set<any>;
    /**
     * Gets all classes.  Note that because of webpack mangling of class names,
     * we need to specify `className` as a static property on each class.
     */
    get classes(): string[];
    /**
     * Populates the class caches (.classes and .classSet)
     *
     * Stored on the individual object, not the class, unlike music21p
     */
    private _populateClassCaches;
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
    clone(deep?: boolean, memo?: any): this;
    /**
     * Check to see if an object is of this class or subclass.
     *
     * @param {string|string[]} testClass - a class or Array of classes to test
     * @returns {boolean}
     * @example
     * var n = new music21.note.Note();
     * n.isClassOrSubclass('Note'); // true
     * n.isClassOrSubclass('music21.base.Music21Object'); // true
     * n.isClassOrSubclass(music21.note.GeneralNote); // true
     * n.isClassOrSubclass(['Note', 'Rest']); // true
     * n.isClassOrSubclass(['Duration', 'NotRest']); // true // NotRest
     */
    isClassOrSubclass(testClass: string | typeof ProtoM21Object | (string | typeof ProtoM21Object)[]): boolean;
    /**
     *
     * @returns {string}
     */
    toString(): string;
    /**
     *
     * @returns {string}
     */
    stringInfo(): string;
    eq(other: this): boolean;
}
//# sourceMappingURL=prebase.d.ts.map