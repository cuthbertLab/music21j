# Music21j

**Music21j: An Interactive Framework for Musical Analysis**

Copyright (c) 2013-2026, Michael Scott Asato Cuthbert, some rights reserved (BSD).

**Music21j** is a Javascript reinterpretation of the [Music21 Python] package,
a toolkit for computer-aided musicology, now with intuitive HTML/Javascript
interfaces. Some things music21j can do include:
	•	Visualize and hear changes in Streams quickly (using [Vexflow] and [MIDI.js])
	•	Connect scores to MIDI devices (via Web Midi or [JazzSoft] plugin)
	•	Analyze and perform music theory at a lower level than Python music21
	•	Provide a repository of modules such as metronomes, keyboards, and automatic transcribers.

Though it does not have all the power of [Music21 Python], music21j can help with
a number of research problems in music history and theory. The introduction to the
Python package will say more about it (it’s better documented). The “namespaces”
tab above will give introductions to some features of music21j. At this
point we’re focusing on documenting usage; developer docs will come
later.

Music21j requires your users to have a relatively recent web browser – the project
targets browsers no more than 30 months old.
Safari is the only major desktop browser for which there is no out of the box
support for MIDI devices.

## Documentation

This README appears in both the GitHub home page and the documentation
home page; currently building docs is broken.

Begin at the {@link music21} namespace (click the link or use the
menu above), or start with
a specific one such as {@link music21.note} or {@link music21.stream}
or a Class such as {@link music21.note.Note} or {@link music21.stream.Stream}.

(Ignore “Modules” they’re not useful and duplicate the namespace pages).

## Demo

Demonstrations of music21j are available on Github:

