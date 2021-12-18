import * as prebase from './prebase';

export enum Enclosure {
    // noinspection JSUnusedGlobalSymbols
    RECTANGLE = 'rectangle',
    SQUARE = 'square',
    OVAL = 'oval',
    CIRCLE = 'circle',
    BRACKET = 'bracket',
    TRIANGLE = 'triangle',
    DIAMOND = 'diamond',
    PENTAGON = 'pentagon',
    HEXAGON = 'hexagon',
    HEPTAGON = 'heptagon',
    OCTAGON = 'octagon',
    NONAGON = 'nonagon',
    DECAGON = 'decagon',
    NONE = 'none',  // special.  sets to undefined
}


// noinspection JSUnusedGlobalSymbols
export class Style extends prebase.ProtoM21Object {
    // size: number|undefined;
    relativeX: number|undefined;
    relativeY: number|undefined;
    absoluteX: number|undefined;
    absoluteY: number|undefined;
    enclosure: Enclosure|undefined;
    // fontRepresentation
    color: string|undefined;
    // units: string = 'tenths';
    hideObjectOnPrint: boolean = false;
}
