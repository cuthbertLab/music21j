/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/vfShow -- Vexflow integration
 *
 * Copyright (c) 2013-17, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–17, Michael Scott Cuthbert and cuthbertLab
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

import * as $ from 'jquery';
import Vex from 'vexflow';

import { debug } from './debug';
import * as clef from './clef';
import * as duration from './duration';

const _clefSingleton = new clef.TrebleClef();

/**
 * Represents a stack of objects that need to be rendered together.
 *
 * An intermediary state for showing created by {@link music21.vfShow.Renderer}.
 *
 * @class RenderStack
 * @memberof music21.vfShow
 * @property {Array<Vex.Flow.Voice>} voices - Vex.Flow.Voice objects
 * @property {Array<music21.stream.Stream>} streams - {@link music21.stream.Stream} objects
 * associated with the voices
 * @property {Array} textVoices - Vex.Flow.Voice objects for the text.
 */
export class RenderStack {
    constructor() {
        this.voices = [];
        this.streams = [];
        this.textVoices = [];
        this.voiceToStreamMapping = new Map();
    }

    /**
     * @returns {Array} this.voices and this.textVoices as one array
     */
    allTickables() {
        const t = [];
        t.push(...this.voices);
        t.push(...this.textVoices);
        return t;
    }

    /**
     * @returns {Array<Array>} each array represents one staff....
     * where this.voices and this.textVoices are all in that staff...
     */
    tickablesByStave() {
        const tickablesByStave = []; // a list of lists of tickables being placed on the same Stave.
        const knownStaves = []; // a list of Vex.Flow.Stave objects...

        for (const t of this.allTickables()) {
            const thisStaveIndex = knownStaves.indexOf(t.stave);
            let currentStaveHolder;
            if (thisStaveIndex === -1) {
                knownStaves.push(t.stave);
                currentStaveHolder = [];
                tickablesByStave.push(currentStaveHolder);
            } else {
                currentStaveHolder = tickablesByStave[thisStaveIndex];
            }
            currentStaveHolder.push(t);
        }
        return tickablesByStave;
    }
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
 * @param {music21.stream.Stream} s - main stream to render
 * @param {div} [div] - existing canvas or div-surroundingSVG element
 * @param {Node|jQuery} [where=document.body] - where to render the stream
 * @property {Vex.Flow.Renderer} vfRenderer - a Vex.Flow.Renderer to use
 * (will create if not existing)
 * @property {string} rendererType - canvas or svg
 * @property {Vex.Flow.Context} ctx - a Vex.Flow.Context (Canvas or SVG) to use.
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
export class Renderer {
    constructor(s, div, where) {
        this.stream = s;
        // this.streamType = s.classes[-1];
        this.rendererType = 'svg';

        this.div = undefined;
        this.$div = undefined;
        this.$where = undefined;
        this.activeFormatter = undefined;
        this._vfRenderer = undefined;
        this._ctx = undefined;
        this.beamGroups = [];
        this.stacks = []; // an Array of RenderStacks: {voices: [Array of Vex.Flow.Voice objects],
        //                                           streams: [Array of Streams, usually Measures]}
        this.vfTies = [];
        this.systemBreakOffsets = [];
        this.vfTuplets = [];
        // this.measureFormatters = [];
        if (where !== undefined) {
            if (where.jquery !== undefined) {
                this.$where = where;
            } else {
                this.$where = $(where);
            }
        }
        if (div !== undefined) {
            if (div.jquery !== undefined) {
                this.$div = div;
                this.div = div[0];
            } else {
                this.div = div;
                this.$div = $(div);
            }
        }
    }

    get vfRenderer() {
        let backend;
        if (this.rendererType === 'canvas') {
            backend = Vex.Flow.Renderer.Backends.CANVAS;
        } else {
            backend = Vex.Flow.Renderer.Backends.SVG;
        }

        if (this._vfRenderer !== undefined) {
            return this._vfRenderer;
        } else {
            this._vfRenderer = new Vex.Flow.Renderer(this.div, backend);
            if (this.rendererType === 'svg') {
                this._vfRenderer.resize(
                    this.$div.attr('width'),
                    this.$div.attr('height')
                );
            }
            return this._vfRenderer;
        }
    }

    set vfRenderer(vfr) {
        this._vfRenderer = vfr;
    }

    get ctx() {
        if (this._ctx !== undefined) {
            return this._ctx;
        } else {
            this._ctx = this.vfRenderer.getContext();
            if (
                this.stream
                && this.stream.renderOptions
                && this.stream.renderOptions.scaleFactor.x
                && this.stream.renderOptions.scaleFactor.y
            ) {
                this._ctx.scale(
                    this.stream.renderOptions.scaleFactor.x,
                    this.stream.renderOptions.scaleFactor.y
                );
            }
            return this._ctx;
        }
    }

