import { hyphenToCamelCase, opFrac } from '../common';
import * as chord from '../chord';
import * as clef from '../clef';
import * as duration from '../duration';
import * as key from '../key';
import * as meter from '../meter';
import * as note from '../note';
import * as pitch from '../pitch';
import * as stream from '../stream';
import * as tie from '../tie';

// imports just for typing:
import type { Music21Object } from '../base';
import type { ProtoM21Object } from '../prebase';

const DEFAULTS = {
    divisionsPerQuarter: 32 * 3 * 3 * 5 * 7,
};

const NO_STAFF_ASSIGNED = 0;
const STAFF_SPECIFIC_CLASSES = [
    'Clef',
    'Dynamic',
    'Expression',
    'GeneralNote',
    // 'KeySignature',
    'StaffLayout',
    'TempoIndication',
    // 'TimeSignature',
];

/**
 * Set an attribute of a Music21 Object via
 */
function seta(
    m21El: Music21Object|ProtoM21Object,
    xmlEl: Element,
    tag: string,
    attributeName: string = undefined,
    transform: (e: any) => any = undefined,
) {
    const matchEl = xmlEl.getElementsByTagName(tag);
    if (!matchEl.length) {
        return;
    }
    let value = matchEl[0].textContent?.trim() ?? '';
    if (value === undefined || value === '') {
        return;
    }
    if (transform !== undefined) {
        value = transform(value);
    }
    if (attributeName === undefined) {
        attributeName = hyphenToCamelCase(tag);
    }
    m21El[attributeName] = value;
}

export class ScoreParser {
    xmlText: string;
    xmlUrl: string;
    xmlRoot: Element;
    stream: stream.Score;
    definesExplicitSystemBreaks: boolean = false;
    definesExplicitPageBreaks: boolean = false;

    mxScorePartDict = {};
    m21PartObjectsById = {};
    partGroupList = [];
    parts = [];

    musicXmlVersion: string = '1.0';

    constructor() {
        this.stream = new stream.Score();
    }

    async scoreFromUrl(url: string): Promise<stream.Score> {
        this.xmlUrl = url;
        const response = await fetch(url);
        const xmlText = await response.text();
        return this.scoreFromText(xmlText);
    }

    scoreFromText(xmlText: string): stream.Score {
        this.xmlText = xmlText;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        return this.scoreFromDOMTree(xmlDoc);
    }

    scoreFromDOMTree(xmlDoc: Document): stream.Score {
        this.xmlRoot = xmlDoc.querySelector('score-partwise');
        this.xmlRootToScore(this.xmlRoot, this.stream);
        return this.stream;
    }

    xmlRootToScore(mxScore: Element, inputM21: stream.Score) {
        const s: stream.Score = inputM21 ?? new stream.Score();
        // version
        // defaults
        // credit
        this.parsePartList(mxScore);
        for (const p of Array.from(mxScore.getElementsByTagName('part'))) {
            const partId = p.getAttribute('id');
            // if (partId === undefined) {
            //     partId = //something
            // }
            const mxScorePart = this.mxScorePartDict[partId];
            const part = this.xmlPartToPart(p, mxScorePart);
            if (part !== undefined) {
                // part that became 2 PartStaffs is undefined: handles itself
                s.insert(0.0, part);
                this.m21PartObjectsById[partId] = part;
                this.parts.push(part);
            }
        }
        // partGroups;
        // spanners;
        // definesExplicitSystemBreaks, etc.
        // sort
        return s;
    }

    xmlPartToPart(mxPart: Element, mxScorePart: Element): stream.Part {
        const parser = new PartParser(mxPart, mxScorePart, this);
        parser.parse();
        if (parser.appendToScoreAfterParse) {
            return parser.stream;
        }
        return undefined;
    }

