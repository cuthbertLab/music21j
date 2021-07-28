/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/webmidi -- webmidi or wrapper around the Jazz Plugin
 *
 * For non webmidi --  Uses the cross-platform, cross-browser plugin from
 * http://jazz-soft.net/doc/Jazz-Plugin/Plugin.html
 * P.S. by the standards of divinity of most major religions, Sema Kachalo is a god.
 *
 * Copyright (c) 2014-18, Michael Scott Asato Cuthbert
 * Based on music21 (=music21p), Copyright (c) 2006-21, Michael Scott Asato Cuthbert
 *
 */
/**
 * webmidi -- for connecting with external midi devices
 *
 * Uses either the webmidi API or the Jazz plugin
 * See {@link music21.webmidi}
 *
 * @namespace music21.webmidi
 * @memberof music21
 * @requires music21/miditools
 * @requires jQuery
 * @exports music21/webmidi
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
    music21.webmidi.createSelector($("#putMidiSelectHere"));

    function displayStream(midiEvent) {
        midiEvent.sendToMIDIjs();
        if (midiEvent.noteOn) {
            var m21n = midiEvent.music21Note();
            if (s.length > 7) {
                s.elements = s.elements.slice(1)
            }
            s.append(m21n);
            var $svgDiv = $("#svgDiv");
            $svgDiv.empty();
            var svgDiv = s.appendNewDOM($svgDiv);
        }
    }
    music21.miditools.callbacks.general = displayStream;

</script>
</body>
</html>
 */
/**
 * @typedef {Object} Jazz
 * @extends HTMLObjectElement
 * @property {boolean} isJazz
 * @property {function} MidiInOpen
 * @property {function} MidiInClose
 * @property {function} MidiInList
 *
 */
/**
 *
 * @type {
 *     {
 *     selectedInputPort: *,
 *     access: *,
 *     jazzDownloadUrl: string,
 *     selectedOutputPort: *,
 *     storedPlugin: *,
 *     selectedJazzInterface: *,
 *     $select: jQuery|undefined
 *     }
 * }
 */
export declare const webmidi: {
    selectedOutputPort: any;
    selectedInputPort: any;
    access: any;
    $select: any;
    jazzDownloadUrl: string;
    storedPlugin: any;
    selectedJazzInterface: any;
};
/**
 * Called by Jazz MIDI plugin when an event arrives.
 *
 * Shim to convert the data into WebMIDI API format and then call the WebMIDI API midiInArrived
 *
 * See the MIDI spec for information on parameters
 *
 * @memberof music21.webmidi
 * @param {byte} t - timing information
 * @param {byte} a - data 1
 * @param {byte} b - data 2
 * @param {byte} c - data 3
 */
export declare function jazzMidiInArrived(t: any, a: any, b: any, c: any): any;
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
 * @memberof music21.webmidi
 * @param {Object} midiMessageEvent - midi Information
 */
export declare function midiInArrived(midiMessageEvent: any): any;
/**
 * Create a hidden tiny, &lt;object&gt; tag in the DOM with the
 * proper classid (`CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90`) to
 * load the Jazz plugin.
 *
 * It will return the plugin if it can or undefined if it cannot. Caches it in webmidi.storedPlugin.
 *
 * @function music21.webmidi.createPlugin
 * @param {HTMLElement} [appendElement=document.body] - where to place this hidden object (does not really matter)
 * @param {Boolean} [override=false] - if this method has been called
 *     successfully before return the storedPlugin unless override is true.
 * @returns {Jazz|undefined} Jazz MIDI plugin object
 */
export declare function createPlugin(appendElement?: HTMLElement, override?: boolean): any;
/**
 * Creates a &lt;select&gt; object for selecting among the MIDI choices in Jazz
 *
 * @function music21.webmidi.createJazzSelector
 * @param {jQuery|HTMLElement} [$newSelect=document.body] - object to append the select to
 * @param {Object} [options] - see createSelector for details
 * @returns {HTMLElement|undefined} DOM object containing the select tag, or undefined if Jazz cannot be loaded.
 */
export declare function createJazzSelector($newSelect: any, options?: {}): any;
/**
 * Function to be called if the webmidi-api selection changes. (not jazz)
 *
 */
export declare function selectionChanged(): boolean;
/**
 * Creates a &lt;select&gt; object for selecting among the MIDI choices in Jazz
 *
 * The options object has several parameters:
 *
 *
 * @function music21.webmidi.createSelector
 * @param {jQuery|HTMLElement} [midiSelectDiv=$('body')] - object to append the select to
 * @param {Object} [options] - see above.
 * @param {boolean} options.autoupdate -- should this auto update?
 * @param {function} options.onsuccess -- function to call on all successful port queries
 * @param {function} options.oninputsuccess -- function to call if successful and at least one input device is found
 * @param {function} options.oninputempty -- function to call if successful but no input devices are found.
 * @param {boolean} options.existingMidiSelect -- is there already a select tag for MIDI?
 * @returns {jQuery|undefined} DOM object containing the select tag, or undefined if Jazz cannot be loaded.
 */
export declare function createSelector(midiSelectDiv: any, options?: {}): any;
export declare function populateSelect(): void;
//# sourceMappingURL=webmidi.d.ts.map