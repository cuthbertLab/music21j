/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/webmidi -- webmidi or wrapper around the Jazz Plugin
 *
 * For non webmidi --  Uses the cross-platform, cross-browser plugin from
 * http://jazz-soft.net/doc/Jazz-Plugin/Plugin.html
 * P.S. by the standards of divinity of most major religions, Sema Kachalo is a god.
 *
 * Copyright (c) 2014-18, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–18, Michael Scott Cuthbert and cuthbertLab
 *
 */
import * as $ from 'jquery';
import { debug } from './debug.js';
import { common } from './common.js';
import { miditools } from './miditools.js';

/**
 * webmidi -- for connecting with external midi devices
 *
 * Uses either the webmidi API or the Jazz plugin
 *
 * See {@link music21.webmidi}
 *
 * @exports music21/webmidi
 */
/**
 * webmidi -- for connecting with external midi devices
 *
 * Uses either the webmidi API or the Jazz plugin
 *
 * @namespace music21.webmidi
 * @memberof music21
 * @requires music21/miditools
 * @requires jquery
 * @property {JazzObject|undefined} storedPlugin - reference to the Jazz object from the plugin; cached from `createPlugin`.
 * @property {string} selectedJazzInterface - the currently connected interface (note that we can only use one right now)
 */
export const webmidi = {};

webmidi.selectedOutputPort = undefined;
webmidi.selectedInputPort = undefined;

webmidi.access = undefined;
webmidi.$selectDiv = undefined;

webmidi.jazzDownloadUrl = 'http://jazz-soft.net/download/Jazz-Plugin/';
webmidi.storedPlugin = undefined;
webmidi.selectedJazzInterface = undefined; // not the same as "" etc. uses last selected interface by default.

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
webmidi.jazzMidiInArrived = function jazzMidiInArrived(t, a, b, c) {
    const webmidiEvent = {
        timestamp: t,
        data: [a, b, c],
    };
    return webmidi.midiInArrived(webmidiEvent);
};

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
webmidi.midiInArrived = function midiInArrived(midiMessageEvent) {
    const t = midiMessageEvent.timeStamp;
    const a = midiMessageEvent.data[0];
    const b = midiMessageEvent.data[1];
    const c = midiMessageEvent.data[2];
    const eventObject = miditools.callBacks.raw(t, a, b, c);
    if (miditools.callBacks.general instanceof Array) {
        return miditools.callBacks.general.forEach((el, index, array) => {
            el(eventObject);
        });
    } else if (miditools.callBacks.general !== undefined) {
        return miditools.callBacks.general(eventObject);
    } else {
        return undefined;
    }
};

/**
 * Create a hidden tiny, &lt;object&gt; tag in the DOM with the
 * proper classid (`CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90`) to
 * load the Jazz plugin.
 *
 * It will return the plugin if it can or undefined if it cannot. Caches it in webmidi.storedPlugin.
 *
 * @function music21.webmidi.createPlugin
 * @param {Node} [appendElement=document.body] - where to place this hidden object (does not really matter)
 * @param {Boolean} [override=false] - if this method has been called successfully before return the storedPlugin unless override is true.
 * @returns {Jazz|undefined} Jazz MIDI plugin object
 */
webmidi.createPlugin = function createPlugin(appendElement, override) {
    if (webmidi.storedPlugin && override !== true) {
        return webmidi.storedPlugin;
    }
    if (typeof appendElement === 'undefined') {
        appendElement = $('body')[0];
    }
    const obj = document.createElement('object');
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
};

/**
 * Creates a &lt;select&gt; object for selecting among the MIDI choices in Jazz
 *
 * @function music21.webmidi.createJazzSelector
 * @param {jQuery|Node} [$newSelect=document.body] - object to append the select to
 * @param {Object} [options] - see createSelector for details
 * @returns {Node|undefined} DOM object containing the select tag, or undefined if Jazz cannot be loaded.
 */
webmidi.createJazzSelector = function createJazzSelector($newSelect, options) {
    const params = {};
    common.merge(params, options);

    const Jazz = webmidi.createPlugin();
    if (Jazz === undefined) {
        return undefined;
    }

    $newSelect.change(() => {
        const selectedInput = $('#midiInSelect option:selected').text();
        if (selectedInput !== 'None selected') {
            webmidi.selectedJazzInterface = Jazz.MidiInOpen(
                selectedInput,
                webmidi.jazzMidiInArrived
            );
        } else {
            Jazz.MidiInClose();
        }
        if (debug) {
            console.log(
                'current input changed to: ' + webmidi.selectedInterface
            );
        }
    });
    const midiOptions = Jazz.MidiInList();
    const noneAppendOption = $("<option value='None'>None selected</option>");
    $newSelect.append(noneAppendOption);

    let anySelected = false;
    const allAppendOptions = [];
    for (let i = 0; i < midiOptions.length; i++) {
        const $appendOption = $(
            "<option value='"
                + midiOptions[i]
                + "'>"
                + midiOptions[i]
                + '</option>'
        );
        if (midiOptions[i] === webmidi.selectedJazzInterface) {
            $appendOption.attr('selected', true);
            anySelected = true;
        }
        allAppendOptions.push($appendOption);
        // console.log(appendOption);
        $newSelect.append($appendOption);
    }
    if (anySelected === false && midiOptions.length > 0) {
        $newSelect.val(midiOptions[0]);
        allAppendOptions[0].attr('selected', true);
        webmidi.selectedJazzInterface = Jazz.MidiInOpen(
            midiOptions[0],
            webmidi.jazzMidiInArrived
        );
        anySelected = true;
    } else {
        noneAppendOption.attr('selected', true);
    }
    if (params.onsuccess !== undefined) {
        params.onsuccess();
    }
    if (anySelected === true && params.oninputsuccess !== undefined) {
        params.oninputsuccess();
    } else if (anySelected === false && params.oninputempty !== undefined) {
        params.oninputempty();
    }
    return $newSelect;
};