    parsePartList(mxScore: Element) {
        const mxPartList = Array.from(mxScore.getElementsByTagName('part-list'));
        if (!mxPartList.length) {
            return;
        }
        // const openPartGroups = [];
        for (const partListElement of mxPartList) {
            for (const scorePartElement of Array.from(partListElement.getElementsByTagName('score-part'))) {
                const partId = scorePartElement.getAttribute('id');
                this.mxScorePartDict[partId] = scorePartElement;
            }
        }
        // deal with part-groups
    }
}

export class PartParser {
    parent: ScoreParser;
    mxPart: Element;
    mxScorePart: Element;
    partId: string;
    stream: stream.Part;
    atSoundingPitch = true;
    staffReferenceList = [];

    lastTimeSignature: meter.TimeSignature;
    lastMeasureWasShort = false;
    lastMeasureOffset = 0.0;
    lastClefs: Record<number, clef.Clef> = {};
    activeTuplets = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    maxStaves = 1;
    lastMeasureNumber = 0;
    lastNumberSuffix: string = '';

    multiMeasureRestsToCapture = 0;
    // activeMultimeasureRestSpanner;

    // activeInstrument;
    firstMeasureParsed = false;
    activeAttributes: Element;
    lastDivisions = DEFAULTS.divisionsPerQuarter;

    appendToScoreAfterParse = true;
    lastMeasureParser: MeasureParser;

    constructor(mxPart: Element, mxScorePart: Element, parent: ScoreParser = undefined) {
        this.parent = parent;
        this.mxPart = mxPart;
        this.mxScorePart = mxScorePart;
        // ignore parent for now
        if (mxPart !== undefined) {
            this.partId = mxPart.getAttribute('id');
            // ignore empty partId for now
        }
        // TODO(msc): spannerBundles
        this.stream = new stream.Part();
        this.lastClefs = {};
    }

    parse() {
        this.parseXmlScorePart();
        this.parseMeasures();
        // atSoundingPitch;
        // spannerBundles
        if (this.maxStaves > 1) {
            this.separateOutPartStaves();
        }
        if (this.lastClefs[0]) {
            this.stream.clef = this.lastClefs[0];
        }
    }

    parseXmlScorePart() {
        const part = this.stream;
        const mxScorePart = this.mxScorePart;

        seta(part, mxScorePart, 'part-name'); // todo -- clean string
        // remainder of part names
        // instruments
    }

    parseMeasures() {
        for (const mxMeasure of Array.from(this.mxPart.getElementsByTagName('measure'))) {
            this.xmlMeasureToMeasure(mxMeasure);
        }
        if (this.lastMeasureParser !== undefined) {
            this.lastMeasureParser.parent = undefined; // gc.
        }
    }

    xmlMeasureToMeasure(mxMeasure: Element): void {
        const measureParser = new MeasureParser(mxMeasure, this);
        measureParser.parse();
        if (this.lastMeasureParser !== undefined) {
            this.lastMeasureParser.parent = undefined; // gc.
        }
        this.lastMeasureParser = measureParser;
        if (measureParser.staves > this.maxStaves) {
            this.maxStaves = measureParser.staves;
        }
        // transposition
        this.firstMeasureParsed = true;
        this.staffReferenceList.push(measureParser.staffReference);

        const m = measureParser.stream;
        this.setLastMeasureInfo(m);
        // fullMeasureRests

        // TODO: offsets!!!
        // this.stream.insert(this.lastMeasureOffset, m);
        this.stream.append(<Music21Object><any> m);

        this.adjustTimeAttributesFromMeasure(m);
    }

    setLastMeasureInfo(m: stream.Measure): void {
        if (m.number !== this.lastMeasureNumber) {
            this.lastMeasureNumber = m.number;
            this.lastNumberSuffix = m.numberSuffix;
        }

        if (m.timeSignature !== undefined) {
            this.lastTimeSignature = m.timeSignature;
        } else if (this.lastTimeSignature === undefined) {
            this.lastTimeSignature = new meter.TimeSignature('4/4');
        }
    }

