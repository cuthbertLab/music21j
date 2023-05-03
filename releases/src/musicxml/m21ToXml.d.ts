import { // eslint-disable-line import/no-cycle
Stream, Measure, Part, Score } from '../stream';
import { Music21Object } from '../base';
import { GeneralNote } from '../note';
export declare class GeneralObjectExporter {
    generalObj: Music21Object;
    constructor(obj: Music21Object);
    parse(obj?: any): string;
    parseWellformedObject(sc: any): string;
    fromGeneralObj(obj: any): any;
    fromScore(sc: any): any;
    fromPart(p: any): any;
    fromMeasure(m: any): any;
    fromVoice(v: any): any;
    fromGeneralNote(n: any): any;
}
export declare class XMLExporterBase {
    doc: XMLDocument;
    xmlRoot: any;
    constructor();
    asBytes({ noCopy }?: {
        noCopy?: boolean;
    }): string;
    xmlHeader(): string;
    /**
     * Note: this is not a method in music21p, but it needs access to this.doc in music21j
     */
    _setTagTextFromAttribute(m21El: any, xmlEl: any, tag: string, attributeName?: string, { transform, forceEmpty }?: {
        transform?: any;
        forceEmpty?: boolean;
    }): HTMLElement;
    seta(m21El: any, xmlEl: any, tag: any, options?: {}): HTMLElement;
    _setAttributeFromAttribute(m21El: any, xmlEl: any, xmlAttributeName: any, { attributeName, transform }?: {
        attributeName?: any;
        transform?: any;
    }): void;
    setb(m21El: any, xmlEl: any, xmlAttributeName: any, options?: {}): void;
    _synchronizeIds(element: any, m21Object: any): void;
    addDividerComment(comment?: string): void;
    /**
     * Helper method since SubElement does not exist in javascript document.implementation
     */
    subElement(el: HTMLElement, tag: string): HTMLElement;
    setColor(mxObject: any, m21Object: any): void;
    setEditorial(mxEl: any, el: any): void;
    accidentalToMx(a: any): HTMLElement;
    getRandomId(): string;
}
export declare class ScoreExporter extends XMLExporterBase {
    stream: Score;
    xmIdentification: any;
    scoreMetadata: any;
    spannerBundle: any;
    meterStream: any;
    scoreLayouts: any;
    firstScoreLayout: any;
    highestTime: number;
    refStreamOrTimeRange: number[];
    partExporterList: any[];
    instrumentList: any[];
    midiChannelList: any[];
    parts: Part[];
    constructor(score: any);
    parse(): any;
    emptyObject(): any;
    scorePreliminaries(): void;
    setPartsAndRefStream(): void;
    parsePartlikeScore(): void;
    postPartProcess(): void;
    setScoreHeader(): void;
    setPartList(): HTMLElement;
}
export declare class PartExporter extends XMLExporterBase {
    stream: Part;
    parent: ScoreExporter;
    meterStream: Stream;
    refStreamOrTimeRange: any;
    midiChannelList: any;
    instrumentStream: any;
    firstInstrumentObject: any;
    lastDivisions: number;
    spannerBundle: any;
    xmlPartId: any;
    constructor(partObj: any, { parent }?: {
        parent?: any;
    });
    parse(): any;
    getXmlScorePart(): HTMLElement;
}
export declare class MeasureExporter extends XMLExporterBase {
    stream: Measure;
    parent: PartExporter;
    currentDivisions: number;
    transpositionInterval: any;
    mxTranspose: any;
    measureOffsetStart: number;
    offsetInMeasure: number;
    currentVoiceId: any;
    rbSpanners: any[];
    spannerBundle: any;
    objectSpannerBundle: any;
    constructor(measureObj: any, { parent }?: {
        parent?: any;
    });
    parse(): any;
    mainElementsParse(): void;
    parseFlatElements(m: any, { backupAfterwards }?: {
        backupAfterwards?: boolean;
    }): void;
    parseOneElement(obj: any): void;
    /**
     *
     */
    noteToXml(n: GeneralNote, { noteIndexInChord, chordParent }?: {
        noteIndexInChord?: number;
        chordParent?: any;
    }): Node;
    restToXml(r: any): Node;
    chordToXml(c: any): any[];
    durationXml(dur: any): HTMLElement;
    pitchToXml(p: any): HTMLElement;
    tupletToTimeModification(tup: any): HTMLElement;
    tieToXmlTie(t: any): any[];
    wrapObjectInAttributes(objectToWrap: any, methodToMx: any): HTMLElement;
    lyricToXml(l: any): HTMLElement;
    setMxAttributesObjectForStartOfMeasure(): HTMLElement;
    timeSignatureToXml(ts: any): HTMLTimeElement;
    keySignatureToXml(keyOrKeySignature: any): HTMLElement;
    clefToXml(clefObj: any): HTMLElement;
    setMxAttributes(): void;
}
//# sourceMappingURL=m21ToXml.d.ts.map