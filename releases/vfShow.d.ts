/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/vfShow -- Vexflow integration
 *
 * Copyright (c) 2013-21, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 * for rendering vexflow. Will eventually go to music21/converter/vexflow
 */
/// <reference types="jquery" />
import Vex from 'vexflow';
import * as stream from './stream';
import type * as renderOptions from './renderOptions';
/**
 * Represents a stack of objects that need to be rendered together.
 *
 * An intermediary state for showing created by music21.vfShow.Renderer.
 *
 * streams - are objects associated with the voices
 */
export declare class RenderStack {
    streams: stream.Stream[];
    voices: Vex.Flow.Voice[];
    textVoices: Vex.Flow.Voice[];
    voiceToStreamMapping: Map<Vex.Flow.Voice, stream.Stream>;
    /**
     * returns this.voices and this.textVoices as one array
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
 * @param {Stream} s - main stream to render
 * @param {div} [div] - existing canvas or div-surroundingSVG element
 * @param {Node|jQuery} [where=document.body] - where to render the stream
 * @property {div} div - div-with-svg-or-canvas element
 * @property {jQuery} $div - jQuery div or canvas element
 * @property {jQuery} $where - jQuery element to render onto
 * @property {Array<number>} systemBreakOffsets - where to break the systems
 */
export declare class Renderer {
    stream: stream.Stream;
    rendererType: string;
    div: HTMLElement;
    $div: JQuery;
    $where: JQuery;
    activeFormatter: Vex.Flow.Formatter;
    _vfRenderer: Vex.Flow.Renderer;
    _ctx: Vex.Flow.SVGContext;
    beamGroups: Vex.Flow.Beam[];
    stacks: RenderStack[];
    vfTies: Vex.Flow.StaveTie[];
    systemBreakOffsets: number[];
    vfTuplets: Vex.Flow.Tuplet[];
    constructor(s: any, div?: HTMLElement | JQuery, where?: HTMLElement | JQuery);
    get vfRenderer(): Vex.Flow.Renderer;
    set vfRenderer(vfr: Vex.Flow.Renderer);
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
     */
    prepareScorelike(s: stream.Score): void;
    /**
     *
     * Prepares a Partlike stream (that is one with Measures
     * or substreams that should be considered like Measures)
     * for rendering.
     */
    preparePartlike(p: stream.Part, { multipart }?: {
        multipart?: boolean;
    }): void;
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
     * * m - a measure object (w or w/o voices)
     * * stack - a RenderStack object to prepare into.
     */
    prepareMeasure(m: stream.Measure, stack: RenderStack): RenderStack;
    /**
     * Main internal routine to prepare a flat stream
     *
     * s - a flat stream object
     * optionalStave - an optional existing stave.
     * optional_renderOp - renderOptions passed to music21.vfShow.Renderer#renderStave
     * returns Vex.Flow.Stave staff to return too
     *
     * (also changes the `stack` parameter and runs `makeNotation` on s
     * with overrideStatus: true to update accidental display)
     */
    prepareFlat(s: stream.Stream, stack: RenderStack, optionalStave?: Vex.Flow.Stave, optional_renderOp?: renderOptions.RenderOptions): Vex.Flow.Stave;
    /**
     * Render the Vex.Flow.Stave from a flat stream and draws it.
     *
     * Just draws the stave, not the notes, etc.
     *
     * m should be a flat stream: if undefined, this.stream is used.
     * optional_rendOp - renderOptions, passed to Renderer#newStave
     * and Renderer#setClefEtc
     */
    renderStave(m?: stream.Stream, optional_rendOp?: renderOptions.RenderOptions): Vex.Flow.Stave;
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
     * [s=this.stream] -- usually a Measure or Voice
     * stave - not actually optional.
     */
    getVoice(s?: stream.Stream, stave?: Vex.Flow.Stave): Vex.Flow.Voice | undefined;
    /**
     * Returns Vex.Flow.Voices with the lyrics set to render in the proper place.
     *
     * s -- usually a Measure or Voice
     */
    getLyricVoices(s: stream.Stream, stave: Vex.Flow.Stave): Vex.Flow.Voice[];
    /**
     * Aligns all of `this.stacks` (after they've been prepared) so they align properly.
     *
     */
    formatMeasureStacks(): void;
    /**
     * Formats a single voice group from a stack.
     *
     * if autoBeam is undefined, reads from measures[0].autoBeam]
     */
    formatVoiceGroup(stack: RenderStack, autoBeam?: boolean | undefined): Vex.Flow.Formatter;
    /**
     * Draws the beam groups.
     *
     */
    drawBeamGroups(): void;
    /**
     * Return a new Vex.Flow.Stave object, which represents
     * a single MEASURE of notation in m21j
     */
    newStave(s?: stream.Stream, rendOp?: renderOptions.RenderOptions): Vex.Flow.Stave;
    /**
     * Sets the number of stafflines, puts the clef on the Stave,
     * adds keySignature, timeSignature, and rightBarline
     *
     * RenderOptions object might have
     * `{showMeasureNumber: boolean, rightBarLine/leftBarline: string<{'single', 'double', 'end', 'none'}>}`
     */
    setClefEtc(s: stream.Stream, stave: Vex.Flow.Staves, rendOp?: renderOptions.RenderOptions): void;
    /**
     * Sets the number of stafflines properly for the Stave object.
     *
     * This method does not just set Vex.Flow.Stave#setNumLines() except
     * if the number of lines is 0 or >=4, because the default in VexFlow is
     * to show the bottom(top?), not middle, lines and that looks bad.
     *
     * s - stream to get the `.staffLines`
     * from `s.renderOptions` from -- should allow for overriding.
     *
     * vexflowStave is the Stave to set lines for.
     */
    setStafflines(s: stream.Stream, vexflowStave: Vex.Flow.Stave): void;
    /**
     * Gets the Vex.Flow.StaveNote objects from a Stream.
     *
     * Also changes `this.vfTuplets`.
     */
    vexflowNotes(s?: stream.Stream, stave?: Vex.Flow.Stave): Vex.Flow.StaveNote[];
    /**
     * Gets an Array of `Vex.Flow.TextNote` objects from any lyrics found in s at a given lyric depth.
     */
    vexflowLyrics(s?: stream.Stream, stave?: Vex.Flow.Stave, depth?: number): Vex.Flow.TextNote[];
    /**
     * Creates a Vex.Flow.Voice of the appropriate length given a Stream.
     */
    vexflowVoice(s: stream.Stream): Vex.Flow.Voice;
    staffConnectorsMap(connectorType: any): any;
    /**
     * If a stream has parts (NOT CHECKED HERE) create and
     * draw an appropriate Vex.Flow.StaveConnector
     */
    addStaffConnectors(s?: stream.Score): void;
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
     */
    applyFormatterInformationToNotes(stave: Vex.Flow.Stave, s?: stream.Stream, formatter?: Vex.Flow.Formatter): void;
}
//# sourceMappingURL=vfShow.d.ts.map