    adjustTimeAttributesFromMeasure(m: stream.Measure): void {
        const mHighestTime = m.highestTime;
        // ignore incomplete measures.
        const mOffsetShift = mHighestTime;
        this.lastMeasureOffset += mOffsetShift;
    }

    separateOutPartStaves(): void {
        const partStaffs = [];

        function copyIntoPartStaff(
            source: stream.Measure | stream.Voice,
            target: stream.Measure | stream.Voice,
            elementsOfStaff: Music21Object[]
        ) {
            for (const sourceEl of source.getElementsByClass(STAFF_SPECIFIC_CLASSES)) {
                if (!elementsOfStaff.includes(sourceEl)) {
                    continue;
                }
                try {
                    target.insert(sourceEl.offset, sourceEl);
                } catch {
                    target.insert(sourceEl.offset, sourceEl.clone(true));
                }
            }
        }

        function getStaffInclude(staffKey: number, staffReference: Object) {
            let els;
            if (staffKey === 1 && staffReference[0] !== undefined) {
                els = [...staffReference[0], ...staffReference[1]];
            } else {
                els = staffReference[staffKey];
            }
            return els;
        }

        for (let staffIndex = 0; staffIndex < this.maxStaves; staffIndex++) {
            const staffKey = staffIndex + 1;
            // TODO: spanners only on first staff
            const newPartStaff = this.stream.template(
                {removeClasses: STAFF_SPECIFIC_CLASSES, fillWithRests: false}
            );
            const partStaffId = `${this.partId}-Staff${staffKey}`;
            newPartStaff.id = partStaffId;
            // TODO: groups?
            partStaffs.push(newPartStaff);
            this.parent.m21PartObjectsById[partStaffId] = newPartStaff;
            
            for (const [i, sourceMeasure] of Array.from(this.stream.getElementsByClass('Measure')).entries()) {
                const copyMeasure = newPartStaff.getElementsByClass('Measure').get(i) as stream.Measure;
                const staffReference = this.staffReferenceList[i];
                const els_to_include = getStaffInclude(staffKey, staffReference);

                copyIntoPartStaff((sourceMeasure as stream.Measure), copyMeasure, els_to_include);
                for (const [j, sourceVoice] of Array.from((sourceMeasure as stream.Measure).voices).entries()) {
                    const copyVoice = copyMeasure.voices.get(j);
                    copyIntoPartStaff(sourceVoice, copyVoice, els_to_include);
                }
                // copyMeasure.flattenUnnecessaryVoices({inPlace: true});
            }
        }

        for (const partStaff of partStaffs) {
            this.parent.stream.insert(0, partStaff);
        }
        this.appendToScoreAfterParse = false;

        // TODO: new StaffGroup
    }
}

export class MeasureParser {
    mxMeasure: Element;
    parent: PartParser;
    mxMeasureElements: Element[] = [];
    stream: stream.Measure;

    divisions = undefined;
    transposition = undefined;
    // spannerBundles
    staffReference = {};
    // activeTuplets
    useVoices = false;
    voicesById = {};
    voiceIndices;
    staves = 1;
    activeAttributes = undefined;
    attributesAreInternal = true;
    measureNumber: number = undefined;
    numberSuffix: string = undefined;
    staffLayoutObjects = [];

    mxNoteList = [];
    mxLyricList = [];
    nLast: note.GeneralNote;
    chordVoice = undefined;
    fullMeasureRest = false;
    restAndNoteCount = {
        rest: 0,
        note: 0,
    };

    lastClefs = {
        0: undefined,
    };

    parseIndex = 0;
    offsetMeasureNote = 0.0;

    // class attributes in m21p
    attributeTagsToMethods = {
        time: 'handleTimeSignature',
        clef: 'handleClef',
        key: 'handleKeySignature',
        // 'staff-details': 'handleStaffDetails',
        // 'measure-style': 'handleMeasureStyle',
    };

