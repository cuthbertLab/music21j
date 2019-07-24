/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/miditools -- A collection of tools for midi. See the namespace {@link music21.miditools}
 *
 * Copyright (c) 2014-19, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–19, Michael Scott Cuthbert and cuthbertLab
 *
 * @author Michael Scott Cuthbert
 */
import * as $ from 'jquery';
import * as MIDI from 'midicube';

import { chord } from './chord.js';
import { common } from './common.js';
import { debug } from './debug.js';
import { instrument } from './instrument.js';
import { note } from './note.js';

// expose midicube's MIDI to window for soundfonts to load.
window.MIDI = MIDI;

/**
 * A collection of tools for midi. See the namespace {@link music21.miditools}
 *
 * @exports music21/miditools
 */
/**
 * Module that holds **music21** tools for connecting with MIDI.js and somewhat with the
 * events from the Jazz plugin or the WebMIDI protocol.
 *
 * @namespace music21.miditools
 * @memberof music21
 */
export const miditools = {MIDI};

/**
 * Number of octaves to transpose all incoming midi signals
 *
 * @type {number}
 * @default 0
 */
miditools.transposeOctave = 0;
/**
 * @class Event
 * @memberof music21.miditools
 * @param {number} t - timing information
 * @param {number} a - midi data 1 (N.B. a >> 4 = midiCommand )
 * @param {number} b - midi data 2
 * @param {number} c - midi data 3
 */
export class Event {
    constructor(t, a, b, c) {
        this.timing = t;
        this.data1 = a;
        this.data2 = b;
        this.data3 = c;
        this.midiCommand = a >> 4;

        this.noteOff = this.midiCommand === 8;
        this.noteOn = this.midiCommand === 9;

        this.midiNote = undefined;
        if (this.noteOn || this.noteOff) {
            this.midiNote = this.data2 + 12 * miditools.transposeOctave;
            this.velocity = this.data3;
        }
    }
    /**
     * Calls MIDI.noteOn or MIDI.noteOff for the note
     * represented by the Event (if appropriate)
     *
     * @returns {undefined}
     */
    sendToMIDIjs() {
        if (MIDI !== undefined && MIDI.noteOn !== undefined) {
            // noteOn check because does not exist if no audio context
            // or soundfont has been loaded, such as if a play event
            // is triggered before soundfont has been loaded.
            if (this.noteOn) {
                MIDI.noteOn(0, this.midiNote, this.velocity, 0);
            } else if (this.noteOff) {
                MIDI.noteOff(0, this.midiNote, 0);
            }
        } else {
            console.warn('could not playback note because no MIDIout defined');
        }
    }
    /**
     * Makes a {@link music21.note.Note} object from the event's midiNote number.
     *
     * @returns {music21.note.Note} - the {@link music21.note.Note} object represented by Event.midiNote
     */
    music21Note() {
        const m21n = new note.Note();
        m21n.pitch.ps = this.midiNote;
        return m21n;
    }
}
miditools.Event = Event;

/**
 * How long to wait in milliseconds before deciding that a note belongs to another chord. Default 100ms
 *
 * @memberof music21.miditools
 * @type {number}
 */
miditools.maxDelay = 100; // in ms
/**
 * At what time (in ms since Epoch) the chord started.
 *
 * @memberof music21.miditools
 * @type {number}
 */
miditools.heldChordTime = 0;
/**
 * An Array (or undefined) of currently held chords that have not been sent out yet.
 *
 * @memberof music21.miditools
 * @type {Array|undefined}
 */
miditools.heldChordNotes = undefined;

/**
 * When, in MS since Jan 1, 1970, was the last {@link music21.note.Note} played.
 * Defaults to the time that the module was loaded.
 *
 * @memberof music21.miditools
 * @type {number}
 */
miditools.timeOfLastNote = Date.now(); // in ms

miditools._baseTempo = 60;
/**
 * Assign (or query) a Metronome object to run all timing information.
 *
 * @memberof music21.miditools
 * @type {music21.tempo.Metronome}
 */
miditools.metronome = undefined;

