/**
 * common functions.
 * functions that are useful everywhere...
 */
import defaults from './defaults';

export function coerceHTMLElement(el?: JQuery|HTMLElement): HTMLElement {
    let htmlElement: HTMLElement;
    if (el !== undefined && (el as JQuery).jquery !== undefined) {
        htmlElement = (el as JQuery)[0];
    } else if (el instanceof HTMLElement) {
        htmlElement = el;
    } else {
        htmlElement = document.querySelector(defaults.appendLocation);
    }
    return htmlElement;
}

/**
 * concept borrowed from Vex.Flow.Merge, though here the source can be undefined;
 * http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
 * recursive parts used in .clone()
 *
 * @param {Object} destination - object to have attributes placed into
 * @param {Object} source - object to take attributes from.
 * @returns {Object} destination
 */
export function merge<T extends object>(destination: T, source?: object): T {
    if (source === undefined || source === null) {
        return destination;
    }
    for (const p in source) {
        if (!{}.hasOwnProperty.call(source, p)) {
            continue;
        }
        try {
            // Property in destination object set; update its value.
            if (source[p] && source[p].constructor === Object) {
                destination[p] = merge(destination[p], source[p]);
            } else {
                destination[p] = source[p];
            }
        } catch (e) {
            // Property in destination object not set; create it and set its value.
            destination[p] = source[p];
        }
    }
    return destination;
}

export function range(start: number, stop: number, step: number) {
    if (step === undefined) {
        step = 1;
    }
    if (stop === undefined) {
        stop = start;
        start = 0;
    }

    const count = Math.ceil((stop - start) / step);
    return Array.apply(0, Array(count)).map((e, i) => i * step + start);
}

/**
 * Mix in another class into this class -- a simple form of multiple inheritance.
 * See articulations.Marcato for an example.
 *
 */
export function mixin(OtherParent, thisClassOrObject): void {
    let proto = Object.getPrototypeOf(OtherParent);
    const classProto = Object.getPrototypeOf(thisClassOrObject);

    while (proto) {
        for (const key in Object.keys(proto)) {
            if (!{}.hasOwnProperty.call(proto, key)) {
                continue;
            }
            if (!(key in classProto)) {
                classProto[key] = proto[key];
            }
        }
        proto = Object.getPrototypeOf(proto);
    }
}

/**
 * Aggregation -- closer to true multiple inheritance -- prefers last class's functions.  See
 * https://stackoverflow.com/questions/29879267/es6-class-multiple-inheritance
 *
 *  not currently used...
 */
// export const aggregation = (baseClass, ...mixins) => {
//     class base extends baseClass {
//         constructor(...args) {
//             super(...args);
//             mixins.forEach(mixin => {
//                 copyProps(this, new mixin());
//             });
//         }
//     }
//     const copyProps = (target, source) => {
//         // this function copies all properties and symbols, filtering out some special ones
//         // noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
//         Object.getOwnPropertyNames(source)
//             .concat(Object.getOwnPropertySymbols(source))
//             .forEach(prop => {
//                 if (
//                     !prop.match(
//                         /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/
//                     )
//                 ) {
//                     Object.defineProperty(
//                         target,
//                         prop,
//                         Object.getOwnPropertyDescriptor(source, prop)
//                     );
//                 }
//             });
//     };
//     mixins.forEach(mixin => {
//         // outside constructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
//         copyProps(base.prototype, mixin.prototype);
//         copyProps(base, mixin);
//     });
//     return base;
// };


/**
 * posMod - return a modulo value that is not negative
 *
 * @param  {int} a value
 * @param  {int} b modulo
 * @return {int}   a mod b between 0 and b - 1
 */

