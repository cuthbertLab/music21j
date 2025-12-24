# Music21j

**Music21j: An Interactive Framework for Musical Analysis**

Copyright (c) 2013-25, Michael Scott Asato Cuthbert, some rights reserved (BSD).

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
home page; currently building docs is broken

Begin at the {@link music21} namespace (click the link or use the
menu above), or start with
a specific one such as {@link music21.note} or {@link music21.stream}
or a Class such as {@link music21.note.Note} or {@link music21.stream.Stream}.

(Ignore “Modules” they’re not useful and duplicate the namespace pages).

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

To use music21j in your own page, place in a html page like this 
(this assumes that you’re using the Vite Dev server above).

```html
<html lang="en">
<head>
<title>music21 test</title>
</head>
<body>
   <script src="/node_modules/music21j/releases/music21.debug.js">
   </script>
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

To load soundfonts from other locations (like in a CDN),
(1) set a global `m21conf` variable to disable loading soundfonts,
(2) load the music21j script, and (3) set the new soundfont location,
and (4) load the soundfont.

This fragment shows how to do it.  A working implementation is in the
testHTML directory as `sfElsewhereCDN.html`.

```html
<body>
<script>
    window.m21conf = { loadSoundfont: false };
</script>
<script 
    src="https://cdn.jsdelivr.net/npm/music21j/releases/music21.debug.min.js"
></script>
<script>
    music21.common.urls.soundfontUrl = 'https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM/';
    music21.miditools.loadSoundfont('clarinet', i => {
       const tn = music21.tinyNotation.TinyNotation('4/4 c4 d e f g1');
       tn.instrument = i;
       tn.playStream();
    });
</script>
</body>
```

## Version

0.20 (beta)

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


## Development

Since v0.20, **music21j** uses **Vite** to produce the browser bundle. The legacy
Grunt + Webpack build pipeline has been retired for builds.

To develop run

```sh
$ npm run dev
```

and navigate to http://localhost:5173/testHTML to see various tests.


### Watch / development mode

To rebuild automatically on changes and serve files locally:

```sh
$ npm run dev
```

This starts Vite’s development server with fast rebuilds and live reload.

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

To run tests with the Vite server already running:

```sh
$ npm run test:qunit
```

If you have the Vite server running, you can also just navigate to 
http://localhost:5173/tests/ and see the tests there (with output).

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
and (if bigger than patch), here.  Then do all the steps again from the start.

2. Publish:

```sh
$ npm publish
```

This will test to make sure everything is correct, update package-lock.json,
copy the current contents of `build` in `releases`, and publish on npm.


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