Object.defineProperties(miditools, {
    tempo: {
        enumerable: true,
        get() {
            if (this.metronome === undefined) {
                return this._baseTempo;
            } else {
                return this.metronome.tempo;
            }
        },
        set(t) {
            if (this.metronome === undefined) {
                this._baseTempo = t;
            } else {
                this.metronome.tempo = t;
            }
        },
    },
});

/* --------- chords ------------- */
/**
 *  Clears chords that are older than miditools.heldChordTime
 *
 *  Runs a setTimeout on itself.
 *  Calls miditools.sendOutChord
 *
 *  @memberof music21.miditools
 */
miditools.clearOldChords = function clearOldChords() {
    // clear out notes that may be a chord...
    const nowInMs = Date.now(); // in ms
    if (miditools.heldChordTime + miditools.maxDelay < nowInMs) {
        miditools.heldChordTime = nowInMs;
        if (miditools.heldChordNotes !== undefined) {
            // console.log('to send out chords');
            miditools.sendOutChord(miditools.heldChordNotes);
            miditools.heldChordNotes = undefined;
        }
    }
    setTimeout(miditools.clearOldChords, miditools.maxDelay);
};
/**
 *  Take a series of jEvent noteOn objects and convert them to a single Chord object
 *  so long as they are all sounded within miditools.maxDelay milliseconds of each other.
 *  this method stores notes in miditools.heldChordNotes (Array).
 *
 *  @param {music21.miditools.Event} jEvent
 *  @memberof music21.miditools
 *  @returns undefined
 */
miditools.makeChords = function makeChords(jEvent) {
    // jEvent is a miditools.Event object
    if (jEvent.noteOn) {
        const m21n = jEvent.music21Note();
        if (miditools.heldChordNotes === undefined) {
            miditools.heldChordNotes = [m21n];
        } else {
            for (let i = 0; i < miditools.heldChordNotes.length; i++) {
                const foundNote = miditools.heldChordNotes[i];
                if (foundNote.pitch.ps === m21n.pitch.ps) {
                    return; // no duplicates
                }
            }
            miditools.heldChordNotes.push(m21n);
        }
    }
};

/**
 * The last Note or Chord to be sent out from miditools.  This is an important semi-global
 * attribute, since the last element may need to be quantized by quantizeLastNote() to
 * determine its length, since the note may need to be placed into a staff before its total
 * length can be determined.
 *
 * @memberof music21.miditools
 * @type {music21.chord.Chord|music21.note.Note|undefined}
 */
miditools.lastElement = undefined;

/**
 * Take the list of Notes and makes a chord out of it, if appropriate and call
 * {@link music21.miditools.callBacks.sendOutChord} callback with the Chord or Note as a parameter.
 *
 * @memberof music21.miditools
 * @param {Array<music21.note.Note>} chordNoteList - an Array of {@link music21.note.Note} objects
 * @returns {(music21.note.Note|music21.chord.Chord|undefined)} A {@link music21.chord.Chord} object,
 * most likely, but maybe a {@link music21.note.Note} object)
 */
miditools.sendOutChord = function sendOutChord(chordNoteList) {
    let appendObject;
    if (chordNoteList.length > 1) {
        // console.log(chordNoteList[0].name, chordNoteList[1].name);
        appendObject = new chord.Chord(chordNoteList);
    } else if (chordNoteList.length === 1) {
        appendObject = chordNoteList[0]; // note object
    } else {
        return undefined;
    }
    appendObject.stemDirection = 'noStem';
    miditools.quantizeLastNote();
    miditools.lastElement = appendObject;
    if (miditools.callBacks.sendOutChord !== undefined) {
        miditools.callBacks.sendOutChord(appendObject);
    }
    return appendObject;
};

/* ----------- callbacks --------- */
// TODO: all callbacks (incl. raw, sendOutChord) should be able to be a function or an array of functions


