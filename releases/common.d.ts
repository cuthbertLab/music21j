/// <reference types="jquery" />
/// <reference types="jquery" />
export declare function coerceHTMLElement(el?: JQuery | HTMLElement): HTMLElement;
/**
 * concept borrowed from Vex.Flow.Merge, though here the source can be undefined;
 * http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
 * recursive parts used in .clone()
 *
 * @param {Object} destination - object to have attributes placed into
 * @param {Object} source - object to take attributes from.
 * @returns {Object} destination
 */
export declare function merge<T extends object>(destination: T, source?: object): T;
export declare function range(start: number, stop: number, step: number): any;
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
export declare function posMod(a: number, b: number): number;
/**
 *
 * Returns the statistical mode (most commonly appearing element)
 * in 'a' which is an Array or iterable.
 *
 * In case of tie, returns the first element to reach the maximum
 * number of occurrences.
 *
 * @param {Array<*>} a - an array to analyze
 * @returns {Object} element with the highest frequency in an array.
 */
export declare function statisticalMode(a: readonly number[]): number;
/**
 * fromRoman - Convert a Roman numeral (upper or lower) to an int.
 */
export declare function fromRoman(num: string): number;
/**
 * toRoman - Convert a number from 1 to 3999 to a roman numeral
 */
export declare function toRoman(num: number): string;
/**
 * Creates an SVGElement of an SVG figure using the correct `document.createElementNS` call.
 * tag defaults to svg, but can be 'rect', 'circle', 'text', etc.
 * Attributes is an object to pass to the tag.
 */
export declare function makeSVGright(tag?: string, attrs?: Record<string, any>): SVGElement;
/**
 * Take a number such as 32 and return a string such as "nd"
 * (for "32nd") etc.
 *
 * [plural=false] - make plural (note that "21st" plural is "21st")
 */
export declare function ordinalAbbreviation(value: number, plural?: boolean): string;
/**
 * Find a rational number approximation of this floating point.
 *
 * Returns an object of {'numerator: numerator, 'denominator': denominator} or undefined
 *
 * * ql - number to rationalize
 * * epsilon=0.001 - how close to get
 * * maxDenominator=50 - maximum denominator
 */
export declare function rationalize(ql: number, epsilon?: number, maxDenominator?: number): {
    numerator: number;
    denominator: number;
} | undefined;
/**
 * Change something that could be a string or number and might
 * end with "px" to a number.
 *
 * "400px" -> 400
 *
 * str -- string that might have 'px' at the end or not
 */
export declare function stripPx(str: number | string): number;
/**
 * Find name in the query string (?name=value) and return value.
 *
 * name - url parameter to find
 * Return may be '' if empty.
 */
export declare function urlParam(name: string): string;
export declare function arrayEquals(a1: any[], a2: any[]): boolean;
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
export declare const pathSimplify: (path: string) => string;
export declare function isFloat(num: number): boolean;
/**
 * Returns either the original number (never a fraction, since js does not have them)
 * or the slightly rounded, correct representation.
 *
 * Uses a shared memory buffer to give the conversion.
 */
export declare function opFrac(num: number): number;
/**
 * Converts a string to a single element using template.
 *
 * Similar to JQuery's $('<tag attributes="xyz"><b>more</b></tag>')[0]
 *
 * For security reasons <template> will not parse script
 * tags.
 *
 * This is tagged as returning HTMLElement for convenience
 * but can also be used to return SVGElement.
 *
 * Recommended in:
 * https://stackoverflow.com/questions/494143/
 */
export declare function to_el(input_string: string): HTMLElement;
/**
 * Sleep for some time in milliseconds.
 */
export declare function sleep(ms: number): Promise<number>;
//# sourceMappingURL=common.d.ts.map