    set ctx(ctx) {
        this._ctx = ctx;
    }

    /**
     *
     * main function to render a Stream.
     *
     * if s is undefined, uses the stored Stream from
     * the constructor object.
     *
     * @param {music21.stream.Stream} [s=this.stream]
     */
    render(s) {
        if (s === undefined) {
            s = this.stream;
        }

        let isScorelike = false;
        let isPartlike = false;
        const isFlat = s.isFlat;

        if (s.isClassOrSubclass('Score')) {
            isScorelike = true;
        } else if (!isFlat && !s.get(0).isFlat) {
            isScorelike = true;
        } else if (!isFlat) {
            isPartlike = true;
        }
        // requires organization Score -> Part -> Measure -> elements...
        if (isScorelike) {
            this.prepareScorelike(s);
        } else if (isPartlike) {
            this.preparePartlike(s);
        } else {
            this.prepareArrivedFlat(s);
        }
        this.formatMeasureStacks();
        this.drawTies();
        this.drawMeasureStacks();
        this.drawBeamGroups();
        this.drawTuplets();
    }

    /**
     * Prepares a scorelike stream (i.e., one with parts or
     * Streams that should be rendered vertically like parts)
     * for rendering and adds Staff Connectors
     *
     * @param {music21.stream.Score} s - prepare a stream of parts (i.e., Score)
     */
    prepareScorelike(s) {
        // console.log('prepareScorelike called');
        //
        const parts = s.parts;
        for (const subStream of parts) {
            this.preparePartlike(subStream);
        }
        this.addStaffConnectors(s);
    }

    /**
     *
     * Prepares a Partlike stream (that is one with Measures
     * or substreams that should be considered like Measures)
     * for rendering.
     *
     * @param {music21.stream.Part} p
     */
    preparePartlike(p) {
        // console.log('preparePartlike called');
        this.systemBreakOffsets = [];
        const measureList = p.measures;
        for (let i = 0; i < measureList.length; i++) {
            const subStream = measureList.get(i);
            if (subStream.renderOptions.startNewSystem) {
                this.systemBreakOffsets.push(subStream.offset);
            }
            if (i === p.length - 1) {
                subStream.renderOptions.rightBarline = 'end';
            }
            if (this.stacks[i] === undefined) {
                this.stacks[i] = new RenderStack();
            }
            this.prepareMeasure(subStream, this.stacks[i]);
        }
        this.prepareTies(p);
    }

    /**
     *
     * Prepares a score that arrived flat... sets up
     * stacks and vfTies after calling prepareFlat
     *
     * @param {music21.stream.Stream} m - a flat stream (maybe a measure or voice)
     */
    prepareArrivedFlat(m) {
        const stack = new RenderStack();
        this.prepareMeasure(m, stack);
        this.stacks[0] = stack;
        this.prepareTies(m);
    }

    /**
     *
     * Prepares a measure (w/ or w/o voices) or generic Stream -- makes accidentals,
     * associates a Vex.Flow.Stave with the stream and
     * returns a vexflow Voice object
     *
     * @param {music21.stream.Measure} m - a measure object (w or w/o voices)
     * @param {music21.vfShow.RenderStack} stack - a RenderStack object to prepare into.
     */
    prepareMeasure(m, stack) {
        if (m.hasVoices === undefined || m.hasVoices() === false) {
            this.prepareFlat(m, stack);
        } else {
            // get elements outside of voices;
            const firstVoiceCopy = m.getElementsByClass('Voice').get(0).clone(false);
            for (const el of m.getElementsNotOfClass('Voice')) {
                firstVoiceCopy.insert(el.offset, el);
            }
            const rendOp = m.renderOptions; // get render options from Measure;
            let stave;
            for (const [i, voiceStream] of Array.from(m.getElementsByClass('Voice')).entries()) {
                let voiceToRender = voiceStream;
                if (i === 0) {
                    voiceToRender = firstVoiceCopy;
                }
                stave = this.prepareFlat(voiceToRender, stack, stave, rendOp);
                if (i === 0) {
                    voiceStream.activeVFStave = voiceToRender.activeVFStave;
                    voiceStream.storedVexflowStave = voiceToRender.activeVFStave;
                }
            }
        }
        return stack;
    }

    /**
     * Main internal routine to prepare a flat stream
     *
     * @param {music21.stream.Stream} s - a flat stream object
     * @param {music21.vfShow.RenderStack} stack - a RenderStack object to prepare into.
     * @param {Vex.Flow.Stave} [optionalStave] - an optional existing stave.
     * @param {Object} [optional_renderOp] - render options.
     * Passed to {@link music21.vfShow.Renderer#renderStave}
     * @returns {Vex.Flow.Stave} staff to return too
     * (also changes the `stack` parameter and runs `makeNotation` on s)
     */
    prepareFlat(s, stack, optionalStave, optional_renderOp) {
        s.makeNotation();
        let stave;
        if (optionalStave !== undefined) {
            stave = optionalStave;
        } else {
            stave = this.renderStave(s, optional_renderOp);
        }
        s.activeVFStave = stave;
        const vf_voice = this.getVoice(s, stave);
        stack.voices.push(vf_voice);
        stack.streams.push(s);
        stack.voiceToStreamMapping.set(vf_voice, s);

        if (s.hasLyrics()) {
            stack.textVoices.push(this.getLyricVoice(s, stave));
        }

        return stave;
    }