    musicDataMethods = {
        note: 'xmlToNote',
        backup: 'xmlBackup',
        forward: 'xmlForward',
        // 'direction': 'xmlDirection',
        attributes: 'parseAttributesTag',
        // 'harmony': 'xmlHarmony',
        // 'figured-bass': undefined,
        // 'sound': undefined,
        // 'barline': 'xmlBarline',
        // 'grouping': undefined,
        // 'link': undefined,
        // 'bookmark': undefined,

        // Note: <print> is handled separately...
    };

    constructor(mxMeasure: Element, parent: PartParser = undefined) {
        this.mxMeasure = mxMeasure;
        this.parent = parent;
        this.stream = new stream.Measure();

        this.voiceIndices = new Set();
        this.staves = 1;
        this.attributesAreInternal = true;

        if (parent !== undefined) {
            this.divisions = parent.lastDivisions;
        } else {
            this.divisions = DEFAULTS.divisionsPerQuarter;
        }

    }

    parse() {
        // mxPrint
        this.parseMeasureAttributes();
        // updateVoiceInformation;

        this.mxMeasureElements = Array.from(this.mxMeasure.children);
        let i = 0;
        for (const mxObj of this.mxMeasureElements) {
            const tag = mxObj.tagName;
            this.parseIndex = i;
            const methName = this.musicDataMethods[tag];
            if (methName !== undefined) {
                this[methName](mxObj);
            }
            i += 1;
        }
        // useVoices
        // fullMeasureRest
    }

    getStaffNumber(mxObj: Element) {
        if (['harmony', 'forward', 'note', 'direction'].includes(mxObj.tagName)) {
            const mxStaffs = mxObj.getElementsByTagName('staff');
            if (mxStaffs.length) {
                return Number.parseInt(mxStaffs[0].textContent.trim());
            }
            return NO_STAFF_ASSIGNED;
        } else if (
            ['staff-layout', 'staff-details', 'measure-style', 'clef',
                'key', 'time', 'transpose'].includes(mxObj.tagName)) {
            const maybe_number = mxObj.getAttribute('number');
            if (maybe_number) {
                return Number.parseInt(maybe_number);
            }
            return NO_STAFF_ASSIGNED;
        }
        return NO_STAFF_ASSIGNED;
    }

    addToStaffReference(mxObj: Element, m21obj: Music21Object): void {
        const staffKey = this.getStaffNumber(mxObj);
        if (this.staffReference[staffKey] === undefined) {
            this.staffReference[staffKey] = [];
        }
        this.staffReference[staffKey].push(m21obj);
    }

    insertInMeasureOrVoice(mxObj: Element, el: Music21Object): void {
        this.stream.insert(this.offsetMeasureNote, el);
    }

    xmlToNote(mxNote: Element) {
        let nextNoteIsChord = false;
        const mxObjNext = this.mxMeasureElements[this.parseIndex + 1];
        if (mxObjNext !== undefined) {
            if (
                mxObjNext.tagName === 'note'
                && mxObjNext.querySelector('chord')
            ) {
                nextNoteIsChord = true;
            }
        }
        let isChord = false;
        let isRest = false;

        let offsetIncrement = 0.0;
        if (mxNote.querySelector('rest')) {
            isRest = true;
        }
        if (mxNote.querySelector('chord')) {
            isChord = true;
        }
        if (nextNoteIsChord) {
            isChord = true;
        }

        let n;

        if (isChord) {
            this.mxNoteList.push(mxNote);
            this.mxLyricList.push(...Array.from(mxNote.querySelectorAll('lyric')));
        } else if (!isChord && !isRest) {
            // normal note
            this.restAndNoteCount.note += 1;
            n = this.xmlToSimpleNote(mxNote);
        } else {
            this.restAndNoteCount.rest += 1;
            n = this.xmlToRest(mxNote);
        }

        if (!isChord) {
            this.updateLyricsFromList(n, Array.from(mxNote.querySelectorAll('lyric')));
            this.addToStaffReference(mxNote, n);
            this.insertInMeasureOrVoice(mxNote, n);
            offsetIncrement = n.duration.quarterLength;
            this.nLast = n;
            this.offsetMeasureNote += offsetIncrement;
        }

        if (this.mxNoteList.length && !nextNoteIsChord) {
            const c = this.xmlToChord(this.mxNoteList);
            this.updateLyricsFromList(c, this.mxLyricList);
            this.addToStaffReference(this.mxNoteList[0], c);

            // voices;
            this.insertInMeasureOrVoice(mxNote, c);

            this.mxNoteList = [];
            this.mxLyricList = [];
            offsetIncrement = c.duration.quarterLength;
            this.nLast = c;
            this.offsetMeasureNote += offsetIncrement;
        }
    }

