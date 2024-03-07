/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/vfShow -- Vexflow integration
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 * for rendering vexflow. Will eventually go to music21/converter/vexflow
 */
/// <reference types="jquery" />
/// <reference types="jquery" />
import { Beam as VFBeam, Formatter as VFFormatter, Renderer as VFRenderer, Stave as VFStave, type StaveConnectorType as VFStaveConnectorType, StaveNote as VFStaveNote, StaveTie as VFStaveTie, SVGContext as VFSVGContext, // TextNote as VFTextNote,
Tuplet as VFTuplet, Voice as VFVoice } from 'vexflow';
import * as stream from './stream';
import type * as renderOptions from './renderOptions';
import { StaveConnector } from './types';
export declare const vexflowDefaults: {
    softmaxFactor: number;
};
/**
 * Represents a stack of objects that need to be rendered together.
 *
 * An intermediary state for showing created by music21.vfShow.Renderer.
 *
 * streams - are objects associated with the voices
 */
export declare class RenderStack {
    streams: stream.Stream[];
    voices: VFVoice[];
    voiceToStreamMapping: Map<VFVoice, stream.Stream>;
    /**
     * returns this.voices as a new array
     */
    allTickables(): VFVoice[];
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
 * "div" and "where" should be a DOM element.
 *
 * @param {Stream} s - main stream to render
 * @param {div} [div] - existing canvas or div-surroundingSVG element
 * @param {HTMLElement} [where=document.body] - where to render the stream
 * @property {div} div - div-with-svg-or-canvas element
 * @property {HTMLElement} where - HTMLElement to render onto
 * @property {Array<number>} systemBreakOffsets - where to break the systems
 */
export declare class Renderer {
    stream: stream.Stream;
    rendererType: string;
    div: HTMLElement;
    where: HTMLElement;
    activeFormatter: VFFormatter;
    _vfRenderer: VFRenderer;
    _ctx: VFSVGContext;
    beamGroups: VFBeam[];
    stacks: RenderStack[];
    vfTies: VFStaveTie[];
    systemBreakOffsets: number[];
    vfTuplets: VFTuplet[];
    constructor(s: stream.Stream, div?: HTMLElement, where?: HTMLElement | JQuery);
    get vfRenderer(): VFRenderer;
    set vfRenderer(vfr: VFRenderer);
    get ctx(): VFSVGContext;
    set ctx(ctx: VFSVGContext);
    /**
     *
     * main function to render a Stream.
     *
     * if s is undefined, uses the stored Stream from
     * the constructor object.
     */
    render(): void;
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
    prepareMeasure(m: stream.Stream, stack: RenderStack): RenderStack;
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
    prepareFlat(s: stream.Stream, stack: RenderStack, optionalStave?: VFStave, optional_renderOp?: renderOptions.RenderOptions): VFStave;
    /**
     * Render the Vex.Flow.Stave from a flat stream and draws it.
     *
     * Just draws the stave, not the notes, etc.
     *
     * m should be a flat stream: if undefined, this.stream is used.
     * optional_rendOp - renderOptions, passed to Renderer#newStave
     * and Renderer#setClefEtc
     */
    renderStave(m?: stream.Stream, optional_rendOp?: renderOptions.RenderOptions): VFStave;
    /**
     * Draws the Voices (just music no longer text) from `this.stacks`
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
    getVoice(s?: stream.Stream, stave?: VFStave): VFVoice | undefined;
    /**
     * Returns Vex.Flow.Voices with the lyrics set to render in the proper place.
     *
     * s -- usually a Measure or Voice
     */
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
    formatVoiceGroup(stack: RenderStack, autoBeam?: boolean | undefined): VFFormatter;
    /**
     * Draws the beam groups.
     *
     */
    drawBeamGroups(): void;
    /**
     * Return a new Vex.Flow.Stave object, which represents
     * a single MEASURE of notation in m21j
     */
    newStave(s?: stream.Stream, rendOp?: renderOptions.RenderOptions): VFStave;
    /**
     * Sets the number of stafflines, puts the clef on the Stave,
     * adds keySignature, timeSignature, and rightBarline
     *
     * RenderOptions object might have
     * `{showMeasureNumber: boolean, rightBarLine/leftBarline: string<{'single', 'double', 'end', 'none'}>}`
     */
    setClefEtc(s: stream.Stream, stave: VFStave, rendOp?: renderOptions.RenderOptions): void;
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
    setStafflines(s: stream.Stream, vexflowStave: VFStave): void;
    /**
     * Gets the Vex.Flow.StaveNote objects from a Stream.
     *
     * Also changes `this.vfTuplets`.
     */
    vexflowNotes(s?: stream.Stream, stave?: VFStave): VFStaveNote[];
    /**
     * Creates a Vex.Flow.Voice of the appropriate length given a Stream.
     */
    vexflowVoice(s: stream.Stream): VFVoice;
    staffConnectorsMap(connectorType: StaveConnector): VFStaveConnectorType;
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
     */
    removeFormatterInformation(s: stream.Stream, recursive?: boolean): void;
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
    applyFormatterInformationToNotes(stave: VFStave, s?: stream.Stream, formatter?: VFFormatter): void;
}
//# sourceMappingURL=vfShow.d.ts.map