    /**
     * Render the Vex.Flow.Stave from a flat stream and draws it.
     *
     * Just draws the stave, not the notes, etc.
     *
     * @param {music21.stream.Stream} [m=this.stream] - a flat stream
     * @param {Object} [optional_rendOp] - render options, passed
     * to {@link music21.vfShow.Renderer#newStave} and {@link music21.vfShow.Renderer#setClefEtc}
     * @returns {Vex.Flow.Stave} stave
     */
    renderStave(m, optional_rendOp) {
        if (m === undefined) {
            m = this.stream;
        }
        const ctx = this.ctx;
        // stave will be passed in from Measure when we have Voices
        const stave = this.newStave(m, optional_rendOp);

        this.setClefEtc(m, stave, optional_rendOp);
        stave.setContext(ctx);
        stave.draw();
        return stave;
    }

    /**
     * Draws the Voices (music and text) from `this.stacks`
     *
     */
    drawMeasureStacks() {
        const ctx = this.ctx;
        for (let i = 0; i < this.stacks.length; i++) {
            const voices = this.stacks[i].allTickables();
            for (let j = 0; j < voices.length; j++) {
                const v = voices[j];
                v.draw(ctx);
            }
        }
    }

    /**
     * draws the tuplets.
     *
     */
    drawTuplets() {
        const ctx = this.ctx;
        this.vfTuplets.forEach(vft => {
            vft.setContext(ctx).draw();
        });
    }

    /**
     * draws the vfTies
     *
     */
    drawTies() {
        const ctx = this.ctx;
        for (let i = 0; i < this.vfTies.length; i++) {
            this.vfTies[i].setContext(ctx).draw();
        }
    }

    /**
     * Finds all tied notes and creates the proper Vex.Flow.StaveTie objects in
     * `this.vfTies`.
     *
     * @param {music21.stream.Stream} p - a Part or similar object
     */
    prepareTies(p) {
        const pf = p.flat.notesAndRests;
        // console.log('newSystemsAt', this.systemBreakOffsets);
        for (let i = 0; i < pf.length - 1; i++) {
            const thisNote = pf.get(i);
            if (thisNote.tie === undefined || thisNote.tie.type === 'stop') {
                continue;
            }
            const nextNote = pf.get(i + 1);
            let onSameSystem = true;
            // this.systemBreakOffsets.length will be 0 for a flat score
            for (let sbI = 0; sbI < this.systemBreakOffsets.length; sbI++) {
                const thisSystemBreak = this.systemBreakOffsets[sbI];
                if (
                    thisNote.offset < thisSystemBreak
                    && nextNote.offset >= thisSystemBreak
                ) {
                    onSameSystem = false;
                    break;
                }
            }
            if (onSameSystem) {
                const vfTie = new Vex.Flow.StaveTie({
                    first_note: thisNote.activeVexflowNote,
                    last_note: nextNote.activeVexflowNote,
                    first_indices: [0],
                    last_indices: [0],
                });
                this.vfTies.push(vfTie);
            } else {
                // console.log('got me a tie across systemBreaks!');
                const vfTie1 = new Vex.Flow.StaveTie({
                    first_note: thisNote.activeVexflowNote,
                    first_indices: [0],
                });
                this.vfTies.push(vfTie1);
                const vfTie2 = new Vex.Flow.StaveTie({
                    last_note: nextNote.activeVexflowNote,
                    first_indices: [0],
                });
                this.vfTies.push(vfTie2);
            }
        }
    }

    /**
     * Returns a Vex.Flow.Voice object with all the tickables (i.e., Notes, Voices, etc.)
     *
     * Does not draw it...
     *
     * @param {music21.stream.Stream} [s=this.stream] -- usually a Measure or Voice
     * @param {Vex.Flow.Stave} stave - not optional (would never fly in Python...)
     * @returns {Vex.Flow.Voice}
     */
    getVoice(s, stave) {
        if (s === undefined) {
            s = this.stream;
        }

        // gets a group of notes as a voice, but completely unformatted and not drawn.
        const notes = this.vexflowNotes(s, stave);
        const voice = this.vexflowVoice(s);
        voice.setStave(stave);

        voice.addTickables(notes);
        return voice;
    }

