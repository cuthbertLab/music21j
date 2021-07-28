/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/vfShow -- Vexflow integration
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 * for rendering vexflow. Will eventually go to music21/converter/vexflow
 *
 * See {@link music21.vfShow} namespace for details
 *
 * @namespace music21.vfShow
 * @memberof music21
 * @requires music21.common
 * @requires vexflow
 * @exports music21.vfShow
 */
import Vex from 'vexflow';
import * as stream from './stream';
/**
 * Represents a stack of objects that need to be rendered together.
 *
 * An intermediary state for showing created by {@link music21.vfShow.Renderer}.
 *
 * @class RenderStack
 * @memberof music21.vfShow
 * @property {Stream[]} streams - {@link Stream} objects
 * associated with the voices
 * @property {Array<Vex.Flow.Voice>} voices - Vex.Flow.Voice objects
 * @property {Array} textVoices - Vex.Flow.Voice objects for the text.
 */
export declare class RenderStack {
    streams: stream.Stream[];
    voices: Vex.Flow.Voice[];
    textVoices: Vex.Flow.Voice[];
    voiceToStreamMapping: Map<any, any>;
    /**
     * @returns {Array} this.voices and this.textVoices as one array
     */
    allTickables(): Vex.Flow.Voice[];
    /**
     * @returns {Array<Array>} each array represents one staff....
     * where this.voices and this.textVoices are all in that staff...
     */
    tickablesByStave(): any[];
}
/**
 * Renderer is a function that takes a stream, an
 * optional existing canvas or SVG element and a DOM
 * element where the canvas or SVG element should be placed
 * and renders the stream as Vexflow on the
 * canvas or svg element, placing it then in the where
 * DOM.
 *
 * "s" can be any type of Stream.
 *
 * "div" and "where" can be either a DOM
 * element or a jQuery object.
 *
 * @class Renderer
 * @memberof music21.vfShow
 * @param {Stream} s - main stream to render
 * @param {div} [div] - existing canvas or div-surroundingSVG element
 * @param {Node|jQuery} [where=document.body] - where to render the stream
 * @property {Vex.Flow.Renderer} vfRenderer - a Vex.Flow.Renderer to use
 * (will create if not existing)
 * @property {string} rendererType - canvas or svg
 * @property ctx - a Vex.Flow.SVGContext or Vex.Flow.CanvasContext to use.
 * @property {div} div - div-with-svg-or-canvas element
 * @property {jQuery} $div - jQuery div or canvas element
 * @property {jQuery} $where - jQuery element to render onto
 * @property {Vex.Flow.Formatter} activeFormatter - formatter
 * @property {Array<Vex.Flow.Beam>} beamGroups - beamGroups
 * @property {Array<Vex.Flow.StaveTie>} vfTies - ties as instances of Vex.Flow.StaveTie
 * @property {Array<number>} systemBreakOffsets - where to break the systems
 * @property {Array<Vex.Flow.Tuplet>} vfTuplets - tuplets represented in Vexflow
 * @property {Array<music21.vfShow.RenderStack>} stacks - array of RenderStack objects
 */
