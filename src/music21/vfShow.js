import * as $ from 'jquery';
import * as Vex from 'vexflow';

import { debug } from './debug';
import { duration } from './duration';
/**
 * for rendering vexflow. Will eventually go to music21/converter/vexflow
 *
 * See {@link music21.vfShow} namespace for details
 *
 * @exports music21/vfShow
 */
/**
 * Vexflow display related objects and methods.
 *
 * @namespace music21.vfShow
 * @memberof music21
 * @requires music21/common
 * @requires vexflow
 */
export const vfShow = {};

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
    }
    /**
     * @memberof music21.vfShow.RenderStack
     * @returns {Array} this.voices and this.textVoices as one array
     */
    allTickables() {
        const t = [];
        t.push(...this.voices);
        t.push(...this.textVoices);
        return t;
    }
    /**
     * @memberof music21.vfShow.RenderStack
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
vfShow.RenderStack = RenderStack;


/**
 * Renderer is a function that takes a stream, an
 * optional existing canvas element and a DOM
 * element where the canvas element should be placed
 * and renders the stream as Vexflow on the
 * canvas element, placing it then in the where
 * DOM.
 *
 * "s" can be any type of Stream.
 *
 * "canvas" and "where" can be either a DOM
 * element or a jQuery object.
 *
 * @class Renderer
 * @memberof music21.vfShow
 * @param {music21.stream.Stream} s - main stream to render
 * @param {canvas} [canvas] - existing canvas element
 * @param {DOMObject|jQueryDOMObject} [where=document.body] - where to render the stream
 * @property {Vex.Flow.Renderer} vfRenderer - a Vex.Flow.Renderer to use 
 * (will create if not existing)
 * @property {Vex.Flow.Context} ctx - a Vex.Flow.Context (Canvas or Raphael [not yet]) to use.
 * @property {canvas} canvas - canvas element
 * @property {jQueryDOMObject} $canvas - jQuery canvas element
 * @property {jQueryDOMObject} $where - jQuery element to render onto
 * @property {Vex.Flow.Formatter} activeFormatter - formatter
 * @property {Array<Vex.Flow.Beam>} beamGroups - beamGroups
 * @property {Array<Vex.Flow.StaveTie>} ties - ties
 * @property {Array<number>} systemBreakOffsets - where to break the systems
 * @property {Array<Vex.Flow.Tuplet>} vfTuplets - tuplets represented in Vexflow
 * @property {Array<music21.vfShow.RenderStack>} stacks - array of RenderStack objects
 */