    /**
     * Returns a Vex.Flow.Voice with the lyrics set to render in the proper place.
     *
     * @param {music21.stream.Stream} s -- usually a Measure or Voice
     * @param {Vex.Flow.Stave} stave
     * @returns {Vex.Flow.Voice}
     */
    getLyricVoice(s, stave) {
        const textVoice = this.vexflowVoice(s);
        const lyrics = this.vexflowLyrics(s, stave);
        textVoice.setStave(stave);
        textVoice.addTickables(lyrics);
        return textVoice;
    }

    /**
     * Aligns all of `this.stacks` (after they've been prepared) so they align properly.
     *
     */
    formatMeasureStacks() {
        // adds formats the voices, then adds the formatter information to every note in a voice...
        for (let i = 0; i < this.stacks.length; i++) {
            const stack = this.stacks[i];
            const vf_voices = stack.voices;
            const measuresOrVoices = stack.streams;
            const formatter = this.formatVoiceGroup(stack);
            for (let j = 0; j < measuresOrVoices.length; j++) {
                const m = measuresOrVoices[j];
                const v = vf_voices[j];
                this.applyFormatterInformationToNotes(v.stave, m, formatter);
            }
        }
    }

    /**
     * Formats a single voice group from a stack.
     *
     * @param {music21.vfShow.RenderStack} stack
     * @param {Boolean} [autoBeam=measures[0].autoBeam]
     * @returns {Vex.Flow.Formatter}
     */
    formatVoiceGroup(stack, autoBeam) {
        // formats a group of voices to use the same formatter; returns the formatter
        // if autoBeam is true then it will apply beams for each voice and put them in
        // this.beamGroups;
        const allTickables = stack.allTickables();
        const vf_voices = stack.voices;
        const measuresOrVoices = stack.streams;
        if (autoBeam === undefined) {
            autoBeam = measuresOrVoices[0].autoBeam;
        }

        const formatter = new Vex.Flow.Formatter();
        // var minLength = formatter.preCalculateMinTotalWidth([voices]);
        // console.log(minLength);
        if (vf_voices.length === 0) {
            return formatter;
        }
        let maxGlyphStart = 0; // find the stave with the farthest start point -- diff key sig, etc.
        for (let i = 0; i < allTickables.length; i++) {
            // console.log(voices[i], voices[i].stave, i);
            if (allTickables[i].stave.getNoteStartX() > maxGlyphStart) {
                maxGlyphStart = allTickables[i].stave.getNoteStartX();
            }
        }
        for (let i = 0; i < allTickables.length; i++) {
            allTickables[i].stave.setNoteStartX(maxGlyphStart); // corrected!
        }
        // TODO: should do the same for end_x -- for key sig changes, etc...

        const stave = vf_voices[0].stave; // all staves should be same length, so does not matter;
        const tickablesByStave = stack.tickablesByStave();
        for (const staveTickables of tickablesByStave) {
            formatter.joinVoices(staveTickables);
        }
        formatter.formatToStave(allTickables, stave);

        //        const vf_auto_stem = false;
        //        for (const voice of voices) {
        //            let activeBeamGroupNotes = [];
        //            for (let j = 0; j < voice.notes.length; j++) {
        //                const n = voice.notes[j];
        //                if (n.beams === undefined || !n.beams.getNumbers().includes(1)) {
        //                    continue;
        //                }
        //                const eighthNoteBeam = n.beams.getByNumber(1);
        //                if (eighthNoteBeam.type === 'start') {
        //                    activeBeamGroupNotes = [n];
        //                } else {
        //                    activeBeamGroupNotes.push(n);
        //                }
        //                if (eighthNoteBeam.type === 'stop') {
        //                    const vfBeam = new Vex.Flow.Beam(activeBeamGroupNotes, vf_auto_stem);
        //                    this.beamGroups.push(vfBeam);
        //                    activeBeamGroupNotes = []; // housekeeping, not really necessary...
        //                }
        //            }
        //        }

        if (autoBeam) {
            for (let i = 0; i < vf_voices.length; i++) {
                // find beam groups -- n.b. this wipes out stemDirection. worth it usually...
                const vf_voice = vf_voices[i];
                const associatedStream = stack.voiceToStreamMapping.get(vf_voice);
                let beatGroups;
                if (
                    associatedStream !== undefined
                    && associatedStream.getSpecialContext('timeSignature') !== undefined
                ) {
                    beatGroups = associatedStream.getSpecialContext('timeSignature').vexflowBeatGroups(
                        Vex
                    );
                    // TODO: getContextByClass...
                    // console.log(beatGroups);
                } else {
                    beatGroups = [new Vex.Flow.Fraction(2, 8)]; // default beam groups
                }
                const beamGroups = Vex.Flow.Beam.applyAndGetBeams(
                    vf_voice,
                    undefined,
                    beatGroups
                );
                this.beamGroups.push(...beamGroups);
            }
        }
        return formatter;
    }

