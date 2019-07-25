import { clef } from '../clef.js';
import { common } from '../common.js';
import { Stream, Measure, Part, Score } from '../stream.js';

import { Music21Exception } from '../exceptions21.js';

class MusicXMLExportException extends Music21Exception {
    
}

function typeToMusicXMLType(value) {
    if (value === 'longa') {
        return 'long';
    } else if (value === '2048th') {
        throw new MusicXMLExportException('Cannot convert "2048th" duration to MusicXML (too short).');
    } else {
        return value;
    }
}

function normalizeColor(color) {
    const colors = {
        'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff', 
        'aquamarine': '#7fffd4', 'azure': '#f0ffff',
        'beige': '#f5f5dc', 'bisque': '#ffe4c4', 'black': '#000000', 
        'blanchedalmond': '#ffebcd', 'blue': '#0000ff', 'blueviolet': '#8a2be2', 
        'brown': '#a52a2a', 'burlywood': '#deb887',
        'cadetblue': '#5f9ea0', 'chartreuse': '#7fff00', 'chocolate': '#d2691e', 
        'coral': '#ff7f50', 'cornflowerblue': '#6495ed', 'cornsilk': '#fff8dc', 
        'crimson': '#dc143c', 'cyan': '#00ffff',
        'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b', 
        'darkgray': '#a9a9a9', 'darkgreen': '#006400', 'darkkhaki': '#bdb76b', 
        'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f',
        'darkorange': '#ff8c00', 'darkorchid': '#9932cc', 'darkred': '#8b0000', 
        'darksalmon': '#e9967a', 'darkseagreen': '#8fbc8f', 'darkslateblue': '#483d8b', 
        'darkslategray': '#2f4f4f', 'darkturquoise': '#00ced1',
        'darkviolet': '#9400d3', 'deeppink': '#ff1493', 'deepskyblue': '#00bfff', 
        'dimgray': '#696969', 'dodgerblue': '#1e90ff',
        'firebrick': '#b22222', 'floralwhite': '#fffaf0', 'forestgreen': '#228b22', 
        'fuchsia': '#ff00ff',
        'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff', 'gold': '#ffd700', 
        'goldenrod': '#daa520', 'gray': '#808080', 'green': '#008000', 
        'greenyellow': '#adff2f',
        'honeydew': '#f0fff0', 'hotpink': '#ff69b4',
        'indianred ': '#cd5c5c', 'indigo': '#4b0082', 'ivory': '#fffff0', 
        'khaki': '#f0e68c',
        'lavender': '#e6e6fa', 'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00', 
        'lemonchiffon': '#fffacd', 'lightblue': '#add8e6', 'lightcoral': '#f08080', 
        'lightcyan': '#e0ffff', 'lightgoldenrodyellow': '#fafad2',
        'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90', 'lightpink': '#ffb6c1', 
        'lightsalmon': '#ffa07a', 'lightseagreen': '#20b2aa', 'lightskyblue': '#87cefa', 
        'lightslategray': '#778899', 'lightsteelblue': '#b0c4de',
        'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32', 
        'linen': '#faf0e6',
        'magenta': '#ff00ff', 'maroon': '#800000', 'mediumaquamarine': '#66cdaa', 
        'mediumblue': '#0000cd', 'mediumorchid': '#ba55d3', 'mediumpurple': '#9370d8', 
        'mediumseagreen': '#3cb371', 'mediumslateblue': '#7b68ee',
        'mediumspringgreen': '#00fa9a', 'mediumturquoise': '#48d1cc', 
        'mediumvioletred': '#c71585', 'midnightblue': '#191970', 'mintcream': '#f5fffa', 
        'mistyrose': '#ffe4e1', 'moccasin': '#ffe4b5',
        'navajowhite': '#ffdead', 'navy': '#000080',
        'oldlace': '#fdf5e6', 'olive': '#808000', 'olivedrab': '#6b8e23', 
        'orange': '#ffa500', 'orangered': '#ff4500', 'orchid': '#da70d6',
        'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee', 
        'palevioletred': '#d87093', 'papayawhip': '#ffefd5', 'peachpuff': '#ffdab9', 
        'peru': '#cd853f', 'pink': '#ffc0cb', 'plum': '#dda0dd', 'powderblue': '#b0e0e6', 
        'purple': '#800080',
        'rebeccapurple': '#663399', 'red': '#ff0000', 'rosybrown': '#bc8f8f', 
        'royalblue': '#4169e1',
        'saddlebrown': '#8b4513', 'salmon': '#fa8072', 'sandybrown': '#f4a460', 
        'seagreen': '#2e8b57', 'seashell': '#fff5ee', 'sienna': '#a0522d', 
        'silver': '#c0c0c0', 'skyblue': '#87ceeb', 'slateblue': '#6a5acd', 
        'slategray': '#708090', 'snow': '#fffafa', 'springgreen': '#00ff7f', 
        'steelblue': '#4682b4',
        'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 
        'turquoise': '#40e0d0',
        'violet': '#ee82ee',
        'wheat': '#f5deb3', 'white': '#ffffff', 'whitesmoke': '#f5f5f5',
        'yellow': '#ffff00', 'yellowgreen': '#9acd32',
    };
    if (color === undefined || color === '') {
        return color;
    } else if (!color.startsWith('#')) {
        return colors[color].toUpperCase();
    } else {
        return color.toUpperCase();
    }
}