export function posMod(a: number, b: number): number {
    if (a === undefined || b === undefined) {
        throw new Error('Modulo needs two numbers');
    }
    return (a % b + b) % b;
}

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
export function statisticalMode(a: readonly number[]): number {
    if (a.length === 0) {
        return null;
    }
    const modeMap = {};
    let maxEl = a[0];
    let maxCount = 1;
    for (let i = 0; i < a.length; i++) {
        const el = a[i];
        if (modeMap[el] == null) {
            modeMap[el] = 0;
        }
        modeMap[el] += 1;
        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

/**
 * fromRoman - Convert a Roman numeral (upper or lower) to an int.
 */

export function fromRoman(num: string): number {
    const inputRoman = num.toUpperCase();
    const subtractionValues = [1, 10, 100];
    const nums = ['M', 'D', 'C', 'L', 'X', 'V', 'I'];
    const ints = [1000, 500, 100, 50, 10, 5, 1];
    const places = [];
    for (const c of inputRoman) {
        if (!nums.includes(c)) {
            throw new Error(
                'Value is not a valid roman numeral: ' + inputRoman
            );
        }
    }
    for (let i = 0; i < inputRoman.length; i++) {
        const c = inputRoman[i];
        let value = ints[nums.indexOf(c)];
        if (i < inputRoman.length - 1) {
            const nextValue = ints[nums.indexOf(inputRoman[i + 1])];
            if (nextValue > value && subtractionValues.includes(value)) {
                value *= -1;
            }
        }
        places.push(value);
    }
    let summation = 0;
    for (const n of places) {
        summation += n;
    }
    return summation;
}

/**
 * toRoman - Convert a number from 1 to 3999 to a roman numeral
 */

export function toRoman(num: number): string {
    if (typeof num !== 'number') {
        throw new Error('expected integer, got ' + typeof num);
    }
    if (num < 0 || num > 4000) {
        throw new Error('Argument must be between 1 and 3999');
    }
    const ints = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const nums = [
        'M',
        'CM',
        'D',
        'CD',
        'C',
        'XC',
        'L',
        'XL',
        'X',
        'IX',
        'V',
        'IV',
        'I',
    ];
    let result = '';
    for (let i = 0; i < ints.length; i++) {
        const count = Math.floor(num / ints[i]);
        result += nums[i].repeat(count);
        num -= ints[i] * count;
    }
    return result;
}

/**
 * Creates an SVGElement of an SVG figure using the correct `document.createElementNS` call.
 * tag defaults to svg, but can be 'rect', 'circle', 'text', etc.
 * Attributes is an object to pass to the tag.
 *
 * If tag is not specified creates <svg> (SVGSVGElement)
 */
export function makeSVGright(tag: string = 'svg', attrs: Record<string, any> = {}): SVGElement {
    // see http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
    // normal JQuery does not work.
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) {
        if (!{}.hasOwnProperty.call(attrs, k)) {
            continue;
        }
        el.setAttribute(k, `${attrs[k]}`);  // convert to string.
    }
    return el;
}

/**
 * Take a number such as 32 and return a string such as "nd"
 * (for "32nd") etc.
 *
 * [plural=false] - make plural (note that "21st" plural is "21st")
 */
export function ordinalAbbreviation(value: number, plural: boolean = false): string {
    let post: string;
    const valueHundredths = value % 100;
    if (
        valueHundredths === 11
        || valueHundredths === 12
        || valueHundredths === 13
    ) {
        post = 'th';
    } else {
        const valueMod = value % 10;
        if (valueMod === 1) {
            post = 'st';
        } else if (valueMod === 2) {
            post = 'nd';
        } else if (valueMod === 3) {
            post = 'rd';
        } else {
            post = 'th';
        }
    }
    if (post !== 'st' && plural) {
        post += 's';
    }
    return post;
}

/**
 * Find a rational number approximation of this floating point.
 *
 * Returns an object of {'numerator: numerator, 'denominator': denominator} or undefined
 *
 * * ql - number to rationalize
 * * epsilon=0.001 - how close to get
 * * maxDenominator=50 - maximum denominator
 */
export function rationalize(ql: number, epsilon=0.001, maxDenominator=50):
    {numerator: number, denominator: number} | undefined
{
    for (let i = 2; i < maxDenominator; i++) {
        if (Math.abs(ql * i - Math.round(ql * i)) < epsilon) {
            const numerator = Math.round(ql * i);
            const denominator = i;
            return { numerator, denominator };
        }
    }
    return undefined;
}

/**
 * Change something that could be a string or number and might
 * end with "px" to a number.
 *
 * "400px" -> 400
 *
 * str -- string that might have 'px' at the end or not
 */
export function stripPx(str: number|string): number {
    if (typeof str === 'string') {
        const pxIndex = str.indexOf('px');
        str = str.slice(0, pxIndex);
        return parseInt(str);
    } else {
        return str;
    }
}

/**
 * Find name in the query string (?name=value) and return value.
 *
 * name - url parameter to find
 * Return may be '' if empty.
 */
export function urlParam(name: string): string {
    name = name.replace(/\[/, '\\[').replace(/]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(window.location.search);
    return results == null
        ? ''
        : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function arrayEquals(a1: any[], a2: any[]): boolean {
    if (a1.length !== a2.length) {
        return false;
    }
    for (let i = 0; i < a1.length; i++) {
        if (a1[i] instanceof Array && a2[i] instanceof Array) {
            if (!arrayEquals(a1[i], a2[i])) {
                return false;
            }
        } else if (a1[i] !== a2[i]) {
            return false;
        }
    }
    return true;
}

const _singletonCounter = {
    value: 0,
};

export class SingletonCounter {
    call(): number {
        const post = _singletonCounter.value;
        _singletonCounter.value += 1;
        return post;
    }
}

export const urls = {
    css: '/css',
    webResources: '/webResources',
    midiPlayer: '/webResources/midiPlayer',
    soundfontUrl: '/soundfonts/midi-js-soundfonts-master/FluidR3_GM/',
};

export function hyphenToCamelCase(usrStr: string): string {
    return usrStr.replace(/-([a-zA-Z])/g, (all, match) => match.toUpperCase());
}

export function numToIntOrFloat(value: number): number {
    const intVal = Math.round(value);
    if (Math.abs(value - intVal) < 0.000001) {
        return intVal;
    } else {
        return value;
    }
}

export const pathSimplify = (path: string): string => {
    let pPrefix = '';
    if (path.indexOf('//') === 0) {
        pPrefix = '//'; //cdn loading;
        path = path.slice(2);
        // console.log('cdn load: ', pPrefix, ' into ', path);
    } else if (path.indexOf('://') !== -1) { // for cross site requests...
        const protoSpace = path.indexOf('://');
        pPrefix = path.slice(0, protoSpace + 3);
        path = path.slice(protoSpace + 3);
        // console.log('cross-site split', pPrefix, path);
    }
    const ps = path.split('/');
    const addSlash = (path.slice(path.length - 1, path.length) === '/');
    const pout = [];
    for (const el of ps) {
        if (el === '..') {
            if (pout.length > 0) {
                if (pout[pout.length - 1] !== '..') {
                    pout.pop();
                } else {
                    pout.push('..');
                }
            } else {
                pout.push('..');
            }
        } else {
            pout.push(el);
        }
    }
    let pNew = pout.join('/');
    if (addSlash) {
        pNew += '/';
    }
    pNew = pPrefix + pNew;
    return pNew;
};

export function isFloat(num: number): boolean {
    return Number(num) === num && num % 1 !== 0;
}

const shared_buffer = new ArrayBuffer(4);  // just enough bytes for 32-bit Array
const int_view = new Int32Array(shared_buffer);
const float_view = new Float32Array(shared_buffer);

function byte_2_relevant_bits(num: number): string {
    // extract bits 24 to 28 of the floating point number.
    // if all 1s or all 0s then it's close enough to a
    // float expressible as fraction with power of 2 denominator
    let out = '';
    for (let i = 10; i >= 4; i -= 1) {
        // noinspection JSBitwiseOperatorUsage
        out += (num & (1 << i)) ? '1' : '0';  // eslint-disable-line no-bitwise
    }
    return out;
}

function is_power_of_2_denominator(num: number): boolean {
    float_view[0] = num;
    const float_as_int = int_view[0];  // magic conversion
    const out_bits = byte_2_relevant_bits(float_as_int);
    if (out_bits === '1111111' || out_bits === '0000000') {
        return true;
    }
    return false;
}

/**
 * Returns either the original number (never a fraction, since js does not have them)
 * or the slightly rounded, correct representation.
 *
 * Uses a shared memory buffer to give the conversion (in is_power_of_2_denominator)
 */
export function opFrac(num: number): number {
    if (num === Math.floor(num)) {
        return num;
    }
    if (num * 1024 === Math.floor(num * 1024)) {
        return num;
    }
    if (is_power_of_2_denominator(num)) {
        return parseFloat(num.toPrecision(6));
    } else if (num < 0.0000011) {
        // leading zeros don't pass with is_power_of_2_denominator
        return 0;
    } else {
        return num;
    }
}

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
export function to_el<T extends Element=HTMLElement>(input_string: string): T {
    const template = document.createElement('template');
    input_string = input_string.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = input_string;
    return template.content.firstElementChild as T;
}

/**
 * Sleep for some time in milliseconds.
 */
export function sleep(ms: number): Promise<number> {
    return new Promise(resolve => window.setTimeout(resolve, ms));
}