* [Play notes on an on-screen keyboard](https://cuthbertlab.github.io/music21j/testHTML/keyboard.html)
* [Play w/ MIDI keyboard](https://cuthbertlab.github.io/music21j/testHTML/showKeyboard.html)
* [Play w/ Music21j in a Sandbox](https://cuthbertlab.github.io/music21j/testHTML/m21jSandbox.html)
* [MusicXML Parsing](https://cuthbertlab.github.io/music21j/testHTML/musicxmlTest.html)
* [Instruments setup and switching](https://cuthbertlab.github.io/music21j/testHTML/instruments.html)
* [Demo loading music21j and soundfonts from elsewhere](https://cuthbertlab.github.io/music21j/testHTML/sfElsewhereCDN.html)
* [Match pitches game](https://cuthbertlab.github.io/music21j/testHTML/audioSearchGame.html)
* [Drag-to-create score](https://cuthbertlab.github.io/music21j/testHTML/demo-DragScore.html)


See at the bottom for more demos

## Example

Install by downloading a copy of the music21 code to your own web server.

% npm install music21j

If this line (`npm install`) doesn’t work, download the
latest version of `node.js` from https://nodejs.org/en/download/

A guide to installing music21j on Windows would be appreciated.

The files in music21j are best viewed by running your own
webserver (rather than using `file:///...` links) using Vite

$ cd ~/git/music21j
$ npm install
$ npm run dev

Then navigate to http://localhost:5173/testHTML/ for some demos.

To use music21j in your own website/wrokflow, place in a html page like this 
(this assumes that you’re using the Vite Dev server above).

```html
<!DOCTYPE html>
<html lang="en">                                                                                            
<head>                                                    
  <meta charset="utf-8">
  <title>music21 test</title>
  <link rel="stylesheet"                                                                                  
        href="https://cdn.jsdelivr.net/npm/music21j/releases/music21j.css">
  <script src="https://cdn.jsdelivr.net/npm/music21j/releases/music21.debug.js"></script>                 
</head>                                                                                                     
<body>
  <script>                                                                                                
      const n = new music21.note.Note('F#');            
      const s = new music21.stream.Stream();                                                              
      s.append(n);
      s.appendNewDOM();                                                                                   
  </script>                                             
</body>
</html>
```

or use it in your own JavaScript/TypeScript project:

```
$ npm install --save music21j
```

```javascript
import * as music21 from 'music21j';

const n = new music21.note.Note('F#');
// etc.
```

### Embedding, etc.

Music21j was originally intended for self-hosting, so embedding is not
yet as simple as it should be.

To load soundfonts from elsewhere (e.g. a CDN):

1. Before loading music21j, set `window.m21conf = { loadSoundfont: false }`
   so it doesn't fetch the default soundfont.
2. Load music21j.
3. After it loads, set `music21.common.urls.soundfontUrl` to the new
   location and call `music21.miditools.loadSoundfont(...)`.

A complete page is in `testHTML/sfElsewhereCDN.html`.

```html
<body>
<script>
    window.m21conf = { loadSoundfont: false };
</script>
<script src="https://cdn.jsdelivr.net/npm/music21j/releases/music21.debug.js"></script>
<script>
    music21.common.urls.soundfontUrl =
        'https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts/FluidR3_GM/';
    music21.miditools.loadSoundfont('clarinet', i => {
        const tn = music21.tinyNotation.TinyNotation('4/4 c4 d e f g1');
        tn.instrument = i;
        tn.playStream();
    });
</script>
</body>
```

## Version

0.23.1 (beta)

## License

Music21j is released under the BSD 3-Clause License. Essentially you
can do with it what you want so long as you leave in my copyright statements
and do not represent that I endorse your product.

## Thanks

Thanks to the following packages (among others) for making music21j possible:

* [Vexflow] - music notation in HTML5
* [midicube] - audio processing of MIDI based on [MIDI.js]
* [Jazzsoft] - plug-in for accessing MIDI in the browser in the absence of WebMIDI Api.
* [QUnit] - testing framework
* [jsdoc] - makes this documentation possible

The Python version of music21 was supported by grants from
the Seaver Institute and the National Endowment for the Humanities.  
Earlier versions of music21 were supported by the Music and Theater Arts 
section of [MIT] (when Cuthbert was a professor there).

[MIT]:http://web.mit.edu
[music21 python]:https://www.music21.org/music21docs/
[midicube]:https://github.com/mscuthbert/midicube
[Vexflow]:http://www.vexflow.com
[MIDI.js]:http://mudcu.be/midi-js/
[Jazzsoft]:http://jazz-soft.net
[QUnit]:http://qunitjs.com
[jsdoc]:http://usejsdoc.org

### More testHTML demos

* [HTML5 pitch detector](https://cuthbertlab.github.io/music21j/testHTML/audioSearchTest.html)
* [Chord with violin sound](https://cuthbertlab.github.io/music21j/testHTML/chord_violin_test.html)
* [Color a clicked note](https://cuthbertlab.github.io/music21j/testHTML/colorChanger.html)
* [Microphone delay loop](https://cuthbertlab.github.io/music21j/testHTML/delayMic.html)
* [Original music21j demo](https://cuthbertlab.github.io/music21j/testHTML/demo-Cuthbert.html)
* [Embedded MIDI player](https://cuthbertlab.github.io/music21j/testHTML/embedPlayer.html) or [multi-instrument MIDI player](https://cuthbertlab.github.io/music21j/testHTML/midiPlayerMultiInstrument.html)
* [MIDI keyboard simple](https://cuthbertlab.github.io/music21j/testHTML/keyboardJazz.html)
* [MIDI keyboard w/ chord rendering](https://cuthbertlab.github.io/music21j/testHTML/midiInChords.html) or [w/ custom MIDI failure handler](https://cuthbertlab.github.io/music21j/testHTML/midiInChordsCustomFail.html) or [with key signature](https://cuthbertlab.github.io/music21j/testHTML/midiInKeyChords.html)
* [MIDI-in audio playback (w/o notation)](https://cuthbertlab.github.io/music21j/testHTML/midiInRequire.html)
* [Pitch editing on a single measure](https://cuthbertlab.github.io/music21j/testHTML/pitchEditing.html) or [on a long score](https://cuthbertlab.github.io/music21j/testHTML/pitchEditing_long_score.html)
* [Rendered notation direct in HTML (no code)](https://cuthbertlab.github.io/music21j/testHTML/renderTinyNotationDivs.html)
* [stream.clone() demo](https://cuthbertlab.github.io/music21j/testHTML/streamClone.html)
* [XY mouse tracking on notation](https://cuthbertlab.github.io/music21j/testHTML/xyLocation.html)



## Development

Since v0.20, **music21j** uses **Vite** to produce the browser bundle. The legacy
Grunt + Webpack build pipeline has been retired for builds.

### First-time setup

The first time you run, you will need to install the development
dependencies.  Change directories to here and run

```sh
$ npm install
$ npx playwright install chromium
```

If you place a copy of Python music21 in a subdirectory called music21python,
coding agents may be able to use it to improve or standardize your code (it is gitignored).
If you place a copy of Python music21's docs (from documentation/autogenerated) in music21docs,
coding agents can use that too.

### Normal development

To develop, run this npm command:

```sh
$ npm run dev
```
and navigate to http://localhost:5173/testHTML to see various tests.

(if sound is not working and stalled on "Loading Instrument" run `npm install` again to
download soundfonts)

### Watch / development mode

To rebuild automatically on changes and serve files locally:

```sh
$ npm run dev
```

This starts Vite’s development server with fast rebuilds and live reload.
(Note that the testHTML files currently reference the hardcoded 
releases/music21.debug.js file -- they are set up as a playground
rather than for testing purposes right now; making both possible is a TODO)

## TestHTML in Developing

After running `npm run dev`, try navigating to /testHTML/m21jSandbox-hot-reload.html, such as at:
http://localhost:5173/testHTML/m21jSandbox-hot-reload.html which will update the output as you
type, but also reload music21j as you edit it.

For other testHTML files, the paradigm is to use 
`<script type="module" src="./m21-dev.ts"></script>` while developing (to get hot reload) 
and then switch to
`<script src="../releases/music21.debug.js"></script>` when commiting (so that it works on
`cuthbertLab.github.io/music21j/`)


## Testing

music21j tests run in a real browser using **QUnit + Playwright**, orchestrated
via Vite. This allows tests to render SVG output and exercise audio-related APIs.

To run the full test suite headlessly:

```sh
$ npm test
```

This will:
	•	start a Vite development server
	•	run QUnit tests in headless Chromium
	•	fail with detailed assertion output if any test fails

(Note that the first time you run you will need to install a headless Chrome 200MB
with `npx playwright install chromium`)


To run tests with the Vite server already running:

```sh
$ npm run test:qunit
```

If you have the Vite server running, you can also just navigate to 
http://localhost:5173/tests/ and see the tests there (with output).

### Running a single suite or test

To narrow down what runs (helpful when iterating on a single module), use
the `MODULE` and `FILTER` env vars with `npm test` / `npm run test:qunit`,
or pass the same names as URL query parameters when browsing manually.

`MODULE` matches a single suite (one of the files in `tests/moduleTests/`),
and `FILTER` is a substring/regex that matches against test names.

```sh
# Run only the key suite headlessly:
$ MODULE=key npm test

# Run every test whose name contains "update" -- this picks up tests
# across several suites:
$ FILTER=update npm test

# Combine: only "update" tests inside the key suite:
$ MODULE=key FILTER=update npm test
```

In the browser, the same knobs are query parameters:

* `http://localhost:5173/tests/?module=key`
* `http://localhost:5173/tests/?filter=update`
* `http://localhost:5173/tests/?module=key&filter=update`

## Build

Run vite with:

```sh
$ npm run build
```

This produces:

- `build/music21.debug.js` (UMD bundle, global `music21`)
- various sourcemaps.

The build output is suitable for direct browser use or npm publishing.


## Publishing a new version

You'll need to be part of the npm dev team.

1. Update the version number in `package.json`, manually in `main.ts`, 
and here.  Agents can update package-lock.json; humans should npm install.

2. Publish:

```sh
$ npm publish
```

This will test to make sure everything is correct, update package-lock.json,
copy the current contents of `build` in `releases`, and publish on npm.

Then push to master with name `music21j v0.22.1` (or do a PR and merge that if paranoid)
and then create a tag and push

```shell
$ git tag -a v0.xx.y -m 'music21j v0.xx.y'
$ git push origin --tags
```

## Updating Dependencies

Every once in a while run (in the music21j directory)

```sh
$ npx npm-check-updates
```

(You may have it installed as "ncu")

If it looks like there is something to update, run

```sh
$ npx npm-check-updates -u
$ npm install
```

## Github Pages

Github Pages has a live version of the site, built on the releases/ folder (hence
why testHTML references releases).  Every once in a while update it so it points to
the main/master/HEAD page.  NOTE: it also has a copy of the soundfonts there (removed
from .gitignore) which allows it to serve from its own sound files.

## Changes

Just documenting major changes at different versions, starting with 0.20

* v0.23.2 -- Chord gains `simplifyMultipleEnharmonics` (ported from music21p). `Chord.clone(true)` deep-copies notes and no longer shares `_cache`/`_overrides` by reference. Remove spurious natural accidental from musicxml output. Internal cleanups: options-object signatures for `simplifyMultipleEnharmonics` and `_dissonanceScore`.
* v0.23.1 -- MIDI Player timeline scrubber works again (overlay invisible `<input type="range">`); vertically centered Player controls; bump to midicube 0.10.1 with noteOff release-envelope and source-tracking fixes.
* v0.23 -- MIDIPlayer supports multiple instruments, loadSoundfont w/o Callback returns a Promise and takes an array of instruments. TestHTML organized and working. Errors in soundfont URLs fiexed. replaceDOM accepts a querySelector string (like appendNewDOM - and as documented for a long time). Augmented unisons fixed in VF4. chord getStemDirectionFromClef.  Ability to run just one unit test.
* v0.22 -- Chord, getStemDirectionFromClef. roman minor 67 cautionary and other Roman numeral improvements. typing of scales. run one qunit test ability. Add agent coding skills. typing of voice leading. playwright cache. Standardize barline names (not backwards compatible). Soundfont doubled trailing slash fixed. 
* v0.21 -- improve cautionary accidentals on Vexflow render; custom MIDI failure msg.
* v0.20 -- build via vite.  MIDI is no longer exposed as top-level export. Add ES