    xmlToChord(mxNoteList: Element[]): chord.Chord {
        const notes = [];
        for (const mxNote of mxNoteList) {
            const freeSpanners = false;
            notes.push(this.xmlToSimpleNote(mxNote, freeSpanners));
        }
        const c = new chord.Chord(notes);
        // move beams from first note;
        // move articulations;
        // move expressions;
        // move spanners;

        return c;
    }

    xmlToSimpleNote(mxNote, freeSpanners=true) {
        const n = new note.Note();
        this.xmlToPitch(mxNote, n.pitch);
        // beams;
        // stems;
        // noteheads
        return this.xmlNoteToGeneralNoteHelper(n, mxNote, freeSpanners);
    }

    // xmlToBeam
    // xmlToBeams
    // xmlNotehead

    xmlToPitch(mxNote: Element, inputM21: pitch.Pitch) {
        let p = inputM21;
        if (inputM21 === undefined) {
            p = new pitch.Pitch();
        }

        let mxPitch;
        if (mxNote.tagName === 'pitch') {
            mxPitch = mxNote;
        } else {
            mxPitch = mxNote.querySelector('pitch');
            if (!mxPitch) {
                // whoops!
                return p;
            }
        }

        seta(p, mxPitch, 'step');
        seta(p, mxPitch, 'octave', undefined, parseInt);
        const mxAlter = mxPitch.querySelector('alter');
        let accAlter: number = 0.0;
        if (mxAlter) {
            accAlter = parseFloat(mxAlter.textContent.trim());
        }

        const mxAccidental = mxNote.querySelector('accidental');
        // dropping support for musescore 0.9 errors...
        if (mxAccidental) {
            const accObj = this.xmlToAccidental(mxAccidental);
            p.accidental = accObj;
            p.accidental.displayStatus = true;
            // independent accidental from alter
        } else if (accAlter !== undefined && !Number.isNaN(Number(accAlter))) {
            p.accidental = new pitch.Accidental(accAlter);
            p.accidental.displayStatus = false;
        }
        return p;
    }

    xmlToAccidental(mxAccidental: Element): pitch.Accidental {
        const acc = new pitch.Accidental(0);
        // to-do m21/musicxml accidental name differences;
        let name = mxAccidental.textContent.trim().toLowerCase();
        if (name === 'flat-flat') {
            name = 'double-flat';
        }
        acc.set(name);

        // set print style
        // parentheses
        // bracket
        // editorial
        return acc;
    }

    xmlToRest(mxRest: Element) {
        const r = new note.Rest();
        // full measure rest
        // apply multi-measure rest
        // display-step, octave, etc.
        return this.xmlNoteToGeneralNoteHelper(r, mxRest);
    }

    // noinspection JSUnusedLocalSymbols
    xmlNoteToGeneralNoteHelper(n: note.GeneralNote, mxNote: Element, freeSpanners=true) {
        // spanners
        // setPrintStyle
        // print-object
        // dynamics
        // pizzicato
        // grace
        this.xmlToDuration(mxNote, n.duration);
        // type styles
        // color
        // position
        if (mxNote.querySelector('tie')) {
            n.tie = this.xmlToTie(mxNote);
        }
        // grace
        // notations
        // editorial
        return n;
    }