/**
 * Function to be called if the webmidi-api selection changes. (not jazz)
 *
 */
webmidi.selectionChanged = function selectionChanged() {
    const selectedInput = webmidi.$select.val();
    if (selectedInput === webmidi.selectedInputPort) {
        return false;
    }
    const storedStateChange = webmidi.access.onstatechange; // port.close() fires onstatechange, so turn off for a moment.
    webmidi.access.onstatechange = () => {};
    if (debug) {
        console.log('current input changed to: ' + selectedInput);
    }
    webmidi.selectedInputPort = selectedInput;

    webmidi.access.inputs.forEach(port => {
        if (port.name === selectedInput) {
            port.onmidimessage = webmidi.midiInArrived;
        } else {
            port.close();
        }
    });
    webmidi.access.onstatechange = storedStateChange;
    return false;
};

/**
 * Creates a &lt;select&gt; object for selecting among the MIDI choices in Jazz
 *
 * The options object has several parameters:
 *
 * {bool} autoupdate -- should this auto update?
 * {function} onsuccess -- function to call on all successful port queries
 * {function} oninputsuccess -- function to call if successful and at least one input device is found
 * {function} oninputempty -- function to call if successful but no input devices are found.
 * {bool} existingMidiSelect -- is there already a select tag for MIDI?
 *
 * @function music21.webmidi.createSelector
 * @param {jQuery|Node} [$midiSelectDiv=$('body')] - object to append the select to
 * @param {Object} [options] - see above.
 * @returns {Node|undefined} DOM object containing the select tag, or undefined if Jazz cannot be loaded.
 */
webmidi.createSelector = function createSelector($midiSelectDiv, options) {
    const params = {
        autoUpdate: true,
        existingMidiSelect: false,
    };
    common.merge(params, options);

    if (typeof $midiSelectDiv === 'undefined') {
        $midiSelectDiv = $('body');
    }
    if ($midiSelectDiv.jquery === undefined) {
        $midiSelectDiv = $($midiSelectDiv);
    }
    let $newSelect;
    const foundMidiSelects = $midiSelectDiv.find('select#midiInSelect');
    if (foundMidiSelects.length > 0) {
        $newSelect = foundMidiSelects[0];
        params.existingMidiSelect = true;
    } else {
        $newSelect = $('<select>').attr('id', 'midiInSelect');
        $midiSelectDiv.append($newSelect);
    }
    webmidi.$select = $newSelect;

    if (navigator.requestMIDIAccess === undefined) {
        webmidi.createJazzSelector($newSelect, params);
    } else {
        if (params.existingMidiSelect !== true) {
            $newSelect.change(webmidi.selectionChanged);
        }
        navigator.requestMIDIAccess().then(
            access => {
                webmidi.access = access;
                webmidi.populateSelect();
                if (params.autoUpdate) {
                    access.onstatechange = webmidi.populateSelect;
                }
                webmidi.$select.change();
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
                $midiSelectDiv.html(e.message);
            }
        );
    }
    miditools.clearOldChords(); // starts the chord checking process.
    return $newSelect;
};

webmidi.populateSelect = function populateSelect() {
    const inputs = webmidi.access.inputs;
    webmidi.$select.empty();

    const $noneAppendOption = $("<option value='None'>None selected</option>");
    webmidi.$select.append($noneAppendOption);

    const allAppendOptions = [];
    const midiOptions = [];
    let i = 0;
    inputs.forEach(port => {
        const $appendOption = $(
            "<option value='" + port.name + "'>" + port.name + '</option>'
        );
        allAppendOptions.push($appendOption);
        midiOptions.push(port.name);
        // console.log(appendOption);
        webmidi.$select.append($appendOption);
        i += 1;
    });

    if (allAppendOptions.length > 0) {
        webmidi.$select.val(midiOptions[0]);
        allAppendOptions[0].attr('selected', true);
    } else {
        $noneAppendOption.attr('selected', true);
    }
    webmidi.$select.change();
};

// this allows for the deprecated webmidi.callBacks to still work for now.
webmidi.callBacks = miditools.callBacks;

/**
 * Example smallest usage of the webmidi toolkit.  see testHTML/midiInRequire.html

<html>
<head>
    <title>MIDI In/Jazz Test for Music21j</title>
    <!-- for MSIE 10 on Windows 8 -->
    <meta http-equiv="X-UA-Compatible" content="requiresActiveX=true"/>
    <script data-main="../src/music21.js" src="../ext/require/require.js"></script>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />

    <script>
    var s = "";
    function displayStream(me) {
        me.sendToMIDIjs();
        if (me.noteOn) {
            var m21n = me.music21Note();
            if (s.length > 7) {
                s.elements = s.elements.slice(1)
            }
            s.append(m21n);
            var $svgDiv = $("#svgDiv");
            $svgDiv.empty();
            var svgDiv = s.appendNewDOM($svgDiv);
        }
    }

    require(['music21'], function () {
        s = new music21.stream.Stream();
        music21.webmidi.createSelector($("#putMidiSelectHere"));
        music21.miditools.callBacks.general = displayStream;
    });


    </script>
</head>
<body>
<div>
MIDI Input: <div id="putMidiSelectHere" />
</div>
<div id="svgDiv">
</div>
</body>
</html>
 **/
