export declare function runConfiguration(): void;
export declare function getBasePath(): string;
export declare function fixUrls(conf: any): void;
/**
 * @returns undefined
 */
export declare function renderHTML(): void;
export declare function loadDefaultSoundfont(conf: any): void;
/**
 * Find the configuration as a JSON-encoded m21conf attribute on the script tag.
 */
export declare function loadConfiguration(): Record<string, any>;
/**
 *
 * @param {string} [attribute=m21conf]
 * @returns {undefined|*|string}
 */
export declare function getM21attribute(attribute?: string): string;
//# sourceMappingURL=parseLoader.d.ts.map