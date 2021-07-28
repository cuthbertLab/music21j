/**
 * common functions
 * functions that are useful everywhere...
 *
 * @exports music21/common
 * @memberof music21
 */
/**
 * concept borrowed from Vex.Flow.Merge, though here the source can be undefined;
 * http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
 * recursive parts used in .clone()
 *
 * @function music21.common.merge
 * @param {Object} destination - object to have attributes placed into
 * @param {Object} source - object to take attributes from.
 * @memberof music21.common
 * @returns {Object} destination
 */
export declare function merge(destination: any, source: any): any;
export declare function range(start: any, stop: any, step: any): any;
/**
 * Mix in another class into this class -- a simple form of multiple inheritance.
 * See articulations.Marcato for an example.
 *
 */
export declare function mixin(OtherParent: any, thisClassOrObject: any): void;
/**
 * Aggregation -- closer to true multiple inheritance -- prefers last class's functions.  See
 * https://stackoverflow.com/questions/29879267/es6-class-multiple-inheritance
 *
 *  not currently used...
 */
/**
 * posMod - return a modulo value that is not negative
 *
 * @param  {int} a value
 * @param  {int} b modulo
 * @return {int}   a mod b between 0 and b - 1
 */
export declare function posMod(a: any, b: any): number;
/**
 *
 * Returns the statistical mode (most commonly appearing element)
 * in a.
 *
 * In case of tie, returns the first element to reach the maximum
 * number of occurrences.
 *
 * @function music21.common.statisticalMode
 * @param {Array<*>} a - an array to analyze
 * @returns {Object} element with the highest frequency in a
 */
export declare function statisticalMode(a: any): any;
/**
 * fromRoman - Convert a Roman numeral (upper or lower) to an int.
 *
 * @param  {string} num roman numeral representation of a number
 * @return {int}     integer value of roman numeral;
 */
export declare function fromRoman(num: any): number;
/**
 * toRoman - Convert a number from 1 to 3999 to a roman numeral
 *
 * @param  {int} num number to convert
 * @return {string}     as roman numeral
 */
export declare function toRoman(num: any): string;
/**
 * Creates an SVGElement of an SVG figure using the correct `document.createElementNS` call.
 *
 * @function music21.common.makeSVGright
 * @param {string} [tag='svg'] - a tag, such as 'rect', 'circle', 'text', or 'svg'
 * @param {Object} [attrs] - attributes to pass to the tag.
 * @memberof music21.common
 * @returns {SVGElement}
 */
export declare function makeSVGright(tag?: string, attrs?: {}): SVGElement;
/**
 * Take a number such as 32 and return a string such as "nd"
 * (for "32nd") etc.
 *
 * @function music21.common.ordinalAbbreviation
 * @param {number} value
 * @param {boolean} [plural=false] - make plural (note that "21st" plural is "21st")
 * @return {string}
 */
export declare function ordinalAbbreviation(value: number, plural?: boolean): string;
/**
 * Find a rational number approximation of this floating point.
 *
 * @function music21.common.rationalize
 * @param {number} ql - number to rationalize
 * @param {number} [epsilon=0.001] - how close to get
 * @param {int} [maxDenominator=50] - maximum denominator
 * @returns {object|undefined} {'numerator: numerator, 'denominator': denominator}
 */
export declare function rationalize(ql: number, epsilon?: number, maxDenominator?: number): {
    numerator: number;
    denominator: number;
};
/**
 * Change something that could be a string or number and might
 * end with "px" to a number.
 *
 * "400px" -> 400
 *
 * @function music21.common.stripPx
 * @param {number|string} str -- string that might have 'px' at the end or not
 * @returns {number} a number to use
 */
export declare function stripPx(str: any): any;
/**
 * Find name in the query string (?name=value) and return value.
 *
 * @function music21.common.urlParam
 * @param {string} name - url parameter to find
 * @returns {string} may be "" if empty.
 */
export declare function urlParam(name: any): string;
export declare function arrayEquals(a1: any, a2: any): boolean;
export declare class SingletonCounter {
    call(): number;
}
export declare const urls: {
    css: string;
    webResources: string;
    midiPlayer: string;
    soundfontUrl: string;
};
export declare function hyphenToCamelCase(usrStr: string): string;
export declare function numToIntOrFloat(value: number): number;
/**
 *
 * @param {string} path
 * @returns {string}
 */
export declare const pathSimplify: (path: any) => string;
export declare function isFloat(num: any): boolean;
/**
 * Returns either the original number (never a fraction, since js does not have them)
 * or the slightly rounded, correct representation.
 *
 * Uses a shared memory buffer to give the conversion.
 */
export declare function opFrac(num: any): any;
//# sourceMappingURL=common.d.ts.map