// noinspection JSUnusedLocalSymbols
/**
* callBacks is an object with three keys:
*
* - raw: function (t, a, b,c) to call when any midi event arrives. Default: `function (t, a, b, c) { return new miditools.Event(t, a, b, c); }`
* - general: function ( miditools.Event() ) to call when an Event object has been created. Default: `[miditools.sendToMIDIjs, miditools.quantizeLastNote]`
* - sendOutChord: function (array_of_note.Note_objects) to call when a sufficient time has passed to build a chord from input. Default: empty function.
*
* At present, only "general" can take an Array of event listening functions, but I hope to change that for sendOutChord also.
*
* "general" is usually the callback list to play around with.
*
* @memberof music21.miditools
*/
miditools.callBacks = {
    raw: (t, a, b, c) => new miditools.Event(t, a, b, c),
    general: [miditools.sendToMIDIjs, miditools.quantizeLastNote],
    sendOutChord: arrayOfNotes => {},
};

/**
 * Quantizes the lastElement (passed in) or music21.miditools.lastElement.
 *
 * @memberof music21.miditools
 * @param {music21.note.GeneralNote} [lastElement] - A {@link music21.note.Note} to be quantized
 * @returns {music21.note.GeneralNote} The same {@link music21.note.Note} object passed in with
 * duration quantized
 */
miditools.quantizeLastNote = function quantizeLastNote(lastElement) {
    if (lastElement === undefined) {
        lastElement = this.lastElement;
        if (lastElement === undefined) {
            return undefined;
        }
    }
    // noinspection JSUnresolvedVariable
    if (typeof lastElement.stemDirection !== 'undefined') {
        lastElement.stemDirection = undefined;
    }
    const nowInMS = Date.now();
    const msSinceLastNote = nowInMS - this.timeOfLastNote;
    this.timeOfLastNote = nowInMS;
    const normalQuarterNoteLength = 1000 * 60 / this.tempo;
    const numQuarterNotes = msSinceLastNote / normalQuarterNoteLength;
    let roundedQuarterLength = Math.round(4 * numQuarterNotes) / 4;
    if (roundedQuarterLength >= 4) {
        roundedQuarterLength = 4;
    } else if (roundedQuarterLength >= 3) {
        roundedQuarterLength = 3;
    } else if (roundedQuarterLength > 2) {
        roundedQuarterLength = 2;
    } else if (roundedQuarterLength === 1.25) {
        roundedQuarterLength = 1;
    } else if (roundedQuarterLength === 0.75) {
        roundedQuarterLength = 0.5;
    } else if (roundedQuarterLength === 0) {
        roundedQuarterLength = 0.125;
    }
    lastElement.duration.quarterLength = roundedQuarterLength;
    return lastElement;
};

/* ----------- callbacks --------- */
/**
 * Callback to midiEvent.sendToMIDIjs.
 *
 * @memberof music21.miditools
 * @param {music21.miditools.Event} midiEvent - event to send out.
 * @returns undefined
 */
miditools.sendToMIDIjs = midiEvent => {
    midiEvent.sendToMIDIjs();
};

/* ------------ MIDI.js ----------- */

/**
 * a mapping of soundfont text names to true, false, or "loading".
 *
 * @memberof music21.miditools
 * @type {Object}
 */
miditools.loadedSoundfonts = {};

/**
 * Called after a soundfont has been loaded. The callback is better to be specified elsewhere
 * rather than overriding this important method.
 *
 * @memberof music21.miditools
 * @param {string} soundfont The name of the soundfont that was just loaded
 * @param {function} callback A function to be called after the soundfont is loaded.
 */
