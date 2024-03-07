/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/webmidi -- webmidi or wrapper around the Jazz Plugin
 *
 * For non webmidi --  Uses the cross-platform, cross-browser plugin from
 * http://jazz-soft.net/doc/Jazz-Plugin/Plugin.html
 * P.S. by the standards of divinity of most major religions, Sema Kachalo is a god.
 *
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 */
/**
 * webmidi -- for connecting with external midi devices
 *
 * Uses either the webmidi API or the Jazz plugin
 *
 * @example smallest usage of the webmidi toolkit.  see testHTML/midiInRequire.html

<html>
<head>
    <title>MIDI In/Jazz Test for Music21j</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
</head>
<body>
<div>
MIDI Input: <div id="putMidiSelectHere" />
</div>
<div id="svgDiv">
</div>
<script src='music21j.js'></script>
<script>
    s = new music21.stream.Stream();
    music21.webmidi.createSelector(document.querySelector("#putMidiSelectHere"));

    function displayStream(midiEvent) {
        midiEvent.sendToMIDIjs();
        if (midiEvent.noteOn) {
            const m21n = midiEvent.music21Note();
            if (s.length > 7) {
                s.elements = s.elements.slice(1)
            }
            s.append(m21n);
            const svgDiv = document.querySelector("#svgDiv");
            svgDiv.innerHTML = "";
            svgDiv = s.appendNewDOM(svgDiv);
        }
    }
    music21.miditools.callbacks.general = displayStream;
</script>
</body>
</html>
 */
type MIDICallbackFunction = (t: number, a: number, b: number, c: number) => any;
declare interface Jazz extends HTMLObjectElement {
    isJazz: Readonly<boolean>;
    classid: string;
    MidiInOpen: (instrumentName: string, callback: MIDICallbackFunction) => string;
    MidiInClose: () => void;
    MidiInList: () => string[];
}
/**
 * @typedef {Object} Jazz
 * @extends HTMLObjectElement
 * @property {boolean} isJazz
 * @property {function} MidiInOpen
 * @property {function} MidiInClose
 * @property {function} MidiInList
 *
 */
interface WebMIDIOptions {
    selectedOutputPort: string;
    selectedInputPort: string;
    access: any;
    select: HTMLSelectElement;
    jazzDownloadUrl: string;
    storedPlugin: Jazz;
    selectedJazzInterface: string;
}
export declare const webmidi: WebMIDIOptions;
/**
 * Called by Jazz MIDI plugin when an event arrives.
 *
 * Shim to convert the data into WebMIDI API format and then call the WebMIDI API midiInArrived
 *
 * See the MIDI spec for information on parameters.
 *
 * t is a timestamp number (in milliseconds)
 * a, b, and c, are three one-byte midi messages.
 */
export declare function jazzMidiInArrived(t: number, a: number, b: number, c: number): any;
/**
 * Called directly when a MIDI event arrives from the WebMIDI API, or via a Shim (jazzMidiInArrived)
 * when MIDI information comes from JazzMIDI
 *
 * Calls the 'raw' and 'general callbacks when a raw midi event (four bytes)
 * arrives.
 *
 * See the MIDI spec for information on the contents of the three parameters.
 *
 * midiMessageEvent should be an object with two keys: timeStamp (int) and data (array of three int values)
 *
 * @param {Object} midiMessageEvent - midi Information
 */
export declare function midiInArrived(midiMessageEvent: any): any;
/**
 * For pre-native WebMIDI support, such as Safari.
 *
 * Create a hidden tiny, &lt;object&gt; tag in the DOM with the
 * proper classid (`CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90`) to
 * load the Jazz plugin.
 *
 * It will return the plugin if it can or undefined if it cannot. Caches it in webmidi.storedPlugin.
 *
 * @param {HTMLElement} [appendElement=document.body] - where to place this
 *     hidden object (does not really matter)
 * @param {Boolean} [override=false] - if this method has been called
 *     successfully before return the storedPlugin unless override is true.
 * @returns {Jazz|undefined} Jazz MIDI plugin object
 */
export declare function createPlugin(appendElement?: HTMLElement, override?: boolean): Jazz | undefined;
/**
 * Creates a &lt;select&gt; object for selecting among the MIDI choices in Jazz
 *
 * @param {HTMLElement} [$newSelect=document.body] - object to append the select to
 * @param {Object} [options] - see createSelector for details
 * @returns {HTMLElement|undefined} DOM object containing the select tag, or undefined if Jazz cannot be loaded.
 */
export declare function createJazzSelector(newSelect: HTMLElement, options?: MIDISelectorOptions): HTMLElement | undefined;
/**
 * Function to be called if the webmidi-api selection changes. (not jazz)
 *
 */
export declare function selectionChanged(e: Event): boolean;
interface MIDISelectorOptions {
    /**
     * Should the list of options auto update?
     */
    autoUpdate?: boolean;
    /**
     * Function to call on all successful port queries.
     */
    onsuccess?: Function;
    /**
     * Function to call if port query is successful and at least one input device exists.
     */
    oninputsuccess?: Function;
    /**
     * Function to call if port query is successful but no input devices are found.
     */
    oninputempty?: Function;
}
/**
 * Creates a &lt;select&gt; object for selecting among the MIDI choices in Jazz
 *
 * Returns an HTMLSelectElement or undefined if Jazz cannot be loaded.
 */
export declare function createSelector(where: HTMLElement, options?: MIDISelectorOptions): HTMLSelectElement;
export declare function populateSelect(): void;
export {};
//# sourceMappingURL=webmidi.d.ts.map