    xmlToDuration(mxNote, inputM21: duration.Duration) {
        let d = inputM21;
        if (inputM21 === undefined) {
            d = new duration.Duration();
        }
        const divisions = this.divisions;
        const mxDuration = mxNote.querySelector('duration');
        let qLen = 0.0;

        if (mxDuration) {
            const noteDivisions = parseFloat(mxDuration.textContent.trim());
            qLen = noteDivisions / divisions;
        }

        const mxTimeModification = mxNote.querySelector('time-modification');
        const mxType = mxNote.querySelector('type');
        if (mxType) {
            // long vs longa todo
            const durationType = mxType.textContent.trim();
            const numDots = mxNote.querySelectorAll('dot').length;
            d.type = durationType;
            d.dots = numDots;
            // Just first tuplet for now
            if (mxTimeModification) {
                const normalType = mxTimeModification.querySelector('normal-type');
                let normalDur: duration.Duration;
                if (normalType) {
                    normalDur = new duration.Duration(normalType.textContent.trim());
                    normalDur.dots = mxTimeModification.querySelectorAll('normal-dot').length;
                } else {
                    normalDur = d.clone();
                }
                const tuplet = new duration.Tuplet(
                    parseInt(mxTimeModification.querySelector('actual-notes').textContent.trim()),
                    parseInt(mxTimeModification.querySelector('normal-notes').textContent.trim()),
                    normalDur,
                );
                d.appendTuplet(tuplet);
            }
        } else {
            d.quarterLength = qLen;
        }

        return d;
    }

    xmlBackup(mxBackup: Element) {
        const mxDuration = mxBackup.querySelector('duration');
        const change = parseFloat(mxDuration.textContent.trim()) / this.divisions;
        this.offsetMeasureNote -= Math.max(opFrac(change), 0.0);
    }

    xmlForward(mxForward: Element) {
        const mxDuration = mxForward.querySelector('duration');
        const change = parseFloat(mxDuration.textContent.trim()) / this.divisions;
        this.offsetMeasureNote += Math.min(opFrac(change), 0.0);
    }

    // xmlGraceToGrace
    // xmlNotations
    // xmlTechnicalToArticulation
    // setHarmonic
    // handleFingering
    // xmlToArticulation
    // xmlOrnamentToExpression
    // xmlDirectionTypeToSpanners
    // xmlNotationsToSpanners
    // xmlToTremolo
    // xmlOneSpanner

    xmlToTie(mxNote: Element): tie.Tie {
        const t = new tie.Tie();
        const allTies = mxNote.querySelectorAll('tie');
        if (allTies.length > 1) {
            t.type = 'continue';
        } else {
            const t0 = allTies[0];
            t.type = t0.getAttribute('type');
        }
        // style
        return t;
    }

    // xmlToTuplets
    updateLyricsFromList(n, lyricList) {
        let currentLyricNumber = 1;
        for (const mxLyric of lyricList) {
            const lyricObj = this.xmlToLyric(mxLyric);
            if (lyricObj === undefined) {
                continue;
            }
            if (lyricObj.number === 0) {
                lyricObj.number = currentLyricNumber;
            }
            n.lyrics.push(lyricObj);
            currentLyricNumber += 1;
        }
    }

    xmlToLyric(mxLyric: Element, inputM21?: note.Lyric): note.Lyric {
        let l = inputM21;
        if (inputM21 === undefined) {
            l = new note.Lyric('');
        }
        try {
            l.text = mxLyric.querySelector('text').textContent.trim();
        } catch (exc) {
            return undefined; // sometimes there are empty lyrics.
        }
        const number = mxLyric.getAttribute('number');
        try {
            const num = parseInt(number);
            l.number = num;
        } catch (exc) {
            l.number = 0;
            if (number !== undefined) {
                l.identifier = number.toString();
            }
        }
        const identifier: string = mxLyric.getAttribute('name');
        if (identifier !== undefined) {
            l.identifier = identifier;
        }

        const mxSyllabic = mxLyric.querySelector('syllabic');
        if (mxSyllabic) {
            l.syllabic = mxSyllabic.textContent.trim();
        }
        // setStyleAttributes
        // setColor
        // setPosition
        if (inputM21 === undefined) {
            return l;
        }
        return undefined;
    }