    /**
     * Draws the beam groups.
     *
     */
    drawBeamGroups() {
        const ctx = this.ctx;
        for (let i = 0; i < this.beamGroups.length; i++) {
            this.beamGroups[i].setContext(ctx).draw();
        }
    }

    /**
     * Return a new Vex.Flow.Stave object, which represents
     * a single MEASURE of notation in m21j
     *
     * @param {music21.stream.Stream} s
     * @param {Object} [rendOp]
     * @returns {Vex.Flow.Stave}
     */
    newStave(s, rendOp) {
        if (s === undefined) {
            s = this.stream;
        }
        if (rendOp === undefined) {
            rendOp = s.renderOptions;
        }
        // measure level...
        let width = rendOp.width;
        if (width === undefined) {
            width = s.estimateStaffLength() + rendOp.staffPadding;
        }
        let top = rendOp.top; // * rendOp.scaleFactor.y;
        if (top === undefined) {
            top = 0;
        }
        let left = rendOp.left;
        if (left === undefined) {
            left = 10;
        }
        // console.log('streamLength: ' + streamLength);
        if (debug) {
            console.log(
                'creating new stave: left:'
                    + left
                    + ' top: '
                    + top
                    + ' width: '
                    + width
            );
        }
        const stave = new Vex.Flow.Stave(left, top, width);
        return stave;
    }

    /**
     * Sets the number of stafflines, puts the clef on the Stave,
     * adds keySignature, timeSignature, and rightBarline
     *
     * @param {music21.stream.Stream} s
     * @param {Vex.Flow.Stave} stave
     * @param {Object} [rendOp=s.renderOptions] - a {@link music21.renderOptions.RenderOptions}
     * object that might have
     * `{showMeasureNumber: boolean, rightBarLine: string<{'single', 'double', 'end'}>}`
     */
    setClefEtc(s, stave, rendOp) {
        if (rendOp === undefined) {
            rendOp = s.renderOptions;
        }


        let sClef = s.getSpecialContext('clef')
            || s.getContextByClass('Clef');

        // this should not be necessary now that derivation is
        // checked, but does not hurt.
        if (sClef === undefined && s.length) {
            // the clef context might be from something else in the stream...
            const firstEl = s.get(0);
            sClef = firstEl.getContextByClass('Clef');
        }
        // last resort
        sClef = sClef || _clefSingleton;

        this.setStafflines(s, stave);
        if (rendOp.showMeasureNumber) {
            stave.setMeasure(rendOp.measureIndex + 1);
        }
        if (rendOp.displayClef) {
            let ottava;
            const size = 'default';
            if (sClef.octaveChange === 1) {
                ottava = '8va';
            } else if (sClef.octaveChange === -1) {
                ottava = '8vb';
            }
            stave.addClef(sClef.name, size, ottava);
        }
        const context_ks = s.getSpecialContext('keySignature') || s.getContextByClass('KeySignature');
        if (context_ks !== undefined && rendOp.displayKeySignature) {
            const ksVFName = context_ks.majorName().replace(/-/g, 'b');
            stave.addKeySignature(ksVFName);
        }

        const context_ts = s.getSpecialContext('timeSignature') || s.getContextByClass('TimeSignature');
        if (context_ts !== undefined && rendOp.displayTimeSignature) {
            stave.addTimeSignature(
                context_ts.numerator.toString()
                    + '/'
                    + context_ts.denominator.toString()
            );
        }
        if (rendOp.rightBarline !== undefined) {
            const bl = rendOp.rightBarline;
            const barlineMap = {
                single: 'SINGLE',
                double: 'DOUBLE',
                end: 'END',
            };
            const vxBL = barlineMap[bl];
            if (vxBL !== undefined) {
                stave.setEndBarType(Vex.Flow.Barline.type[vxBL]);
            }
        }
    }

    /**
     * Sets the number of stafflines properly for the Stave object.
     *
     * This method does not just set Vex.Flow.Stave#setNumLines() except
     * if the number of lines is 0 or >=4, because the default in VexFlow is
     * to show the bottom(top?), not middle, lines and that looks bad.
     *
     * @param {music21.stream.Stream} s - stream to get the `.staffLines`
     * from `s.renderOptions` from -- should allow for overriding.
     * @param {Vex.Flow.Stave} vexflowStave - stave to set the staff lines for.
     */
    setStafflines(s, vexflowStave) {
        const rendOp = s.renderOptions;
        if (rendOp.staffLines !== 5) {
            if (rendOp.staffLines === 0) {
                vexflowStave.setNumLines(0);
            } else if (rendOp.staffLines === 1) {
                // Vex.Flow.Stave.setNumLines hides all but the top line.
                // this is better
                vexflowStave.options.line_config = [
                    { visible: false },
                    { visible: false },
                    { visible: true }, // show middle
                    { visible: false },
                    { visible: false },
                ];
            } else if (rendOp.staffLines === 2) {
                vexflowStave.options.line_config = [
                    { visible: false },
                    { visible: false },
                    { visible: true }, // show middle
                    { visible: true },
                    { visible: false },
                ];
            } else if (rendOp.staffLines === 3) {
                vexflowStave.options.line_config = [
                    { visible: false },
                    { visible: true },
                    { visible: true }, // show middle
                    { visible: true },
                    { visible: false },
                ];
            } else {
                vexflowStave.setNumLines(rendOp.staffLines);
            }
        }
    }

