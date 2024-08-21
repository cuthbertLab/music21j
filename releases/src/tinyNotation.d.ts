import * as stream from './stream';
/**
 * **Function, not class**.
 *
 * Converts a TinyNotation String into a music21 Stream
 *
 * See music21p for examples of what can go into tinyNotation. It's an
 * adaptation of Lilypond format, by design Extremely simple!
 *
 * * textIn - a valid tinyNotation string
 *
 * * returns {music21.stream.Part|music21.stream.Score} - a Part object or Score (if multiple parts)
 *
 * @example
 * var t = "3/4 c4 B8 c d4 e2.";
 * var p = music21.tinyNotation.TinyNotation(t);
 * p.duration.quarterLength;
 * // 6.0
 */
export declare function TinyNotation(textIn: string): stream.Part | stream.Score;
/**
 * Render all the TinyNotation classes in the DOM as notation
 *
 * Called automatically when music21 is loaded.  TODO -- stop that!
 *
 * @param {string} [classTypes='.music21.tinyNotation'] - a JQuery selector to find elements to replace.
 * @param {HTMLElement|jQuery} [selector]
 */
export declare function renderNotationDivs(classTypes?: string, selector?: HTMLElement | string): void;
//# sourceMappingURL=tinyNotation.d.ts.map