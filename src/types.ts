import type {Music21Object} from './base';

// note: mixing both string and types in a list is not supported.
export type ClassFilterType = string|string[]|(new() => Music21Object)|(new() => Music21Object)[]

export enum StaveConnector {
    SINGLE = 'single',
    DOUBLE = 'double',
    BRACE = 'brace',
    BRACKET = 'bracket',
}
