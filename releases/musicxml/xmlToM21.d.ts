/// <reference types="jquery" />
/// <reference types="jquery" />
import * as chord from '../chord';
import * as clef from '../clef';
import * as duration from '../duration';
import * as key from '../key';
import * as meter from '../meter';
import * as note from '../note';
import * as pitch from '../pitch';
import * as stream from '../stream';
import * as tie from '../tie';
import type { Music21Object } from '../base';
export declare class ScoreParser {
    xmlText: any;
    xmlUrl: any;
    $xmlRoot: any;
    stream: stream.Score;
    definesExplicitSystemBreaks: boolean;
    definesExplicitPageBreaks: boolean;
    mxScorePartDict: {};
    m21PartObjectsById: {};
    partGroupList: any[];
    parts: any[];
    musicXmlVersion: string;
    constructor();
    scoreFromUrl(url: any): JQuery.jqXHR<any>;
    scoreFromText(xmlText: any): stream.Score;
    scoreFromDOMTree(xmlDoc: any): stream.Score;
    xmlRootToScore($mxScore: any, inputM21: any): any;
    xmlPartToPart($mxPart: any, $mxScorePart: any): stream.Part;
    parsePartList($mxScore: any): void;
}
export declare class PartParser {
    parent: ScoreParser;
    $mxPart: any;
    $mxScorePart: any;
    partId: string;
    stream: stream.Part;
    atSoundingPitch: boolean;
    staffReferenceList: any[];
    lastTimeSignature: meter.TimeSignature;
    lastMeasureWasShort: boolean;
    lastMeasureOffset: number;
    lastClefs: any;
    activeTuplets: any[];
    maxStaves: number;
    lastMeasureNumber: number;
    lastNumberSuffix: any;
    multiMeasureRestsToCapture: number;
    firstMeasureParsed: boolean;
    $activeAttributes: JQuery;
    lastDivisions: number;
    appendToScoreAfterParse: boolean;
    lastMeasureParser: MeasureParser;
    constructor($mxPart: any, $mxScorePart: any, parent?: any);
    parse(): void;
    parseXmlScorePart(): void;
    parseMeasures(): void;
    xmlMeasureToMeasure($mxMeasure: any): void;
    setLastMeasureInfo(m: any): void;
    adjustTimeAttributesFromMeasure(m: any): void;
}
export declare class MeasureParser {
    $mxMeasure: any;
    parent: PartParser;
    $mxMeasureElements: any[];
    stream: stream.Measure;
    divisions: any;
    transposition: any;
    staffReference: {};
    useVoices: boolean;
    voicesById: {};
    voiceIndices: any;
    staves: number;
    $activeAttributes: any;
    attributesAreInternal: boolean;
    measureNumber: number;
    numberSuffix: string;
    staffLayoutObjects: any[];
    $mxNoteList: any[];
    $mxLyricList: any[];
    nLast: note.GeneralNote;
    chordVoice: any;
    fullMeasureRest: boolean;
    restAndNoteCount: {
        rest: number;
        note: number;
    };
    lastClefs: {
        0: any;
    };
    parseIndex: number;
    offsetMeasureNote: number;
    attributeTagsToMethods: {
        time: string;
        clef: string;
        key: string;
    };
    musicDataMethods: {
        note: string;
        attributes: string;
    };
    constructor($mxMeasure: JQuery, parent?: PartParser);
    parse(): void;
    insertInMeasureOrVoice($mxObj: any, el: any): void;
    xmlToNote($mxNote: any): void;
    xmlToChord($mxNoteList: any): chord.Chord;
    xmlToSimpleNote($mxNote: any, freeSpanners?: boolean): any;
    xmlToPitch($mxNote: any, inputM21: any): any;
    xmlToAccidental($mxAccidental: any): pitch.Accidental;
    xmlToRest($mxRest: any): any;
    xmlNoteToGeneralNoteHelper(n: any, $mxNote: any, freeSpanners?: boolean): any;
    xmlToDuration($mxNote: any, inputM21: duration.Duration): duration.Duration;
    xmlToTie($mxNote: JQuery): tie.Tie;
    updateLyricsFromList(n: any, lyricList: any): void;
    xmlToLyric($mxLyric: JQuery, inputM21?: note.Lyric): note.Lyric;
    insertIntoMeasureOrVoice($mxElement: JQuery, el: Music21Object): void;
    parseMeasureAttributes(): void;
    parseMeasureNumbers(): void;
    parseAttributesTag($mxAttributes: any): void;
    handleTimeSignature($mxTime: any): void;
    xmlToTimeSignature($mxTime: any): meter.TimeSignature;
    handleClef($mxClef: any): void;
    xmlToClef($mxClef: any): clef.Clef;
    handleKeySignature($mxKey: any): void;
    xmlToKeySignature($mxKey: any): key.KeySignature;
}
declare const musicxml: {
    ScoreParser: typeof ScoreParser;
    PartParser: typeof PartParser;
    MeasureParser: typeof MeasureParser;
};
export default musicxml;
//# sourceMappingURL=xmlToM21.d.ts.map