miditools.postLoadCallback = function postLoadCallback(soundfont, callback) {
    // this should be bound to MIDI
    if (debug) {
        console.log('soundfont loaded about to execute callback.');
        console.log(
            'first playing two notes very softly -- seems to flush the buffer.'
        );
    }
    $('.loadingSoundfont').remove();

    // noinspection JSUnresolvedVariable
    const isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
    const isAudioTag = MIDI.config.api === 'audiotag';
    const instrumentObj = instrument.find(soundfont);
    if (instrumentObj !== undefined) {
        MIDI.programChange(
            instrumentObj.midiChannel,
            instrumentObj.midiProgram
        );
        if (debug) {
            console.log(
                soundfont + ' (' + instrumentObj.midiProgram + ') loaded on ',
                instrumentObj.midiChannel
            );
        }
        if (isFirefox === false && isAudioTag === false) {
            // Firefox ignores sound volume! so don't play! 
            // as does IE and others using HTML audio tag.
            const channel = instrumentObj.midiChannel;
            MIDI.noteOn(channel, 36, 1, 0);    // if no notes have been played before then
            MIDI.noteOff(channel, 36, 1, 0.1); // the second note to be played is always
            MIDI.noteOn(channel, 48, 1, 0.2);  // very clipped (on Safari at least)
            MIDI.noteOff(channel, 48, 1, 0.3); // this helps a lot.
            MIDI.noteOn(channel, 60, 1, 0.3);  // chrome needs three notes?
            MIDI.noteOff(channel, 60, 1, 0.4);
        }
    }
    if (callback !== undefined) {
        callback(instrumentObj);
    }
    miditools.loadedSoundfonts[soundfont] = true;
};

/**
 * method to load soundfonts while waiting for other processes that need them
 * to load first.
 *
 * @memberof music21.miditools
 * @param {String} soundfont The name of the soundfont that was just loaded
 * @param {function} [callback] A function to be called after the soundfont is loaded.
 * @example
 * s = new music21.stream.Stream();
 * music21.miditools.loadSoundfont(
 *     'clarinet',
 *     function(i) {
 *         console.log('instrument object', i, 'loaded');
 *         s.instrument = i;
 * });
 */
miditools.loadSoundfont = function loadSoundfont(soundfont, callback) {
    if (miditools.loadedSoundfonts[soundfont] === true) {
        // this soundfont has already been loaded once, so just call the callback.
        if (callback !== undefined) {
            const instrumentObj = instrument.find(soundfont);
            callback(instrumentObj);
        }
    } else if (miditools.loadedSoundfonts[soundfont] === 'loading') {
        // we are still waiting for this instrument to load, so
        // wait for it before calling callback.
        const waitThenCall = () => {
            if (miditools.loadedSoundfonts[soundfont] === true) {
                if (debug) {
                    console.log(
                        'other process has finished loading; calling callback'
                    );
                }
                if (callback !== undefined) {
                    const instrumentObj = instrument.find(soundfont);
                    callback(instrumentObj);
                }
            } else {
                if (debug) {
                    console.log('waiting for other process load');
                }
                setTimeout(waitThenCall, 100);
            }
        };
        waitThenCall();
    } else {
        // soundfont we have not seen before:
        // set its status to loading and then load it.
        miditools.loadedSoundfonts[soundfont] = 'loading';
        if (debug) {
            console.log('waiting for document ready');
        }
        $(document).ready(() => {
            if (debug) {
                console.log('document ready, waiting to load soundfont');
            }
            $(document.body).append(
                $(
                    "<div class='loadingSoundfont'><b>Loading MIDI Instrument</b>: "
                        + 'audio will begin when this message disappears.</div>'
                )
            );
            console.log(MIDI);
            MIDI.loadPlugin({
                soundfontUrl: common.urls.soundfontUrl,
                instrument: soundfont,
                onsuccess: miditools.postLoadCallback.bind(
                    MIDI,
                    soundfont,
                    callback
                ),
            });
        });
    }
};

/**
 * MidiPlayer -- an embedded midi player including the ability to create a
 * playback device.
 *
 * @class MidiPlayer
 * @memberOf music21.miditools
 * @property {number} speed - playback speed scaling (1=default).
 * @property {jQuery|undefined} $playDiv - div holding the player,
 */