    /**
     * Gets the Vex.Flow.StaveNote objects from a Stream.
     *
     * Also changes `this.vfTuplets`.
     *
     * @param {music21.stream.Stream} [s=this.stream] - flat stream to find notes in
     * @param {Vex.Flow.Stave} stave - Vex.Flow.Stave to render notes on to.
     * @returns {Array<Vex.Flow.StaveNote>} notes to return
     */
    vexflowNotes(s, stave) {
        if (s === undefined) {
            s = this.stream;
        }
        // runs on a flat stream, returns a list of voices...
        const notes = [];
        const vfTuplets = [];
        let activeTuplet;
        let activeTupletLength = 0.0;
        let activeTupletVexflowNotes = [];
        let sClef = s.getSpecialContext('clef') || s.getContextByClass('Clef');
        if (sClef === undefined && s.length) {
            // TODO: follow Derivation...
            const firstEl = s.get(0);
            sClef = firstEl.getContextByClass('Clef');
        }
        if (sClef === undefined) {
            sClef = _clefSingleton;
        }

        const options = { clef: sClef, stave };
        for (const thisEl of s) {
            if (
                thisEl.isClassOrSubclass('GeneralNote')
                && thisEl.duration !== undefined
            ) {
                // sets thisEl.activeVexflowNote -- may be overwritten but not so fast...
                const vfn = thisEl.vexflowNote(options);
                if (vfn === undefined) {
                    console.error('Cannot create a vexflowNote from: ', thisEl);
                    continue;
                }
                if (stave !== undefined) {
                    vfn.setStave(stave);
                }
                notes.push(vfn);

                // account for tuplets...
                if (thisEl.duration.tuplets.length > 0) {
                    // only support one tuplet per note -- like vexflow
                    if (activeTuplet === undefined) {
                        activeTuplet = thisEl.duration.tuplets[0];
                    }
                    activeTupletVexflowNotes.push(vfn);
                    activeTupletLength += thisEl.duration.quarterLength;
                    // console.log(activeTupletLength, activeTuplet.totalTupletLength());
                    //
                    // Add tuplet when complete.
                    if (
                        activeTupletLength
                            >= activeTuplet.totalTupletLength()
                        || Math.abs(
                            activeTupletLength
                                - activeTuplet.totalTupletLength()
                        ) < 0.001
                    ) {
                        // console.log(activeTupletVexflowNotes);
                        const tupletOptions = {
                            num_notes: activeTuplet.numberNotesActual,
                            notes_occupied: activeTuplet.numberNotesNormal,
                        };
                        // console.log('tupletOptions', tupletOptions);
                        const vfTuplet = new Vex.Flow.Tuplet(
                            activeTupletVexflowNotes,
                            tupletOptions
                        );
                        if (activeTuplet.tupletNormalShow === 'ratio') {
                            vfTuplet.setRatioed(true);
                        }

                        vfTuplets.push(vfTuplet);
                        activeTupletLength = 0.0;
                        activeTuplet = undefined;
                        activeTupletVexflowNotes = [];
                    }
                }
            }
        }
        if (activeTuplet !== undefined) {
            console.warn('incomplete tuplet found in stream: ', s);
        }
        if (vfTuplets.length > 0) {
            this.vfTuplets.push(...vfTuplets);
        }
        return notes;
    }