export class Renderer {
    constructor(s, canvas, where) {
        this.stream = s;
        // this.streamType = s.classes[-1];

        this.canvas = undefined;
        this.$canvas = undefined;
        this.$where = undefined;
        this.activeFormatter = undefined;
        this._vfRenderer = undefined;
        this._ctx = undefined;
        this.beamGroups = [];
        this.stacks = []; // an Array of RenderStacks: {voices: [Array of Vex.Flow.Voice objects],
        //                                           streams: [Array of Streams, usually Measures]}
        this.ties = [];
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
        if (canvas !== undefined) {
            if (canvas.jquery !== undefined) {
                this.$canvas = canvas;
                this.canvas = canvas[0];
            } else {
                this.canvas = canvas;
                this.$canvas = $(canvas);
            }
        }
    }
    get vfRenderer() {
        if (this._vfRenderer !== undefined) {
            return this._vfRenderer;
        } else {
            this._vfRenderer = new Vex.Flow.Renderer(
                this.canvas, 
                Vex.Flow.Renderer.Backends.CANVAS);
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
            if (this.stream && this.stream.renderOptions) {
                this._ctx.scale(
                    this.stream.renderOptions.scaleFactor.x,
                    this.stream.renderOptions.scaleFactor.y);
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
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Stream} [s=this.stream]
     */
    render(s) {
        if (s === undefined) {
            s = this.stream;
        }

        let isScorelike = false;
        let isPartlike = false;
        const hasSubStreams = s.hasSubStreams();

        if (s.isClassOrSubclass('Score')) {
            isScorelike = true;
        } else if (hasSubStreams && s.get(0).hasSubStreams()) {
            isScorelike = true;
        } else if (hasSubStreams) {
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
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Score} s - prepare a stream of parts (i.e., Score)
     */
    prepareScorelike(s) {
        // console.log('prepareScorelike called');
        for (let i = 0; i < s.length; i++) {
            const subStream = s.get(i);
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
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Part} p
     */
    preparePartlike(p) {
        // console.log('preparePartlike called');
        this.systemBreakOffsets = [];
        for (let i = 0; i < p.length; i++) {
            const subStream = p.get(i);
            if (subStream.renderOptions.startNewSystem) {
                this.systemBreakOffsets.push(subStream.offset);
            }
            if (i === (p.length - 1)) {
                subStream.renderOptions.rightBarline = 'end';
            }
            if (this.stacks[i] === undefined) {
                this.stacks[i] = new vfShow.RenderStack();
            }
            this.prepareMeasure(subStream, this.stacks[i]);
        }
        this.prepareTies(p);
    }
    /**
     *
     * Prepares a score that arrived flat... sets up
     * stacks and ties after calling prepareFlat
     *
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Stream} m - a flat stream (maybe a measure or voice)
     */
    prepareArrivedFlat(m) {
        const stack = new vfShow.RenderStack();
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
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Measure} m - a measure object (w or w/o voices)
     * @param {music21.vfShow.RenderStack} stack - a RenderStack object to prepare into.
     */
    prepareMeasure(m, stack) {
        if (m.hasVoices === undefined || m.hasVoices() === false) {
            this.prepareFlat(m, stack);
        } else {
            // TODO: don't assume that all elements are Voices;
            let stave;
            const rendOp = m.renderOptions; // get render options from Measure;
            for (let voiceIndex = 0; voiceIndex < m.length; voiceIndex++) {
                const voiceStream = m.get(voiceIndex);
                stave = this.prepareFlat(voiceStream, stack, stave, rendOp);
            }
        }
        return stack;
    }
    /**
     * Main internal routine to prepare a flat stream
     *
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Stream} s - a flat stream object
     * @param {music21.vfShow.RenderStack} stack - a RenderStack object to prepare into.
     * @param {Vex.Flow.Stave} [optionalStave] - an optional existing stave.
     * @param {object} [optional_renderOp] - render options. 
     * Passed to {@link music21.vfShow.Renderer#renderStave}
     * @returns {Vex.Flow.Stave} staff to return too 
     * (also changes the `stack` parameter and runs `makeAccidentals` on s)
     */
    prepareFlat(s, stack, optionalStave, optional_renderOp) {
        s.makeAccidentals();
        let stave;
        if (optionalStave !== undefined) {
            stave = optionalStave;
        } else {
            stave = this.renderStave(s, optional_renderOp);
        }
        s.activeVFStave = stave;
        const voice = this.getVoice(s, stave);
        stack.voices.push(voice);
        stack.streams.push(s);

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
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Stream} [m=this.stream] - a flat stream
     * @param {object} [optional_rendOp] - render options, passed 
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
     * @memberof music21.vfShow.Renderer
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
     * @memberof music21.vfShow.Renderer
     */
    drawTuplets() {
        const ctx = this.ctx;
        this.vfTuplets.forEach((vft) => {
            vft.setContext(ctx).draw();
        });
    }
    /**
     * draws the ties
     *
     * @memberof music21.vfShow.Renderer
     */
    drawTies() {
        const ctx = this.ctx;
        for (let i = 0; i < this.ties.length; i++) {
            this.ties[i].setContext(ctx).draw();
        }
    }
    /**
     * Finds all tied notes and creates the proper Vex.Flow.StaveTie objects in
     * `this.ties`.
     *
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Part} p - a Part or similar object
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
                if (thisNote.offset < thisSystemBreak && nextNote.offset >= thisSystemBreak) {
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
                this.ties.push(vfTie);
            } else {
                // console.log('got me a tie across systemBreaks!');
                const vfTie1 = new Vex.Flow.StaveTie({
                    first_note: thisNote.activeVexflowNote,
                    first_indices: [0],
                });
                this.ties.push(vfTie1);
                const vfTie2 = new Vex.Flow.StaveTie({
                    last_note: nextNote.activeVexflowNote,
                    first_indices: [0],
                });
                this.ties.push(vfTie2);
            }
        }
    }
    /**
     * Returns a Vex.Flow.Voice object with all the tickables (i.e., Notes, Voices, etc.)
     *
     * Does not draw it...
     *
     * @memberof music21.vfShow.Renderer
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
     * @memberof music21.vfShow.Renderer
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
     * @memberof music21.vfShow.Renderer
     */
    formatMeasureStacks() {
        // adds formats the voices, then adds the formatter information to every note in a voice...
        for (let i = 0; i < this.stacks.length; i++) {
            const stack = this.stacks[i];
            const voices = stack.voices;
            const measures = stack.streams;
            const formatter = this.formatVoiceGroup(stack);
            for (let j = 0; j < measures.length; j++) {
                const m = measures[j];
                const v = voices[j];
                this.applyFormatterInformationToNotes(v.stave, m, formatter);
            }
        }
    }
    /**
     * Formats a single voice group from a stack.
     *
     * @memberof music21.vfShow.Renderer
     * @param {music21.vfShow.RenderStack} stack
     * @param {Boolean} [autoBeam=measures[0].autoBeam]
     * @returns {Vex.Flow.Formatter}
     */
    formatVoiceGroup(stack, autoBeam) {
        // formats a group of voices to use the same formatter; returns the formatter
        // if autoBeam is true then it will apply beams for each voice and put them in
        // this.beamGroups;
        const allTickables = stack.allTickables();
        const voices = stack.voices;
        const measures = stack.streams;
        if (autoBeam === undefined) {
            autoBeam = measures[0].autoBeam;
        }

        const formatter = new Vex.Flow.Formatter();
        // var minLength = formatter.preCalculateMinTotalWidth([voices]);
        // console.log(minLength);
        if (voices.length === 0) {
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

        const stave = voices[0].stave; // all staves should be same length, so does not matter;
        const tickablesByStave = stack.tickablesByStave();
        for (const staveTickables of tickablesByStave) {
            formatter.joinVoices(staveTickables);
        }
        formatter.formatToStave(allTickables, stave);
        if (autoBeam) {
            for (let i = 0; i < voices.length; i++) {
                // find beam groups -- n.b. this wipes out stemDirection. worth it usually...
                const voice = voices[i];
                let beatGroups = [new Vex.Flow.Fraction(2, 8)]; // default beam groups
                if (measures[i] !== undefined && measures[i].timeSignature !== undefined) {
                    beatGroups = measures[i].timeSignature.vexflowBeatGroups(Vex); 
                    // TODO: getContextByClass...
                    // console.log(beatGroups);
                }
                const beamGroups = Vex.Flow.Beam.applyAndGetBeams(voice, undefined, beatGroups);
                this.beamGroups.push(...beamGroups);
            }
        }
        return formatter;
    }
    /**
     * Draws the beam groups.
     *
     * @memberof music21.vfShow.Renderer
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
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Stream} s
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
        let top = rendOp.top;// * rendOp.scaleFactor.y;
        if (top === undefined) {
            top = 0;
        }
        let left = rendOp.left;
        if (left === undefined) {
            left = 10;
        }
        // console.log('streamLength: ' + streamLength);
        if (debug) {
            console.log('creating new stave: left:' + left + ' top: ' + top + ' width: ' + width);
        }
        const stave = new Vex.Flow.Stave(left, top, width);
        return stave;
    }
    /**
     * Sets the number of stafflines, puts the clef on the Stave, 
     * adds keySignature, timeSignature, and rightBarline
     *
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Stream} s
     * @param {Vex.Flow.Stave} stave
     * @param {object} [rendOp=s.renderOptions] - a {@link music21.renderOptions.RenderOptions} 
     * object that might have 
     * `{showMeasureNumber: boolean, rightBarLine: string<{'single', 'double', 'end'}>}`
     */
    setClefEtc(s, stave, rendOp) {
        if (rendOp === undefined) {
            rendOp = s.renderOptions;
        }
        this.setStafflines(s, stave);
        if (rendOp.showMeasureNumber) {
            stave.setMeasure(rendOp.measureIndex + 1);
        }
        if (rendOp.displayClef) {
            let ottava;
            const size = 'default';
            if (s.clef.octaveChange === 1) {
                ottava = '8va';
            } else if (s.clef.octaveChange === -1) {
                ottava = '8vb';
            }
            stave.addClef(s.clef.name, size, ottava);
        }
        if ((s.keySignature !== undefined) && (rendOp.displayKeySignature)) {
            stave.addKeySignature(s.keySignature.vexflow());
        }

        if ((s.timeSignature !== undefined) && (rendOp.displayTimeSignature)) {
            stave.addTimeSignature(
                    s.timeSignature.numerator.toString() + '/' +
                    s.timeSignature.denominator.toString()); // TODO: convertToVexflow...
        }
        if (rendOp.rightBarline !== undefined) {
            const bl = rendOp.rightBarline;
            const barlineMap = {
                'single': 'SINGLE',
                'double': 'DOUBLE',
                'end': 'END',
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
     * @memberof music21.vfShow.Renderer
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
                vexflowStave.options.line_config = [{ visible: false },
                                                    { visible: false },
                                                    { visible: true }, // show middle
                                                    { visible: false },
                                                    { visible: false },
                                                    ];
            } else if (rendOp.staffLines === 2) {
                vexflowStave.options.line_config = [{ visible: false },
                                                    { visible: false },
                                                    { visible: true }, // show middle
                                                    { visible: true },
                                                    { visible: false },
                                                    ];
            } else if (rendOp.staffLines === 3) {
                vexflowStave.options.line_config = [{ visible: false },
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
     * @memberof music21.vfShow.Renderer
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

        const options = { clef: s.clef, stave };
        for (let i = 0; i < s.length; i++) {
            const thisEl = s.get(i);
            if (thisEl.isClassOrSubclass('GeneralNote') && (thisEl.duration !== undefined)) {
                // sets thisEl.activeVexflowNote -- may be overwritten but not so fast...
                const vfn = thisEl.vexflowNote(options);
                if (vfn === undefined) {
                    console.error('Cannot create a vexflowNote from: ', thisEl);
                }
                if (stave !== undefined) {
                    vfn.setStave(stave);
                }
                notes.push(vfn);

                // account for tuplets...
                if (thisEl.duration.tuplets.length > 0) {
                    // only support one tuplet -- like vexflow
                    const m21Tuplet = thisEl.duration.tuplets[0];
                    if (activeTuplet === undefined) {
                        activeTuplet = m21Tuplet;
                    }
                    activeTupletVexflowNotes.push(vfn);
                    activeTupletLength += thisEl.duration.quarterLength;
                    // console.log(activeTupletLength, activeTuplet.totalTupletLength());
                    if (activeTupletLength >= activeTuplet.totalTupletLength() ||
                            Math.abs(activeTupletLength 
                                        - activeTuplet.totalTupletLength()) < 0.001) {
                        // console.log(activeTupletVexflowNotes);
                        const tupletOptions = { num_notes: activeTuplet.numberNotesActual,
                                notes_occupied: activeTuplet.numberNotesNormal };
                        // console.log('tupletOptions', tupletOptions);
                        const vfTuplet = new Vex.Flow.Tuplet(activeTupletVexflowNotes,
                                tupletOptions);
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
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Stream} s - flat stream to search.
     * @param {Vex.Flow.Stave} stave
     * @returns {Array<Vex.Flow.TextNote>}
     */
    vexflowLyrics(s, stave) {
        const getTextNote = (text, font, d) => {
            // console.log(text, font, d);
            const t1 = new Vex.Flow.TextNote({
                text,
                font,
                duration: d,
            }).setLine(11).setStave(stave).setJustification(Vex.Flow.TextNote.Justification.LEFT);
            return t1;
        };

        if (s === undefined) {
            s = this.stream;
        }
        const font = {
            family: 'Serif',
            size: 12,
            weight: '',
        };
        // runs on a flat, gapless, no-overlap stream, returns a list of TextNote objects...
        const lyricsObjects = [];
        for (let i = 0; i < s.length; i++) {
            const el = s.get(i);
            const lyricsArray = el.lyrics;
            let text;
            let d = el.duration.vexflowDuration;
            let addConnector = false;
            if (lyricsArray.length === 0) {
                text = '';
            } else {
                text = lyricsArray[0].text;
                if (text === undefined) {
                    text = '';
                }
                if (lyricsArray[0].syllabic === 'middle' || lyricsArray[0].syllabic === 'begin') {
                    addConnector = ' ' + lyricsArray[0].lyricConnector;
                    const tempQl = el.duration.quarterLength / 2.0;
                    d = new duration.Duration(tempQl).vexflowDuration;
                }
            }
            const t1 = getTextNote(text, font, d);
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
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Stream} s
     * @returns {Vex.Flow.Voice}
     */
    vexflowVoice(s) {
        const totalLength = s.duration.quarterLength;

        let num1024 = Math.round(totalLength / (1 / 256));
        let beatValue = 1024;

        if (num1024 % 512 === 0)  {
            beatValue = 2;
            num1024 /= 512;
        } else if (num1024 % 256 === 0)  {
            beatValue = 4;
            num1024 /= 256;
        } else if (num1024 % 128 === 0)  {
            beatValue = 8;
            num1024 /= 128;
        } else if (num1024 % 64 === 0)  {
            beatValue = 16;
            num1024 /= 64;
        } else if (num1024 % 32 === 0)  {
            beatValue = 32;
            num1024 /= 32;
        } else if (num1024 % 16 === 0)  {
            beatValue = 64;
            num1024 /= 16;
        } else if (num1024 % 8 === 0)  {
            beatValue = 128;
            num1024 /= 8;
        } else if (num1024 % 4 === 0)  {
            beatValue = 256;
            num1024 /= 4;
        } else if (num1024 % 2 === 0)  {
            beatValue = 512;
            num1024 /= 2;
        }
        // console.log('creating voice');
        if (debug) {
            console.log('New voice, num_beats: ' + num1024.toString() 
                + ' beat_value: ' + beatValue.toString());
        }
        const vfv = new Vex.Flow.Voice({ num_beats: num1024,
            beat_value: beatValue,
            resolution: Vex.Flow.RESOLUTION });

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
            'brace': Vex.Flow.StaveConnector.type.BRACE,
            'single': Vex.Flow.StaveConnector.type.SINGLE,
            'double': Vex.Flow.StaveConnector.type.DOUBLE,
            'bracket': Vex.Flow.StaveConnector.type.BRACKET,
        };
        return connectorMap[connectorType];
    }

    /**
     * If a stream has parts (NOT CHECKED HERE) create and 
     * draw an appropriate Vex.Flow.StaveConnector
     *
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Score} s
     */
    addStaffConnectors(s) {
        if (s === undefined) {
            s = this.stream;
        }
        const numParts = s.length;
        if (numParts < 2) {
            return;
        }

        const firstPart = s.get(0);
        const lastPart = s.get(-1);
        const numMeasures = firstPart.length;
        for (let mIndex = 0; mIndex < numMeasures; mIndex++) {
            const thisPartMeasure = firstPart.get(mIndex);
            const lastPartMeasure = lastPart.get(mIndex); // only needed once per system but
            // good for symmetry.
            if (thisPartMeasure.renderOptions.startNewSystem) {
                const topVFStaff = thisPartMeasure.activeVFStave;
                const bottomVFStaff = lastPartMeasure.activeVFStave;
                /* TODO: warning if no staves... */
                for (let i = 0; i < s.renderOptions.staffConnectors.length; i++) {
                    const sc = new Vex.Flow.StaveConnector(topVFStaff, bottomVFStaff);
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
     * The process of putting a Stream onto a canvas affects each of the
     * elements in the Stream by adding pieces of information to
     * each {@link music21.base.Music21Object} -- see `applyFormatterInformationToNotes`
     *
     * You might want to remove this information; this routine does that.
     *
     * @memberof music21.vfShow.Renderer
     * @param {music21.stream.Stream} s - can have parts, measures, etc.
     * @param {boolean} [recursive=false]
     */
    removeFormatterInformation(s, recursive) {
        s.storedVexflowStave = undefined;
        for (let i = 0; i < s.length; i++) {
            const el = s.get(i);
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
     * @memberof music21.vfShow.Renderer
     * @param {Vex.Flow.Stave} stave
     * @param {music21.stream.Stream} [s=this.stream]
     * @param {Vex.Flow.Formatter} formatter
     */
    applyFormatterInformationToNotes(stave, s, formatter) {
        if (s === undefined) {
            s = this.stream;
        }
        let noteOffsetLeft = 0;
        // var staveHeight = 80;
        if (stave !== undefined) {
            noteOffsetLeft = stave.start_x + stave.glyph_start_x;
            if (debug) {
                console.log('noteOffsetLeft: ' + noteOffsetLeft 
                    + ' ; stave.start_x: ' + stave.start_x);
                console.log('Bottom y: ' + stave.getBottomY());
            }
            // staveHeight = stave.height;
        }

        let nextTicks = 0;
        for (let i = 0; i < s.length; i++) {
            const el = s.get(i);
            if (el.isClassOrSubclass('GeneralNote')) {
                const vfn = el.activeVexflowNote;
                if (vfn === undefined) {
                    continue;
                }
                const nTicks = parseInt(vfn.ticks);
                const formatterNote = formatter.tickContexts.map[String(nextTicks)];
                nextTicks += nTicks;
                el.x = vfn.getAbsoluteX();
                // these are a bit hacky...
                el.systemIndex = s.renderOptions.systemIndex;

                // console.log(i + " " + el.x + " " + formatterNote.x + " " + noteOffsetLeft);
                if (formatterNote === undefined) {
                    continue;
                }

                el.width = formatterNote.width;
                if (el.pitch !== undefined) { // note only...
                    el.y = (stave.getBottomY() - (s.clef.lowestLine - el.pitch.diatonicNoteNum) *
                            stave.options.spacing_between_lines_px);
                    // console.log('Note DNN: ' + el.pitch.diatonicNoteNum + " ; y: " + el.y);
                }
            }
        }
        if (debug) {
            for (let i = 0; i < s.length; i++) {
                const n = s.get(i);
                if (n.pitch !== undefined) {
                    console.log(n.pitch.diatonicNoteNum + ' ' + n.x + ' ' + (n.x + n.width));
                }
            }
        }
        s.storedVexflowStave = stave;
    }
}
vfShow.Renderer = Renderer;