export class MidiPlayer {
    constructor() {
        this.player = new MIDI.Player();
        this.speed = 1.0;
        this.$playDiv = undefined;
    }
    /**
     * @param {jQuery|Node} where
     * @returns {Node}
     */
    addPlayer(where) {
        let $where = where;
        if (where === undefined) {
            where = document.body;
        }
        // noinspection JSUnresolvedVariable
        if (where.jquery === undefined) {
            $where = $(where);
        }
        const $playDiv = $('<div class="midiPlayer">');
        const $controls = $('<div class="positionControls">');
        const $playPause = $(
            '<input type="image" alt="play" src="'
                + this.playPng()
                + '" align="absmiddle" value="play" class="playPause">'
        );
        const $stop = $(
            '<input type="image" alt="stop" src="'
                + this.stopPng()
                + '" align="absmiddle" value="stop" class="stopButton">'
        );

        $playPause.on('click', () => this.pausePlayStop());
        $stop.on('click', () => this.stopButton());
        $controls.append($playPause);
        $controls.append($stop);
        $playDiv.append($controls);

        const $time = $('<div class="timeControls">');
        const $timePlayed = $('<span class="timePlayed">0:00</span>');
        const $capsule = $(
            '<span class="capsule"><span class="cursor"></span></span>'
        );
        const $timeRemaining = $('<span class="timeRemaining">-0:00</span>');
        $time.append($timePlayed);
        $time.append($capsule);
        $time.append($timeRemaining);
        $playDiv.append($time);

        $where.append($playDiv);
        this.$playDiv = $playDiv;
        return $playDiv;
    }

    stopButton() {
        this.pausePlayStop('yes');
    }

    playPng() {
        return common.urls.midiPlayer + '/play.png';
    }
    pausePng() {
        return common.urls.midiPlayer + '/pause.png';
    }
    stopPng() {
        return common.urls.midiPlayer + '/stop.png';
    }

    pausePlayStop(stop) {
        let d;
        if (this.$playDiv === undefined) {
            d = { src: 'doesnt matter' };
        } else {
            d = this.$playDiv.find('.playPause')[0];
        }
        if (stop === 'yes') {
            this.player.stop();
            d.src = this.playPng();
        } else if (this.player.playing || stop === 'pause') {
            d.src = this.playPng();
            this.player.pause(true);
        } else {
            d.src = this.pausePng();
            this.player.resume();
        }
    }

    base64Load(b64data) {
        const player = this.player;
        player.timeWarp = this.speed;

        const m21midiplayer = this;
        miditools.loadSoundfont('acoustic_grand_piano', () => {
            player.loadFile(
                b64data,
                () => {
                    // success
                    m21midiplayer.fileLoaded();
                },
                undefined, // loading
                e => {
                    // failure
                    console.log(e);
                }
            );
        });
    }

    songFinished() {
        this.pausePlayStop('yes');
    }

    fileLoaded() {
        this.updatePlaying();
    }

    startAndUpdate() {
        this.player.start();
        this.updatePlaying();
    }

    updatePlaying() {
        const self = this;
        const player = this.player;
        if (this.$playDiv === undefined) {
            return;
        }
        const $d = this.$playDiv;
        // update the timestamp
        const timePlayed = $d.find('.timePlayed')[0];
        const timeRemaining = $d.find('.timeRemaining')[0];
        const timeCursor = $d.find('.cursor')[0];
        const $capsule = $d.find('.capsule');
        //
        $capsule.on('dragstart', e => {
            player.currentTime = (e.pageX - $capsule.left) / 420 * player.endTime;
            if (player.currentTime < 0) {
                player.currentTime = 0;
            }
            if (player.currentTime > player.endTime) {
                player.currentTime = player.endTime;
            }
            if (self.state === 'down') {
                this.pausePlayStop('pause');
            } else if (self.state === 'up') {
                this.pausePlayStop('play');
            }
        });
        //
        const timeFormatting = n => {
            const minutes = (n / 60) >> 0;
            let seconds = String((n - minutes * 60) >> 0);
            if (seconds.length === 1) {
                seconds = '0' + seconds;
            }
            return minutes + ':' + seconds;
        };

        player.setAnimation(data => {
            const percent = data.now / data.end;
            const now = data.now >> 0; // where we are now
            const end = data.end >> 0; // end of song
            if (now === end) {
                // go to next song
                self.songFinished();
            }
            // display the information to the user
            timeCursor.style.width = percent * 100 + '%';
            timePlayed.innerHTML = timeFormatting(now);
            timeRemaining.innerHTML = '-' + timeFormatting(end - now);
        });
    }
}
miditools.MidiPlayer = MidiPlayer;
