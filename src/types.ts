import type {Music21Object} from './base';

export type ClassFilterType = string|string[]|typeof Music21Object|(typeof Music21Object)[]

export enum StaveConnector {
    SINGLE = 'single',
    DOUBLE = 'double',
    BRACE = 'brace',
    BRACKET = 'bracket',
}
