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

import { debug } from './debug';

import * as common from './common';
import * as miditools from './miditools';
import defaults from './defaults';
import {sleep, to_el} from './common';

type MIDICallbackFunction = (t: number, a: number, b: number, c: number) => any;

declare interface Jazz extends HTMLObjectElement {
    // see https://jazz-soft.net/doc/Jazz-Plugin/reference.html for all functions
    isJazz: Readonly<boolean>,
    classid: string,
    MidiInOpen: (instrumentName: string, callback: MIDICallbackFunction) => string,
    MidiInClose: () => void,
    MidiInList: () => string[],
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
    selectedOutputPort: string,
    selectedInputPort: string,
    access: any,
    select: HTMLSelectElement,
    jazzDownloadUrl: string,
    storedPlugin: Jazz,
    selectedJazzInterface: string,
}

export const webmidi: WebMIDIOptions = {
    selectedOutputPort: undefined,
    selectedInputPort: undefined,

    access: undefined,
    select: undefined,

    jazzDownloadUrl: 'https://jazz-soft.net/download/Jazz-Plugin/',
    storedPlugin: undefined,
    selectedJazzInterface: undefined, // not the same as "" etc. uses last selected interface by default.
};

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
export function jazzMidiInArrived(t: number, a: number, b: number, c: number) {
    const webmidiEvent = {
        timestamp: t,
        data: [a, b, c],
    };
    return midiInArrived(webmidiEvent);
}

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
export function midiInArrived(midiMessageEvent) {
    const t = midiMessageEvent.timeStamp;
    const a = midiMessageEvent.data[0];
    const b = midiMessageEvent.data[1];
    const c = midiMessageEvent.data[2];

    const midiCallbacks: miditools.CallbackInterface = miditools.callbacks;
    const eventObject = midiCallbacks.raw(t, a, b, c);
    if (midiCallbacks.general instanceof Array) {
        return midiCallbacks.general.forEach((el, index, array) => {
            el(eventObject);
        });
    } else if (midiCallbacks.general instanceof Function) {
        return midiCallbacks.general(eventObject);
    } else {
        return undefined;
    }
}

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
export function createPlugin(
    appendElement: HTMLElement = undefined,
    override: boolean = false
): Jazz|undefined {
    if (webmidi.storedPlugin && !override) {
        return webmidi.storedPlugin;
    }
    if (typeof appendElement === 'undefined') {
        appendElement = document.querySelector(defaults.appendLocation);
    }
    const obj = <Jazz> document.createElement('object');
    // noinspection SpellCheckingInspection
    obj.classid = 'CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90';
    if (!obj.isJazz) {
        obj.type = 'audio/x-jazz';
    }
    obj.style.visibility = 'hidden';
    obj.style.width = '0px';
    obj.style.height = '0px';
    appendElement.appendChild(obj);

    if (obj.isJazz) {
        webmidi.storedPlugin = obj;
        return obj;
    } else {
        appendElement.removeChild(obj);
        console.error(
            'Cannot use jazz plugin; install at ' + webmidi.jazzDownloadUrl
        );
        return undefined;
    }
}

/**
 * Creates a &lt;select&gt; object for selecting among the MIDI choices in Jazz
 *
 * @param {HTMLElement} [$newSelect=document.body] - object to append the select to
 * @param {Object} [options] - see createSelector for details
 * @returns {HTMLElement|undefined} DOM object containing the select tag, or undefined if Jazz cannot be loaded.
 */
export function createJazzSelector(newSelect: HTMLElement, options: MIDISelectorOptions = {}): HTMLElement|undefined {
    const params: MIDISelectorOptions = {
        onsuccess: undefined,
        oninputsuccess: undefined,
        oninputempty: undefined,
    };
    common.merge(params, options);

    const jazzPlugin: Jazz = createPlugin();
    if (jazzPlugin === undefined) {
        return undefined;
    }

    newSelect.addEventListener('change', e => {
        const selectedInput = (<HTMLOptionElement> e.target).value;
        if (selectedInput !== 'None') {
            webmidi.selectedJazzInterface = jazzPlugin.MidiInOpen(
                selectedInput,
                jazzMidiInArrived
            );
        } else {
            jazzPlugin.MidiInClose();
        }
        if (debug) {
            console.log(
                'current input changed to: ' + webmidi.selectedJazzInterface
            );
        }
    });
    const midiOptions = jazzPlugin.MidiInList();
    const noneAppendOption = <HTMLOptionElement> to_el("<option value='None'>None selected</option>");
    newSelect.appendChild(noneAppendOption);

    let anySelected = false;
    const allAppendOptions: HTMLOptionElement[] = [];
    for (let i = 0; i < midiOptions.length; i++) {
        const appendOption = <HTMLOptionElement> to_el(
            "<option value='"
                + midiOptions[i]
                + "'>"
                + midiOptions[i]
                + '</option>'
        );
        if (midiOptions[i] === webmidi.selectedJazzInterface) {
            appendOption.setAttribute('selected', 'true');
            anySelected = true;
        }
        allAppendOptions.push(appendOption);
        // console.log(appendOption);
        newSelect.appendChild(appendOption);
    }
    if (anySelected === false && midiOptions.length > 0) {
        allAppendOptions[0].setAttribute('selected', 'true');
        webmidi.selectedJazzInterface = jazzPlugin.MidiInOpen(
            midiOptions[0],
            jazzMidiInArrived
        );
        anySelected = true;
    } else {
        noneAppendOption.setAttribute('selected', 'true');
    }
    if (params.onsuccess !== undefined) {
        params.onsuccess();
    }
    if (anySelected === true && params.oninputsuccess !== undefined) {
        params.oninputsuccess();
    } else if (anySelected === false && params.oninputempty !== undefined) {
        params.oninputempty();
    }
    return newSelect;
}