    insertIntoMeasureOrVoice(mxElement: Element, el: Music21Object) {
        this.stream.insert(this.offsetMeasureNote, el);
    }

    parseMeasureAttributes() {
        this.parseMeasureNumbers();
        // width;
    }

    parseMeasureNumbers() {
        const mNumRaw = this.mxMeasure.getAttribute('number');
        const mNum = parseInt(mNumRaw); // no suffixes...
        this.stream.number = mNum;
        if (this.parent) {
            this.parent.lastMeasureNumber = mNum;
        }
        this.measureNumber = mNum;
    }

    parseAttributesTag(mxAttributes) {
        this.attributesAreInternal = false;
        this.activeAttributes = mxAttributes;
        for (const mxSub of <Element[]> Array.from(mxAttributes.children)) {
            const tag = mxSub.tagName;
            const methName = this.attributeTagsToMethods[tag];
            if (methName !== undefined) {
                this[methName](mxSub);
            } else if (tag === 'staves') {
                this.staves = parseInt(mxSub.textContent.trim());
            } else if (tag === 'divisions') {
                this.divisions = parseFloat(mxSub.textContent.trim());
            }
            // transpose;
        }
        if (this.parent !== undefined) {
            this.parent.lastDivisions = this.divisions;
            this.parent.activeAttributes = this.activeAttributes;
        }
    }
    // xmlTransposeToInterval

    handleTimeSignature(mxTime) {
        const ts = this.xmlToTimeSignature(mxTime);
        this.addToStaffReference(mxTime, ts);
        this.insertIntoMeasureOrVoice(mxTime, ts);
    }

    xmlToTimeSignature(mxTime) {
        // senza-misura
        // simple time signature only;
        const numerator = mxTime.querySelector('beats').textContent.trim();
        const denominator = mxTime.querySelector('beat-type').textContent.trim();
        return new meter.TimeSignature(numerator + '/' + denominator);
        // symbol
    }

    handleClef(mxClef) {
        const clefObj = this.xmlToClef(mxClef);
        this.addToStaffReference(mxClef, clefObj);
        this.insertIntoMeasureOrVoice(mxClef, clefObj);
        this.lastClefs[0] = clefObj;
        // if (this.parent !== undefined) {
        //     this.parent.lastClefs[0] = clefObj.clone(true);
        // }
    }

    xmlToClef(mxClef) {
        const sign = mxClef.querySelector('sign').textContent.trim();
        if (sign === 'percussion') {
            return clef.clefFromString(sign);
        }
        const line = mxClef.querySelector('line').textContent.trim();

        let clefOctaveChange = 0;
        const coc = mxClef.querySelector('clef-octave-change');
        if (coc) {
            clefOctaveChange = parseInt(coc.textContent.trim());
        }
        return clef.clefFromString(sign + line, clefOctaveChange);
    }

    handleKeySignature(mxKey) {
        const keySig = this.xmlToKeySignature(mxKey);
        this.addToStaffReference(mxKey, keySig);
        this.insertIntoMeasureOrVoice(mxKey, keySig);
    }

    xmlToKeySignature(mxKey) {
        const ks = new key.KeySignature();
        seta(ks, mxKey, 'fifths', 'sharps', parseInt);
        // mode!
        // non-standard and key-octaves
        return ks;
    }
}

const musicxml = {
    ScoreParser,
    PartParser,
    MeasureParser,
};

export default musicxml;