const _classMapping = [
    'Score', 'Part', 'Measure', 'Voice', // 'Stream', 
    'GeneralNote', // 'Pitch', 'Duration', 'Dynamic', 'DiatonicScale', 'Scale',
    // 'Music21Object',
];

export class GeneralObjectExporter {
    constructor(obj) {
        this.generalObj = obj;
    }
    
    parse(obj) {
        if (obj === undefined) {
            obj = this.generalObj;
        }
        const outObj = this.fromGeneralObj(obj);
        return this.parseWellformedObject(outObj);
    }
    
    parseWellformedObject(sc) {
        const scoreExporter = new ScoreExporter(sc);
        scoreExporter.parse();
        return scoreExporter.asBytes();
    }
    
    fromGeneralObj(obj) {
        const classes = obj.classes;
        let outObj;
        for (const cM of _classMapping) {
            if (classes.includes(cM)) {
                const methName = 'from' + cM;
                outObj = this[methName](obj);
                break;
            }
        }        
        if (outObj === undefined) {
            throw new MusicXMLExportException(`Cannot translate the object ${obj} to a complete musicXML document; put it in a Stream first!`);
        }
        return outObj;
    }
    
    fromScore(sc) {
        const scOut = sc.makeNotation({ inPlace: false });
        return scOut;
    }
    
    fromPart(p) {
        if (p.isFlat) {
            p = p.makeMeasures();
        }
        const s = new Score();
        s.insert(0, p);
        // metadata...;
        return this.fromScore(s);
    }
    
    fromMeasure(m) {
        const mCopy = m.makeNotation();
        if (m.clef === undefined) {
            mCopy.clef = clef.bestClef(mCopy, { recurse: true });
        }
        const p = new Part();
        p.append(mCopy);
        // TODO(msc): metadata;
        return this.fromPart(p);
    }
    
    fromVoice(v) {
        const m = new Measure();
        m.number = 1;
        m.insert(0, v);
        return this.fromMeasure(m);
    }
    
    // TODO(msc): fromStream
    // TODO(msc): fromDuration
    // TODO(msc): fromDynamic
    // TODO(msc): fromScale
    // TODO(msc): fromDiatonicScale
    // TODO(msc): fromMusic21Object
    
    fromGeneralNote(n) {
        const nCopy = n.clone(true);
        // makeTupletBrackets;
        const out = new Measure();
        out.number = 1;
        out.append(nCopy);
        
        return this.fromMeasure(out);
    }
    
    // TODO(msc): fromPitch
}

const _musicxmlVersion = '3.0';

export class XMLExporterBase {
    constructor() {
        this.doc = document.implementation.createDocument('', '', null);
        this.xmlRoot = undefined;
    }
    
    asBytes({ noCopy=true }={}) {
        let out = this.xmlHeader();
        const oSerializer = new XMLSerializer();
        out += oSerializer.serializeToString(this.xmlRoot);
        return out;
    }
    
    // no indentation :-(
    
    xmlHeader() {
        return `<?xml version="1.0" encoding="utf-8"?>
        <!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML ${_musicxmlVersion}  Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
        `;
    }
    