export declare class Renderer {
    stream: stream.Stream;
    rendererType: string;
    div: any;
    $div: any;
    $where: any;
    activeFormatter: any;
    _vfRenderer: any;
    _ctx: any;
    beamGroups: any[];
    stacks: any[];
    vfTies: any[];
    systemBreakOffsets: any[];
    vfTuplets: any[];
    constructor(s: any, div?: any, where?: any);
    get vfRenderer(): any;
    set vfRenderer(vfr: any);
    get ctx(): any;
    set ctx(ctx: any);
    /**
     *
     * main function to render a Stream.
     *
     * if s is undefined, uses the stored Stream from
     * the constructor object.
     *
     * @param {Stream} [s=this.stream]
     */
    render(s?: stream.Stream): void;
    /**
     * Prepares a scorelike stream (i.e., one with parts or
     * Streams that should be rendered vertically like parts)
     * for rendering and adds Staff Connectors
     *
     * @param {music21.stream.Score} s - prepare a stream of parts (i.e., Score)
     */
    prepareScorelike(s: stream.Score): void;
    /**
     *
     * Prepares a Partlike stream (that is one with Measures
     * or substreams that should be considered like Measures)
     * for rendering.
     *
     * @param {music21.stream.Part} p
     */
    preparePartlike(p: stream.Part): void;
    /**
     *
     * Prepares a score that arrived flat... sets up
     * stacks and vfTies after calling prepareFlat
     *
     * @param {Stream} m - a flat stream (maybe a measure or voice)
     */
    prepareArrivedFlat(m: stream.Stream): void;
    /**
     *
     * Prepares a measure (w/ or w/o voices) or generic Stream -- makes accidentals,
     * associates a Vex.Flow.Stave with the stream and
     * returns a vexflow Voice object
     *
     * @param {music21.stream.Measure} m - a measure object (w or w/o voices)
     * @param {music21.vfShow.RenderStack} stack - a RenderStack object to prepare into.
     */
    prepareMeasure(m: any, stack: any): any;
    /**
     * Main internal routine to prepare a flat stream
     *
     * @param {Stream} s - a flat stream object
     * @param {music21.vfShow.RenderStack} stack - a RenderStack object to prepare into.
     * @param {Vex.Flow.Stave} [optionalStave] - an optional existing stave.
     * @param {Object} [optional_renderOp] - render options.
     * Passed to {@link music21.vfShow.Renderer#renderStave}
     * @returns {Vex.Flow.Stave} staff to return too
     * (also changes the `stack` parameter and runs `makeNotation` on s)
     */
    prepareFlat(s: any, stack: any, optionalStave?: any, optional_renderOp?: any): any;
    /**
     * Render the Vex.Flow.Stave from a flat stream and draws it.
     *
     * Just draws the stave, not the notes, etc.
     *
     * @param {Stream} [m=this.stream] - a flat stream
     * @param {Object} [optional_rendOp] - render options, passed
     * to {@link music21.vfShow.Renderer#newStave} and {@link music21.vfShow.Renderer#setClefEtc}
     * @returns {Vex.Flow.Stave} stave
     */
    renderStave(m?: any, optional_rendOp?: any): any;
    /**
     * Draws the Voices (music and text) from `this.stacks`
     *
     */
    drawMeasureStacks(): void;
    /**
     * draws the tuplets.
     *
     */
    drawTuplets(): void;
    /**
     * draws the vfTies
     *
     */
    drawTies(): void;
    /**
     * Finds all tied notes and creates the proper Vex.Flow.StaveTie objects in
     * `this.vfTies`.
     *
     * @param {Stream} p - a Part or similar object
     */
    prepareTies(p: stream.Stream): void;
    /**
     * Returns a Vex.Flow.Voice object with all the tickables (i.e., Notes, Voices, etc.)
     *
     * Does not draw it...
     *
     * @param {Stream} [s=this.stream] -- usually a Measure or Voice
     * @param {Vex.Flow.Stave} stave - not optional (would never fly in Python...)
     * @returns {Vex.Flow.Voice}
     */
    getVoice(s: stream.Stream, stave: any): any;
    /**
     * Returns a Vex.Flow.Voice with the lyrics set to render in the proper place.
     *
     * @param {Stream} s -- usually a Measure or Voice
     * @param {Vex.Flow.Stave} stave
     * @returns {Vex.Flow.Voice}
     */
    getLyricVoice(s: any, stave: any): any;
    /**
     * Aligns all of `this.stacks` (after they've been prepared) so they align properly.
     *
     */
    formatMeasureStacks(): void;
    /**
     * Formats a single voice group from a stack.
     *
     * @param {music21.vfShow.RenderStack} stack
     * @param {boolean} [autoBeam=measures[0].autoBeam]
     * @returns {Vex.Flow.Formatter}
     */
    formatVoiceGroup(stack: any, autoBeam?: boolean): any;
    /**
     * Draws the beam groups.
     *
     */
    drawBeamGroups(): void;
    /**
     * Return a new Vex.Flow.Stave object, which represents
     * a single MEASURE of notation in m21j
     *
     * @param {Stream} s
     * @param {Object} [rendOp]
     * @returns {Vex.Flow.Stave}
     */
    newStave(s: any, rendOp: any): any;
    /**
     * Sets the number of stafflines, puts the clef on the Stave,
     * adds keySignature, timeSignature, and rightBarline
     *
     * @param {Stream} s
     * @param {Vex.Flow.Stave} stave
     * @param {Object} [rendOp=s.renderOptions] - a {@link music21.renderOptions.RenderOptions}
     * object that might have
     * `{showMeasureNumber: boolean, rightBarLine: string<{'single', 'double', 'end'}>}`
     */
    setClefEtc(s: any, stave: any, rendOp: any): void;
    /**
     * Sets the number of stafflines properly for the Stave object.
     *
     * This method does not just set Vex.Flow.Stave#setNumLines() except
     * if the number of lines is 0 or >=4, because the default in VexFlow is
     * to show the bottom(top?), not middle, lines and that looks bad.
     *
     * @param {Stream} s - stream to get the `.staffLines`
     * from `s.renderOptions` from -- should allow for overriding.
     * @param {Vex.Flow.Stave} vexflowStave - stave to set the staff lines for.
     */
    setStafflines(s: any, vexflowStave: any): void;
    /**
     * Gets the Vex.Flow.StaveNote objects from a Stream.
     *
     * Also changes `this.vfTuplets`.
     *
     * @param {Stream} [s=this.stream] - flat stream to find notes in
     * @param {Vex.Flow.Stave} stave - Vex.Flow.Stave to render notes on to.
     * @returns {Array<Vex.Flow.StaveNote>} notes to return
     */
    vexflowNotes(s: any, stave: any): any[];
    /**
     * Gets an Array of `Vex.Flow.TextNote` objects from any lyrics found in s
     *
     * @param {Stream} s - flat stream to search.
     * @param {Vex.Flow.Stave} stave
     * @returns {Array<Vex.Flow.TextNote>}
     */
    vexflowLyrics(s: any, stave: any): any[];
    /**
     * Creates a Vex.Flow.Voice of the appropriate length given a Stream.
     */
    vexflowVoice(s: stream.Stream): Vex.Flow.Voice;
    staffConnectorsMap(connectorType: any): any;
    /**
     * If a stream has parts (NOT CHECKED HERE) create and
     * draw an appropriate Vex.Flow.StaveConnector
     *
     * @param {music21.stream.Score} s
     */
    addStaffConnectors(s: any): void;
    /**
     * The process of putting a Stream onto a div affects each of the
     * elements in the Stream by adding pieces of information to
     * each {@link Music21Object} -- see `applyFormatterInformationToNotes`
     *
     * You might want to remove this information; this routine does that.
     *
     * @param {Stream} s - can have parts, measures, etc.
     * @param {boolean} [recursive=false]
     */
    removeFormatterInformation(s: any, recursive?: boolean): void;
    /**
     * Adds the following pieces of information to each Note
     *
     * - el.x -- x location in pixels
     * - el.y -- y location in pixels
     * - el.width - width of element in pixels.
     * - el.systemIndex -- which system is it on
     * - el.activeVexflowNote - which Vex.Flow.StaveNote is it connected with.
     *
     * mad props to our friend Vladimir Viro for figuring this out! Visit http://peachnote.com/
     *
     * Also sets s.storedVexflowStave to stave.
     *
     * @param {Vex.Flow.Stave} stave
     * @param {Stream} [s=this.stream]
     * @param {Vex.Flow.Formatter} formatter
     */
    applyFormatterInformationToNotes(stave: Vex.Flow.Stave, s?: stream.Stream, formatter?: any): void;
}
//# sourceMappingURL=vfShow.d.ts.map