    /**
     * Gets an Array of `Vex.Flow.TextNote` objects from any lyrics found in s
     *
     * @param {music21.stream.Stream} s - flat stream to search.
     * @param {Vex.Flow.Stave} stave
     * @returns {Array<Vex.Flow.TextNote>}
     */
    vexflowLyrics(s, stave) {
        const getTextNote = (text, font, d, lyricObj) => {
            // console.log(text, font, d);
            const t1 = new Vex.Flow.TextNote({
                text,
                font,
                duration: d.vexflowDuration,
            })
                .setLine(11)
                .setStave(stave)
                .setJustification(Vex.Flow.TextNote.Justification.LEFT);
            if (lyricObj) {
                t1.setStyle(lyricObj.style);
            }
            if (d.tuplets.length > 0) {
                t1.applyTickMultiplier(d.tuplets[0].numberNotesNormal, d.tuplets[0].numberNotesActual);
            }
            return t1;
        };

        if (s === undefined) {
            s = this.stream;
        }
        // runs on a flat, gapless, no-overlap stream, returns a list of TextNote objects...
        const lyricsObjects = [];
        for (const el of s) {
            const lyricsArray = el.lyrics;
            if (lyricsArray === undefined) {
                continue;
            }
            let text;
            let d = el.duration;
            let addConnector = false;
            let firstLyric;
            const font = {
                family: 'Serif',
                size: 12,
                weight: '',
            };

            if (lyricsArray.length === 0) {
                text = '';
            } else {
                firstLyric = lyricsArray[0];
                text = firstLyric.text;
                if (text === undefined) {
                    text = '';
                }
                if (
                    firstLyric.syllabic === 'middle'
                    || firstLyric.syllabic === 'begin'
                ) {
                    addConnector = ' ' + firstLyric.lyricConnector;
                    const tempQl = el.duration.quarterLength / 2.0;
                    d = new duration.Duration(tempQl);
                }
                if (firstLyric.style.fontFamily) {
                    font.family = firstLyric.style.fontFamily;
                }
                if (firstLyric.style.fontSize) {
                    font.size = firstLyric.style.fontSize;
                }
                if (firstLyric.style.fontWeight) {
                    font.weight = firstLyric.style.fontWeight;
                }
            }
            const t1 = getTextNote(text, font, d, firstLyric);
            lyricsObjects.push(t1);
            if (addConnector !== false) {
                const connector = getTextNote(addConnector, font, d);
                lyricsObjects.push(connector);
            }
        }
        return lyricsObjects;
    }

    /**
     * Creates a Vex.Flow.Voice of the appropriate length given a Stream.
     *
     * @param {music21.stream.Stream} s
     * @returns {Vex.Flow.Voice}
     */
    vexflowVoice(s) {
        const totalLength = s.duration.quarterLength;

        let num1024 = Math.round(totalLength / (1 / 256));
        let beatValue = 1024;

        if (num1024 % 512 === 0) {
            beatValue = 2;
            num1024 /= 512;
        } else if (num1024 % 256 === 0) {
            beatValue = 4;
            num1024 /= 256;
        } else if (num1024 % 128 === 0) {
            beatValue = 8;
            num1024 /= 128;
        } else if (num1024 % 64 === 0) {
            beatValue = 16;
            num1024 /= 64;
        } else if (num1024 % 32 === 0) {
            beatValue = 32;
            num1024 /= 32;
        } else if (num1024 % 16 === 0) {
            beatValue = 64;
            num1024 /= 16;
        } else if (num1024 % 8 === 0) {
            beatValue = 128;
            num1024 /= 8;
        } else if (num1024 % 4 === 0) {
            beatValue = 256;
            num1024 /= 4;
        } else if (num1024 % 2 === 0) {
            beatValue = 512;
            num1024 /= 2;
        }
        // console.log('creating voice');
        if (debug) {
            console.log(
                'New voice, num_beats: '
                    + num1024.toString()
                    + ' beat_value: '
                    + beatValue.toString()
            );
        }
        const vfv = new Vex.Flow.Voice({
            num_beats: num1024,
            beat_value: beatValue,
            resolution: Vex.Flow.RESOLUTION,
        });

        // from vexflow/src/voice.js
        //
        // Modes allow the addition of ticks in three different ways:
        //
        // STRICT: This is the default. Ticks must fill the voice.
        // SOFT:   Ticks can be added without restrictions.
        // FULL:   Ticks do not need to fill the voice, but can't exceed the maximum
        //         tick length.
        vfv.setMode(Vex.Flow.Voice.Mode.SOFT);
        return vfv;
    }

    staffConnectorsMap(connectorType) {
        const connectorMap = {
            brace: Vex.Flow.StaveConnector.type.BRACE,
            single: Vex.Flow.StaveConnector.type.SINGLE,
            double: Vex.Flow.StaveConnector.type.DOUBLE,
            bracket: Vex.Flow.StaveConnector.type.BRACKET,
        };
        return connectorMap[connectorType];
    }