/**
 * Function to be called if the webmidi-api selection changes. (not jazz)
 *
 */
export function selectionChanged(e: Event) {
    const selectedInput = (<HTMLOptionElement> e.target).value;
    if (selectedInput === webmidi.selectedInputPort) {
        return false;
    }
    // port.close() fires onstatechange, so turn off for a moment.
    const storedStateChange = webmidi.access.onstatechange;
    webmidi.access.onstatechange = () => {};
    if (debug) {
        console.log('current input changed to: ' + selectedInput);
    }
    webmidi.selectedInputPort = selectedInput;

    webmidi.access.inputs.forEach(port => {
        if (port.name === selectedInput) {
            port.onmidimessage = midiInArrived;
        } else {
            port.close();
        }
    });
    sleep(300).then(() => {
        webmidi.access.onstatechange = storedStateChange;
    });
    return false;
}


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
export function createSelector(
    where: HTMLElement,
    options: MIDISelectorOptions = {}
): HTMLSelectElement {
    let existingMidiSelect = false;
    const params: MIDISelectorOptions = {
        autoUpdate: true,
        onsuccess: undefined,
        oninputsuccess: undefined,
        oninputempty: undefined,
    };
    common.merge(params, options);
    const midiSelectDiv = <HTMLDivElement> common.coerceHTMLElement(where);

    let newSelect: HTMLSelectElement;
    const foundMidiSelects = midiSelectDiv.querySelectorAll('select#midiInSelect');
    if (foundMidiSelects.length > 0) {
        newSelect = <HTMLSelectElement> foundMidiSelects[0];
        existingMidiSelect = true;
    } else {
        newSelect = <HTMLSelectElement> to_el('<select id="midiInSelect"></select>');
        midiSelectDiv.appendChild(newSelect);
    }
    webmidi.select = newSelect;

    if (navigator.requestMIDIAccess === undefined) {
        createJazzSelector(newSelect, params);
    } else {
        if (!existingMidiSelect) {
            newSelect.addEventListener('change', e => selectionChanged(e));
        }
        navigator.requestMIDIAccess().then(
            access => {
                webmidi.access = access;
                populateSelect();
                if (params.autoUpdate) {
                    access.onstatechange = populateSelect;
                }
                const changeEvent = new Event('change', {bubbles: true});
                webmidi.select.dispatchEvent(changeEvent);
                if (params.onsuccess !== undefined) {
                    params.onsuccess();
                }
                if (
                    webmidi.selectedInputPort !== 'None'
                    && params.oninputsuccess !== undefined
                ) {
                    params.oninputsuccess();
                } else if (
                    webmidi.selectedInputPort === 'None'
                    && params.oninputempty !== undefined
                ) {
                    params.oninputempty();
                }
            },
            e => {
                midiSelectDiv.innerHTML = e.message;
            }
        );
    }
    miditools.clearOldChords(); // starts the chord checking process.
    return newSelect;
}

export function populateSelect() {
    const inputs = webmidi.access.inputs;
    webmidi.select.replaceChildren();

    const noneAppendOption = <HTMLOptionElement> to_el("<option value='None'>None selected</option>");
    webmidi.select.appendChild(noneAppendOption);

    const allAppendOptions = [];
    const midiOptions = [];
    let i = 0;
    inputs.forEach(port => {
        const appendOption = <HTMLOptionElement> to_el(
            "<option value='" + port.name + "'>" + port.name + '</option>'
        );
        allAppendOptions.push(appendOption);
        midiOptions.push(port.name);
        // console.log(appendOption);
        webmidi.select.appendChild(appendOption);
        i += 1;
    });

    if (allAppendOptions.length > 0) {
        allAppendOptions[0].setAttribute('selected', 'true');
    } else {
        noneAppendOption.setAttribute('selected', 'true');
    }
    const changeEvent = new Event('change', {bubbles: true});
    webmidi.select.dispatchEvent(changeEvent);
}