    /**
     * Note: this is not a method in music21p, but it needs access to this.doc in music21j
     */
    _setTagTextFromAttribute(m21El, xmlEl, tag, attributeName, { transform, forceEmpty=false }={}) {
        if (attributeName === undefined) {
            attributeName = common.hyphenToCamelCase(tag);
        }
        
        let value = m21El[attributeName];
        if (transform !== undefined) {
            value = transform(value);
        }
        if ((value === undefined || value === '') && !forceEmpty) {
            return undefined;
        }
        const subElement = this.subElement(xmlEl, tag);
        if (value !== undefined) {
            subElement.innerHTML = value;
        }
        return subElement;
    }
    
    seta(m21El, xmlEl, tag, options) {
        return this._setTagTextFromAttribute(m21El, xmlEl, tag, options);
    }
    
    _setAttributeFromAttribute(m21El, xmlEl, xmlAttributeName, { attributeName, transform }={}) {
        if (attributeName === undefined) {
            attributeName = common.hyphenToCamelCase(xmlAttributeName);
        }
        let value = m21El[attributeName];
        if (value === undefined) {
            return;
        }
        if (transform !== undefined) {
            value = transform(value);
        }
        xmlEl.setAttribute(xmlAttributeName, value.toString());
    }
    
    setb(m21El, xmlEl, xmlAttributeName, options) {
        return this._setAttributeFromAttribute(m21El, xmlEl, xmlAttributeName, options);
    }
    // TODO(msc): _synchronizeIds;
    _synchronizeIds(element, m21Object) {}
    
    addDividerComment(comment='') {
        let commentLength = comment.length;
        if (commentLength > 60) {
            commentLength = 60;
        }
        const spacerLengthLow = Math.floor((60 - commentLength) / 2);
        const spacerLengthHigh = Math.ceil((60 - commentLength) / 2);
        const commentText = '='.repeat(spacerLengthLow) + ' ' + comment + ' ' + '='.repeat(spacerLengthHigh);
        const divider = this.doc.createComment(commentText);
        this.xmlRoot.appendChild(divider);
    }
    
    // TODO(msc): dump
    
    /**
     * Helper method since SubElement does not exist in javascript document.implementation
     */
    subElement(el, tag) {
        const subElement = this.doc.createElement(tag);
        el.appendChild(subElement);
        return subElement;
    }
    
    // TODO(msc): setStyleAttributes
    // TODO(msc): setTextFormatting
    // TODO(msc): setPrintStyleAlign
    // TODO(msc): setPrintStyle
    // TODO(msc): setPrintObject
    setColor(mxObject, m21Object) {
        if (m21Object.color !== undefined) {
            mxObject.setAttribute('color', normalizeColor(m21Object.color));
        } else if (m21Object.style !== undefined && m21Object.style.color !== undefined) {
            mxObject.setAttribute('color', normalizeColor(m21Object.style.color));
        }
    }
    
    // TODO(msc): setFont
    // TODO(msc): setPosition
    // TODO(msc): setEditorial
    setEditorial(mxEl, el) {
        
    }
    
    // TODO(msc): pageLayoutToXmlPrint
    // TODO(msc): pageLayoutToXmlPageLayout
    // TODO(msc): systemLayoutToXmlPrint
    // TODO(msc): systemLayoutToXmlSystemLayout
    // TODO(msc): staffLayoutToXmlStaffLayout
    
    accidentalToMx(a) {
        // TODO(msc): v 3.0 and v3.1 accidentals; microtone;
        let mxName;
        if (a.name === 'double-flat') {
            mxName = 'flat-flat';
        } else {
            mxName = a.name;
            // check other accidentals here.
        }
        const mxAccidental = this.doc.createElement('accidental');
        mxAccidental.innerHTML = mxName;
        // TODO(msc): parentheses, bracket, setPrintStyle
        return mxAccidental;
    }    