    /**
     * If a stream has parts (NOT CHECKED HERE) create and
     * draw an appropriate Vex.Flow.StaveConnector
     *
     * @param {music21.stream.Score} s
     */
    addStaffConnectors(s) {
        if (s === undefined) {
            s = this.stream;
        }
        const parts = s.parts;
        const numParts = parts.length;
        if (numParts < 2) {
            return;
        }

        const firstPart = parts.get(0);
        const lastPart = parts.get(-1);

        const firstPartMeasures = firstPart.measures;
        const lastPartMeasures = lastPart.measures;
        const numMeasures = firstPartMeasures.length;

        for (let mIndex = 0; mIndex < numMeasures; mIndex++) {
            const thisPartMeasure = firstPartMeasures.get(mIndex);
            const lastPartMeasure = lastPartMeasures.get(mIndex); // only needed once per system but
            // good for symmetry.
            if (thisPartMeasure.renderOptions.startNewSystem) {
                let topVFStaff = thisPartMeasure.activeVFStave;
                let bottomVFStaff = lastPartMeasure.activeVFStave;
                if (topVFStaff === undefined) {
                    if (!thisPartMeasure.isFlat) {
                        const thisPartVoice = thisPartMeasure
                            .getElementsByClass('Stream')
                            .get(0);
                        topVFStaff = thisPartVoice.activeVFStave;
                        if (topVFStaff === undefined) {
                            console.warn(
                                'No active VexFlow Staves defined for at least one measure'
                            );
                            continue;
                        }
                    }
                }
                if (bottomVFStaff === undefined) {
                    if (!lastPartMeasure.isFlat) {
                        const lastPartVoice = lastPartMeasure
                            .getElementsByClass('Stream')
                            .get(0);
                        bottomVFStaff = lastPartVoice.activeVFStave;
                        if (bottomVFStaff === undefined) {
                            console.warn(
                                'No active VexFlow Staves defined for at least one measure'
                            );
                            continue;
                        }
                    }
                }
                for (
                    let i = 0;
                    i < s.renderOptions.staffConnectors.length;
                    i++
                ) {
                    const sc = new Vex.Flow.StaveConnector(
                        topVFStaff,
                        bottomVFStaff
                    );
                    const scTypeM21 = s.renderOptions.staffConnectors[i];
                    const scTypeVF = this.staffConnectorsMap(scTypeM21);
                    sc.setType(scTypeVF);
                    sc.setContext(this.ctx);
                    sc.draw();
                }
            }
        }
    }

    /**
     * The process of putting a Stream onto a div affects each of the
     * elements in the Stream by adding pieces of information to
     * each {@link music21.base.Music21Object} -- see `applyFormatterInformationToNotes`
     *
     * You might want to remove this information; this routine does that.
     *
     * @param {music21.stream.Stream} s - can have parts, measures, etc.
     * @param {boolean} [recursive=false]
     */
    removeFormatterInformation(s, recursive) {
        s.storedVexflowStave = undefined;
        for (const el of s) {
            el.x = undefined;
            el.y = undefined;
            el.width = undefined;
            el.systemIndex = undefined;
            el.activeVexflowNote = undefined;
            if (recursive && el.isClassOrSubclass('Stream')) {
                this.removeFormatterInformation(el, recursive);
            }
        }
    }

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
     * @param {music21.stream.Stream} [s=this.stream]
     * @param {Vex.Flow.Formatter} formatter
     */
    applyFormatterInformationToNotes(stave, s, formatter) {
        if (s === undefined) {
            s = this.stream;
        }
        const sClef = s.getSpecialContext('clef') || s.getContextByClass('Clef') || _clefSingleton;
        let noteOffsetLeft = 0;
        // var staveHeight = 80;
        if (stave !== undefined) {
            noteOffsetLeft = stave.start_x + stave.glyph_start_x;
            if (debug) {
                console.log(
                    'noteOffsetLeft: '
                        + noteOffsetLeft
                        + ' ; stave.start_x: '
                        + stave.start_x
                );
                console.log('Bottom y: ' + stave.getBottomY());
            }
            // staveHeight = stave.height;
        }

        let nextTicks = 0;
        for (const el of s) {
            if (el.isClassOrSubclass('GeneralNote')) {
                const vfn = el.activeVexflowNote;
                if (vfn === undefined) {
                    continue;
                }
                const nTicks = parseInt(vfn.ticks);
                const formatterNote
                    = formatter.tickContexts.map[String(nextTicks)];
                nextTicks += nTicks;
                el.x = vfn.getAbsoluteX();
                // these are a bit hacky...
                el.systemIndex = s.renderOptions.systemIndex;

                // console.log(el.x + " " + formatterNote.x + " " + noteOffsetLeft);
                if (formatterNote === undefined) {
                    continue;
                }

                el.width = formatterNote.width;
                if (el.pitch !== undefined) {
                    // note only...
                    el.y
                        = stave.getBottomY()
                        - (sClef.lowestLine - el.pitch.diatonicNoteNum)
                            * stave.options.spacing_between_lines_px;
                    // console.log('Note DNN: ' + el.pitch.diatonicNoteNum + " ; y: " + el.y);
                }
            }
        }
        if (debug) {
            for (const n of s) {
                if (n.pitch !== undefined) {
                    console.log(
                        n.pitch.diatonicNoteNum
                            + ' '
                            + n.x
                            + ' '
                            + (n.x + n.width)
                    );
                }
            }
        }
        s.storedVexflowStave = stave;
    }
}