    getRandomId() {
        // hack to get random ids.
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        for (let i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

}

export class ScoreExporter extends XMLExporterBase {
    constructor(score) {
        super();
        if (score === undefined) {
            this.stream = new Score();
        } else {
            this.stream = score;
        }
        this.xmlRoot = this.doc.createElement('score-partwise');
        this.xmlRoot.setAttribute('version', _musicxmlVersion);
        this.xmIdentification = undefined;
        this.scoreMetadata = undefined;
        this.spannerBundle = undefined;
        this.meterStream = undefined;
        this.scoreLayouts = undefined;
        this.firstScoreLayout = undefined;
        this.highestTime = 0.0;
        this.refStreamOrTimeRange = [0.0, this.highestTime];
        this.partExporterList = [];
        this.instrumentList = [];
        this.midiChannelList = [];
        this.parts = [];
    }
    
    parse() {
        const s = this.stream;
        if (s.length === 0) {
            return this.emptyObject();
        }
        this.scorePreliminaries();
        this.parsePartlikeScore(); // does not have parseFlatScore... 
        this.postPartProcess();
        this.partExporterList = [];
        return this.xmlRoot;
    }
    
    emptyObject() {
        // TODO(msc): do this.
        return this.xmlRoot;
    }
    
    scorePreliminaries() {
        // this.setScoreLayouts();
        // this.setMeterStream();
        this.setPartsAndRefStream();
        // this.textBoxes = ...;
        this.highestTime = 0.0;
        // spannerBundle
    }
    
    setPartsAndRefStream() {
        const s = this.stream;
        const streamOfStreams = s.getElementsByClass('Stream');
        for (const innerStream of streamOfStreams) {
            // innerStream.transferOffsetToElements(); // only needed for appended Parts
            const ht = innerStream.highestTime;
            if (ht > this.highestTime) {
                this.highestTime = ht;
            }
            this.refStreamOrTimeRange = [0.0, this.highestTime];
        }
        this.parts = streamOfStreams;
    }
    
    // TODO(msc): setMeterStream
    // TODO(msc): setScoreLayouts
    
    parsePartlikeScore() {
        // makeRests
        for (const innerStream of this.parts) {
            const pp = new PartExporter(innerStream, { parent: this });
            // spanner bundle.
            pp.parse();
            this.partExporterList.push(pp);
        }
    }
    
    // TODO(msc): parseFlatScore
    
    postPartProcess() {
        this.setScoreHeader();
        for (let i = 0; i < this.partExporterList.length; i++) {
            const pex = this.partExporterList[i];
            this.addDividerComment('Part ' + i.toString());
            this.xmlRoot.appendChild(pex.xmlRoot);
        }
    }
    
    setScoreHeader() {
        // const s = this.stream;
        // scoreMeatadata
        // titles
        // identification
        // setDefaults
        // textBoxes
        this.setPartList();
    }
    
    // TODO(msc): textBoxToXmlCredit
    // TODO(msc): setDefaults
    // TODO(msc): addStyleToXmlDefaults
    // TODO(msc): styleToXmlAppearance
    
    setPartList() {
        // const spannerBundle = this.spannerBundle; // for now, always undefined;
        const mxPartList = this.subElement(this.xmlRoot, 'part-list');
        // staffGroups are non-existent
        for (const pex of this.partExporterList) {
            // const p = pex.stream;
            const mxScorePart = pex.getXmlScorePart();
            mxPartList.appendChild(mxScorePart);
        }
        return mxPartList;
    }
    // TODO(msc): staffGroupToXmlPartGroup;
    // TODO(msc): setIdentification
    // TODO(msc): metadataToMiscellaneous
    // TODO(msc): setEncoding
    // TODO(msc): getSupports
    // TODO(msc): setTitles
    // TODO(msc): contributorToXmlCreator    
}

export class PartExporter extends XMLExporterBase {
    constructor(partObj, { parent }={}) {
        super();
        this.stream = partObj;
        this.parent = parent;
        this.xmlRoot = this.doc.createElement('part');
        if (parent === undefined) {
            this.meterStream = new Stream();
            this.refStreamOrTimeRange = [0.0, 0.0];
            this.midiChannelList = [];
        } else {
            this.meterStream = parent.meterStream;
            this.refStreamOrTimeRange = parent.refStreamOrTimeRange;
            this.midiChannelList = parent.midiChannelList;
        }
        this.instrumentStream = undefined;
        this.firstInstrumentObject = undefined;
        
        this.lastDivisions = undefined;
        this.spannerBundle = partObj.spannerBundle;
        this.xmlPartId = this.getRandomId(); // hacky
    }
    
    parse() {
        // this.instrumentSetup();
        this.xmlRoot.setAttribute('id', this.xmlPartId);
        const measureStream = this.stream.getElementsByClass('Stream');
        // fixupNotation;
        // setIdLocals on spannerBundle;
        for (const m of measureStream) {
            this.addDividerComment('Measure ' + m.number.toString());
            const measureExporter = new MeasureExporter(m, { parent: this });
            measureExporter.spannerBundle = this.spannerBundle;
            const mxMeasure = measureExporter.parse();
            this.xmlRoot.appendChild(mxMeasure);
        }
        return this.xmlRoot;
    }
        
    // TODO(msc): instrumentSetup
    // TODO(msc): fixupNotationFlat -- might be redundant
    // TODO(msc): fixupNotationMeasured
    
    getXmlScorePart() {
        // const part = this.stream;
        const mxScorePart = this.doc.createElement('score-part');
        mxScorePart.setAttribute('id', this.xmlPartId);
        // partName
        // partAbbreviation
        // instrument
        return mxScorePart;
    }
    // TODO(msc): instrumentToXmlScoreInstrument
    // TODO(msc): instrumentToXmlMidiInstrument
}

const _classesToMeasureMethods = [
    ['Note', 'noteToXml'],
    // NoChord
    // ChordWithFretBoard
    // ChordSymbol
    ['Chord', 'chordToXml'],
    ['Rest', 'restToXml'],
    // Dynamic, Segno, Coda, MetronomeMark, MetricModulation,
    // TextExpression, RepeatExpression, RehersalMark
];

const _wrapAttributeMethodClasses = [
    ['Clef', 'clefToXml'],
    ['KeySignature', 'keySignatureToXml'],
    ['TimeSignature', 'timeSignatureToXml'],
];

const _ignoreOnParseClasses = ['LayoutBase', 'Barline'];

const divisionsPerQuarter = 32 * 3 * 3 * 5 * 7; // TODO(msc): create defaults.js

export class MeasureExporter extends XMLExporterBase {
    constructor(measureObj, { parent }={}) {
        super();
        this.stream = measureObj;
        this.parent = parent;
        this.xmlRoot = this.doc.createElement('measure');
        this.currentDivisions = divisionsPerQuarter;
        this.transpositionInterval = undefined;
        this.mxTranspose = undefined;
        this.measureOffsetStart = 0.0;
        this.offsetInMeasure = 0.0;
        this.currentVoiceId = undefined;
        
        this.rbSpanners = [];
        this.spannerBundle = parent.spannerBundle;
        
        this.objectSpannerBundle = this.spannerBundle;
    }
    
    parse() {
        // TODO(msc): setTranspose
        // TODO(msc): setRbSpanners
        this.setMxAttributes();
        // TODO(msc): setMxPrint
        this.setMxAttributesObjectForStartOfMeasure();
        // TODO(msc): setLeftBarline
        
        // THE BIG ONE
        this.mainElementsParse();
        
        // TODO(msc): setRightBarline
        return this.xmlRoot;
    }
    
    mainElementsParse() {
        const m = this.stream;
        if (!m.hasVoices()) {
            this.parseFlatElements(m, { backupAfterwards: false });
            return;
        }
        // TODO(msc): parse elements outside of Voices...needs getElementsNotOfClass
        const allVoices = Array.from(m.voices);
        for (const [i, v] of allVoices.entries()) {
            let backupAfterwards = true;
            if (i === allVoices.length - 1) {
                backupAfterwards = false;
            }
            this.parseFlatElements(v, { backupAfterwards });
        }        
    }
    
    parseFlatElements(m, { backupAfterwards=false }={}) {
        const root = this.xmlRoot;
        const divisions = this.currentDivisions;
        this.offsetInMeasure = 0.0;
        let voiceId;
        if (m.classes.includes('Voice')) {
            voiceId = m.id;
            if (voiceId === undefined) {
                voiceId = this.getRandomId();
            }
        }
        this.currentVoiceId = voiceId;
        
        for (const el of m) {
            this.parseOneElement(el);
        }
        
        if (backupAfterwards) {
            const amountToBackup = Math.round(divisions * this.offsetInMeasure);
            if (amountToBackup > 0) {
                const mxBackup = this.doc.createElement('backup');
                const mxDuration = this.subElement(mxBackup, 'duration');
                mxDuration.innerHTML = amountToBackup.toString();
                root.appendChild(mxBackup);
            }
        }
        this.currentVoiceId = undefined;
    }
    
    parseOneElement(obj) {
        // const root = this.xmlRoot;
        // spanners...
        const classes = obj.classes;
        if (classes.includes('GeneralNote')) {
            this.offsetInMeasure += obj.duration.quarterLength;
        }
        // odd durations...
        
        let parsedObject = false;
        
        for (const [className, methName] of _classesToMeasureMethods) {
            if (classes.includes(className)) {
                this[methName](obj);
                parsedObject = true;
                break;
            }
        }
        
        for (const [className, methName] of _wrapAttributeMethodClasses) {
            if (classes.includes(className)) {
                const meth = o => this[methName](o);
                this.wrapObjectInAttributes(obj, meth);
                parsedObject = true;
                break;
            }
        }
        
        // deal with skipped objects.
        if (!parsedObject && !_ignoreOnParseClasses.includes(obj.classes[0])) {
            console.warn('skipped object of class ' + obj.classes[0]);
        }
        
        // postSpanners.
    }
    
    // TODO(msc): prePostObjectSpanners
    // TODO(msc): _spannerStartParameters
    // TODO(msc): _spannerEndParameters
    // TODO(msc): objectAttachedSpaners

    /**
     *
     * @param {music21.note.GeneralNote} n
     * @param noteIndexInChord
     * @param chordParent
     * @returns {HTMLElement}
     */
    noteToXml(n, { noteIndexInChord=0, chordParent }={}) {
        const addChordTag = (noteIndexInChord !== 0);
        let chordOrN;
        if (chordParent === undefined) {
            chordOrN = n;
        } else {
            chordOrN = chordParent;
        }
        const mxNote = this.doc.createElement('note');
        // setPrintStyle
        // volumeInformation
        this.setColor(mxNote, n);
        // _synchronizeId;
        const d = chordOrN.duration;
        // grace;
        // setColor chord
        // setPrintObject
        // hideObject
        // articulation pizz:
        if (addChordTag) {
            this.subElement(mxNote, 'chord');
        }
        if (n.pitch !== undefined) {
            const mxPitch = this.pitchToXml(n.pitch);
            mxNote.appendChild(mxPitch);
        } else {
            this.subElement(mxNote, 'rest');
        }
        if (d.isGrace !== true) {
            const mxDuration = this.durationXml(d);
            mxNote.appendChild(mxDuration);
        }
        if (n.tie !== undefined) {
            const mxTieList = this.tieToXmlTie(n.tie);
            for (const t of mxTieList) {
                mxNote.appendChild(t);
            }
        }
        // instrument
        this.setEditorial(mxNote, n);
        if (this.currentVoiceId !== undefined) {
            const mxVoice = this.subElement(mxNote, 'voice');
            let vId;
            if (typeof vId === 'number') {
                vId = this.currentVoiceId + 1;
            } else {
                // not a number;
                vId = this.currentVoiceId;
            }
            mxVoice.innerHTML = vId.toString();
        }
        
        const mxType = this.subElement(mxNote, 'type');
        mxType.innerHTML = typeToMusicXMLType(d.type);
        // set styleAttributes
        // set noteSize
        for (let _ = 0; _ < d.dots; _++) {
            this.subElement(mxNote, 'dot');
        }
        
        // components.
        if (n.pitch !== undefined 
                && n.pitch.accidental !== undefined 
                && n.pitch.accidental.displayStatus !== false) {
            const mxAccidental = this.accidentalToMx(n.pitch.accidental);
            mxNote.appendChild(mxAccidental);
        }
        if (d.tuplets.length > 0) {
            // todo--nested tuplets;
            const mxTimeModification = this.tupletToTimeModification(d.tuplets[0]);
            mxNote.appendChild(mxTimeModification);
        }
        
        let stemDirection;
        if (!addChordTag 
                && ![undefined, 'unspecified'].includes(chordOrN.stemDirection)) {
            stemDirection = chordOrN.stemDirection;
        } else if (chordOrN !== n 
                && ![undefined, 'unspecified'].includes(n.stemDirection)) {
            stemDirection = n.stemDirection;
        }
        if (stemDirection !== undefined) {
            const mxStem = this.subElement(mxNote, 'stem');
            let sdtext = stemDirection;
            if (sdtext === 'noStem') {
                sdtext = 'none';
            }
            mxStem.innerHTML = sdtext;
            // TODO: stemStyle
        }
        
        // dealWithNotehead
        // beams
        // staff
        // notations
        // tuplet display
        // notations
        if (!addChordTag) {
            for (const lyricObj of chordOrN.lyrics) {
                if (lyricObj.text === undefined) {
                    continue;
                }
                const mxLyric = this.lyricToXml(lyricObj);
                mxNote.appendChild(mxLyric);
            }
        }
        
        this.xmlRoot.appendChild(mxNote);
        return mxNote;
    }
    
    restToXml(r) {
        return this.noteToXml(r);
        // full measure
        // display-step, display-octave, etc.
    }
    
    chordToXml(c) {
        const mxNoteList = [];
        for (const [i, n] of Array.from(c).entries()) {
            const mxNote = this.noteToXml(n, { noteIndexInChord: i, chordParent: c });
            mxNoteList.push(mxNote);
        }
        return mxNoteList;
    }
    
    durationXml(dur) {
        const mxDuration = this.doc.createElement('duration');
        mxDuration.innerHTML = Math.round(this.currentDivisions * dur.quarterLength).toString();
        return mxDuration;
    }
    
    pitchToXml(p) {
        const mxPitch = this.doc.createElement('pitch');
        this._setTagTextFromAttribute(p, mxPitch, 'step');
        if (p.accidental !== undefined) {
            const mxAlter = this.subElement(mxPitch, 'alter');
            mxAlter.innerHTML = common.numToIntOrFloat(p.accidental.alter).toString();
        }
        this._setTagTextFromAttribute(p, mxPitch, 'octave', 'implicitOctave');
        return mxPitch;
    }
    // TODO(msc): fretNoteToXml
    // TODO(msc): fretBoardToXml
    // TODO(msc): chordWithFretBoardToXml
    
    tupletToTimeModification(tup) {
        const mxTimeModification = this.doc.createElement('time-modification');
        this._setTagTextFromAttribute(tup, mxTimeModification, 'actual-notes', 'numberNotesActual');
        this._setTagTextFromAttribute(tup, mxTimeModification, 'normal-notes', 'numberNotesNormal');
        if (tup.durationNormal !== undefined) {
            const mxNormalType = this.subElement(mxTimeModification, 'normal-type');
            mxNormalType.innerHTML = typeToMusicXMLType(tup.durationNormal.type);
            if (tup.durationNormal.dots > 0) {
                for (let i = 0; i < tup.durationNormal.dots; i++) {
                    this.subElement(mxTimeModification, 'normal-dot');
                }
            }
        }
        return mxTimeModification;
    }
    
    // TODO(msc): dealWithNotehead
    // TODO(msc): noteheadToXml
    // TODO(msc): noteToNotations
    
    tieToXmlTie(t) {
        const mxTieList = [];
        let musicxmlTieType = t.type;
        if (t.type === 'continue') {
            musicxmlTieType = 'stop';
        }
        const mxTie = this.doc.createElement('tie');
        mxTie.setAttribute('type', musicxmlTieType);
        mxTieList.push(mxTie);
        
        if (t.type === 'continue') {
            const mxTie = this.doc.createElement('tie');
            mxTie.setAttribute('type', 'start');
            mxTieList.push(mxTie);            
        }
        return mxTieList;
    }
    
    // TODO(msc): tieToXmlTied -- needs notations
    // TODO(msc): tupletToXmlTuplet
    // TODO(msc): expressionToXml
    // TODO(msc): articulationToXmlArticulation
    // TODO(msc): setLineStyle
    // TODO(msc): articulationToXmlTechnical
    // TODO(msc): setHarmonic
    // TODO(msc): noChordToXml
    // TODO(msc): chordSymbolToXml
    // TODO(msc): setOffsetOptional
    // TODO(msc): placeInDirection
    // TODO(msc): dynamicToXml
    // TODO(msc): segnoToXml
    // TODO(msc): codaToXml
    // TODO(msc): tempoIndicationToXml
    // TODO(msc): rehearsalMarkToXml
    // TODO(msc): textExpressionToXml
    
    wrapObjectInAttributes(objectToWrap, methodToMx) {
        if (this.offsetInMeasure === 0.0) {
            return undefined;
        }
        
        const mxAttributes = this.doc.createElement('attributes');
        const mxObj = methodToMx(objectToWrap);
        mxAttributes.appendChild(mxObj);
        this.xmlRoot.appendChild(mxAttributes);
        return mxAttributes;
    }
    
    lyricToXml(l) {
        const mxLyric = this.doc.createElement('lyric');
        this._setTagTextFromAttribute(l, mxLyric, 'syllabic');
        this._setTagTextFromAttribute(l, mxLyric, 'text', 'text', { forceEmpty: true });
        if (l.identifier !== undefined) {
            mxLyric.setAttribute('name', l.identifier.toString());
        }

        if (l.number !== undefined) {
            mxLyric.setAttribute('number', l.number.toString());
        } else if (l.identifier !== undefined) {
            mxLyric.setAttribute('number', l.identifier.toString());
        }
        // setStyleAttributes
        // setPrintObject
        // setColor
        // setPosition
        return mxLyric;             
    }
    // TODO(msc): beamsToXml
    // TODO(msc): beamToXml
    // TODO(msc): setRightBarline
    // TODO(msc): setLeftBarline
    // TODO(msc): setBarline
    // TODO(msc): barlineToXml
    // TODO(msc): repeatToXml
    
    setMxAttributesObjectForStartOfMeasure() {
        const m = this.stream;
        const mxAttributes = this.doc.createElement('attributes');
        let appendToRoot = false;
        this.currentDivisions = divisionsPerQuarter;
        if (this.parent === undefined || this.currentDivisions !== this.parent.lastDivisions) {
            const mxDivisions = this.subElement(mxAttributes, 'divisions');
            mxDivisions.innerHTML = this.currentDivisions.toString();
            this.parent.lastDivisions = this.currentDivisions;
            appendToRoot = true;
        }
        if (m.classes.includes('Measure')) {
            if (m._keySignature !== undefined) {
                mxAttributes.appendChild(this.keySignatureToXml(m._keySignature));
                appendToRoot = true;
            }
            if (m._timeSignature !== undefined) {
                mxAttributes.appendChild(this.timeSignatureToXml(m._timeSignature));
                appendToRoot = true;
            }
            // todo SenzaMisura...
            if (m._clef !== undefined) {
                mxAttributes.appendChild(this.clefToXml(m._clef));
                appendToRoot = true;
            }
        }
        
        // staffLayout
        // transpositionInterval
        // measureStyle
        if (appendToRoot) {
            this.xmlRoot.appendChild(mxAttributes);
        }
        return mxAttributes;
    }
    // TODO(msc): measureStyle
    // TODO(msc): staffLayoutToXmlStaffDetails
    
    timeSignatureToXml(ts) {
        const mxTime = this.doc.createElement('time');
        // synchronizeIds
        // senzaMisura
        // summed denominators, compound etc.
        const mxBeats = this.subElement(mxTime, 'beats');
        mxBeats.innerHTML = ts.numerator.toString();
        const mxBeatType = this.subElement(mxTime, 'beat-type');
        mxBeatType.innerHTML = ts.denominator.toString();
        // symbolizeDenominator
        // separator
        // style
        return mxTime;
    }
    
    keySignatureToXml(keyOrKeySignature) {
        const mxKey = this.doc.createElement('key');
        // synchronizeIds
        // number
        // printStyle, print-object
        this.seta(keyOrKeySignature, mxKey, 'fifths', 'sharps');
        if (keyOrKeySignature.mode !== undefined) {
            this.seta(keyOrKeySignature, mxKey, 'mode');            
        }
        // non-traditional
        // altered pitches
        return mxKey;
    }
    
    clefToXml(clefObj) {
        const mxClef = this.doc.createElement('clef');
        // printstyle
        const sign = clefObj.sign || 'G';
        const mxSign = this.subElement(mxClef, 'sign');
        mxSign.innerHTML = sign;
        this.seta(clefObj, mxClef, 'line');
        if (clefObj.octaveChange !== undefined && clefObj.octaveChange !== 0) {
            this.seta(clefObj, mxClef, 'clef-octave-change', 'octaveChange');
        }
        return mxClef;
    }
    
    // intervalToXmlTranspose
    // setMxPrint
    // staffLayoutToXmlPrint
    setMxAttributes() {
        const m = this.stream;
        this.xmlRoot.setAttribute('number', m.measureNumberWithSuffix());
        // layoutWidth
    }
    
    // setRbSpanners
    // transpose
}
